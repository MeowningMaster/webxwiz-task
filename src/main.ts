import { ioc } from './ioc/index.js'
import { Server } from './server/index.js'
import gracefulShutdown from 'close-with-grace'

const server = await ioc.resolve(Server)
await server.listen()

gracefulShutdown({ delay: 1000 }, async () => {
    await server.instance.close()
})
