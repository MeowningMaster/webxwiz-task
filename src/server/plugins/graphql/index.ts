import { ioc } from '#root/ioc/index.js'
import { ApolloServer } from '@apollo/server'
import { Resolvers } from '#root/components/index.js'
import fastifyApollo, {
    ApolloFastifyContextFunction,
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Context } from './context.cjs'
import jwt from 'jsonwebtoken'
import { Config } from '#root/config/index.ts'
import { QueryComplexityPlugin } from './query-complexity.ts'

export const GraphQlPlugin = ioc.add(
    [Resolvers, Config, QueryComplexityPlugin],
    (schema, config, queryComplexityPlugin): FastifyPluginAsyncTypebox =>
        async (server) => {
            const apollo = new ApolloServer<Context>({
                schema,
                plugins: [
                    fastifyApolloDrainPlugin(server),
                    queryComplexityPlugin,
                ],
                formatError(formatedError, error) {
                    return formatedError
                    // todo
                },
            })
            await apollo.start()

            const context: ApolloFastifyContextFunction<Context> = async (
                request,
                reply,
            ) => {
                const { authorization } = request.headers
                let email: string | undefined
                if (authorization) {
                    const token = authorization.substring('Bearer '.length)
                    const payload = jwt.verify(token, config.jwt.secret) as {
                        email: string
                    }
                    email = payload.email
                }

                return { request, reply, email }
            }
            await server.register(fastifyApollo(apollo), {
                context,
            })
        },
)
