import { ioc } from './ioc/index.js'
import { Logger } from './logger/index.js'
import { Server } from './server/index.js'
import gracefulShutdown from 'close-with-grace'

const server = await ioc.resolve(Server)
await server.listen()

const logger = await ioc.resolve(Logger)
gracefulShutdown({ delay: 1000 }, async ({ err, signal }) => {
    const error = err && { name: err.name, message: err.message }
    logger.info({ error, signal }, 'Server is shutting down')
    await server.instance.close()
})
