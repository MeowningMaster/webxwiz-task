import { ioc } from '#root/ioc/index.js'
import { ApolloServer } from '@apollo/server'
import { Resolvers } from '#root/components/index.js'
import fastifyApollo, {
    ApolloFastifyContextFunction,
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Context } from './context.cjs'

export const GraphQlPlugin = ioc.add(
    [Resolvers],
    (schema): FastifyPluginAsyncTypebox =>
        async (server) => {
            const apollo = new ApolloServer<Context>({
                schema,
                plugins: [fastifyApolloDrainPlugin(server)],
                formatError(formatedError, error) {
                    return formatedError
                    // todo
                },
            })
            await apollo.start()

            const context: ApolloFastifyContextFunction<Context> = async (
                request,
                reply,
            ) => ({
                request,
                reply,
            })
            await server.register(fastifyApollo(apollo), {
                context,
            })
        },
)
