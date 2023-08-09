import { ioc } from '#root/ioc/index.js'
import { ApolloServer } from '@apollo/server'
import { Resolvers } from '#root/components/index.js'
import fastifyApollo, {
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

export const GraphQlPlugin = ioc.add(
    [Resolvers],
    (schema): FastifyPluginAsyncTypebox =>
        async (server) => {
            const apollo = new ApolloServer({
                schema,
                plugins: [fastifyApolloDrainPlugin(server)],
                formatError(formatedError, error) {
                    return formatedError
                    // todo
                },
            })
            await apollo.start()
            await server.register(fastifyApollo(apollo))
        },
)
