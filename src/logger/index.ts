import { pino } from 'pino'
import { PrettyOptions } from 'pino-pretty'

import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import fs from 'node:fs'
import path from 'node:path'

async function createDirs(to: string) {
    const dir = path.dirname(to)
    if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true })
    }
}

export const Logger = ioc.add([Config], async (config) => {
    const targets: pino.TransportTargetOptions[] = []

    if (config.log.console) {
        const options: PrettyOptions = {
            translateTime: 'HH:MM:ss Z',
            ignore: ['pid', 'hostname'].join(','),
            colorize: true,
        }
        targets.push({
            target: 'pino-pretty',
            level: 'trace',
            options,
        })
    }

    if (config.log.file) {
        await createDirs(config.log.file)
        targets.push({
            target: 'pino/file',
            level: 'info',
            options: { destination: config.log.file },
        })
    }

    return pino({
        level: 'trace',
        transport: { targets },
    })
})
