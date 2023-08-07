import { Task } from '#root/components/task/schema.js'
import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import nodemailer from 'nodemailer'

export const Mailer = ioc.add([Config], async (config) => {
    const mailer = nodemailer.createTransport(config.mailer)
    const from = `"Task manager" <${config.mailer.auth.user}>`

    return {
        mailer,

        async sendEmailConfirmation(email: string, token: string) {
            const confirmUrl = new URL('/v1/email/confirm', config.externalUrl)
            confirmUrl.searchParams.set('token', token)
            await mailer.sendMail({
                from,
                to: email,
                subject: 'Confirmation email',
                html: `<a href="${confirmUrl}">Confirm</a>`,
            })
        },

        async sendTaskNotification(email: string, task: Task) {
            await mailer.sendMail({
                from,
                to: email,
                subject: 'Task notification',
                html: `<h1>${task.title}</h1><p>${task.description}</p>`,
            })
        },
    }
})
