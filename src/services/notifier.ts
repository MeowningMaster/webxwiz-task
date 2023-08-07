import { ioc } from '#root/ioc/index.js'
import { ConnectionOptions, Queue, Worker } from 'bullmq'
import * as task from '#root/components/task/index.js'
import { Mailer } from './mailer.js'
import * as email from '#root/components/email/index.js'
import { Config } from '#root/config/index.js'

const queueName = 'notifications'

type JobData = {
    userId: number
}

const jobIdManager = {
    prefix: 'task-',
    create(taskId: number) {
        return `${this.prefix}${taskId}`
    },
    parse(jobId: string) {
        return Number.parseInt(jobId.substring(this.prefix.length))
    },
}

export const Notifier = ioc.add(
    [Mailer, email.Logic, Config],
    (mailer, emailLogic, config) => {
        const connection: ConnectionOptions = config.redis

        const queue = new Queue<JobData>(queueName, {
            connection,
        })

        new Worker<JobData>(
            queueName,
            async (job) => {
                const taskLogic = await ioc.resolve(task.Logic)

                const taskId = jobIdManager.parse(job.id!)
                const { userId } = job.data

                const taskRecord = await taskLogic.get(userId, taskId)
                if (!taskRecord) {
                    return 'Task not found'
                }

                const emailRecord = await emailLogic.get(userId)
                if (!emailRecord) {
                    return 'No email'
                }
                if (!emailRecord.confirmed) {
                    return 'Email not confirmed'
                }

                await mailer.sendTaskNotification(emailRecord.email, taskRecord)
                return `Sent to ${emailRecord.email}`
            },
            {
                connection,
                removeOnComplete: {
                    count: 1000,
                },
                removeOnFail: {
                    count: 5000,
                },
            },
        )

        return {
            async set(
                userId: number,
                taskId: number,
                notifyDate: string | null,
            ) {
                const jobId = jobIdManager.create(taskId)

                const job = await queue.getJob(jobId)

                if (notifyDate === null || new Date(notifyDate) <= new Date()) {
                    if (job) {
                        await job.remove()
                    }
                    return
                }

                const delay = Number(new Date(notifyDate)) - Number(new Date())

                if (job) {
                    await job.changeDelay(delay)
                } else {
                    await queue.add('Notify', { userId }, { jobId, delay })
                }
            },
        }
    },
)
