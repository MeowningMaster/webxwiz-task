import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import { Logger } from '#root/logger/index.js'
import { validator } from '#root/validator/index.js'
import fastify from 'fastify'
import { Controllers } from '../components/controllers.js'
import { Documentation } from './plugins/documentation/index.js'
import { errorHandler } from '#root/error/error-handler.js'
import fastifyQs from 'fastify-qs'
import { rateLimit } from './plugins/rate-limit.js'
import { Injector } from './plugins/injector.js'

export const Server = ioc.add(
    [Config, Logger, Controllers, Documentation],
    async (config, log, controllers, documentation) => {
        const server = fastify({
            trustProxy: config.trustProxy,
        })
        server.setValidatorCompiler(({ schema }) => validator.compile(schema))

        await server.register(documentation, { routePrefix: '/documentation' })
        await server.register(errorHandler)
        await server.register(fastifyQs.default)
        await server.register(rateLimit)
        await server.register(controllers, { prefix: '/v1' })

        return {
            instance: server,
            inject: Injector(server),

            async listen() {
                const host = config.expose
                    ? '0.0.0.0' // all interfaces
                    : '127.0.0.1' // localhost
                await server.listen({ port: config.port, host })

                log.info(
                    {
                        local: `http://${host}:${config.port}`,
                        external: config.externalUrl,
                    },
                    'Server listening',
                )
            },
        }
    },
)
