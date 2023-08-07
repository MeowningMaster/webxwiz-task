import { ioc } from '#root/ioc/index.js'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { Plugin } from '../../plugin-adapter.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Config } from '#root/config/index.js'
import { TagsObjects, tagsObjects } from './tags.js'
import { Writable } from '#root/utilities/types/writable.js'
import { tokenHeader } from '#root/server/plugins/jwt-validator.js'

type Options = {
    routePrefix: string
}

export const tokenSecuritySchema = 'tokenAuth'

export const Documentation = ioc.add(
    [Config],
    (config): FastifyPluginAsyncTypebox<Options> =>
        Plugin<Options>()(async (server, { routePrefix }) => {
            await server.register(fastifySwagger, {
                openapi: {
                    openapi: '3.1.0',
                    info: {
                        title: config.packageJson.name,
                        version: config.packageJson.version,
                        description: config.packageJson.description,
                    },
                    tags: tagsObjects as Writable<TagsObjects>,
                    servers: [{ url: config.externalUrl }],
                    components: {
                        securitySchemes: {
                            [tokenSecuritySchema]: {
                                type: 'http',
                                scheme: 'bearer',
                                bearerFormat: 'JWT',
                            },
                        },
                    },
                },
            })
            await server.register(fastifySwaggerUi, {
                routePrefix,
            })
        }),
)
