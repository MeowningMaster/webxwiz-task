import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import { Logger } from '#root/logger/index.js'
import { validator } from '#root/validator/index.js'
import fastify from 'fastify'
import { errorHandler } from '#root/error/error-handler.js'
import { Injector } from './plugins/injector.js'
import { GraphQlPlugin } from './plugins/graphql/index.js'

export const Server = ioc.add(
    [Config, Logger, GraphQlPlugin],
    async (config, log, controllers) => {
        const server = fastify({
            trustProxy: config.trustProxy,
        })
        server.setValidatorCompiler(({ schema }) => validator.compile(schema))

        await server.register(errorHandler)
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
