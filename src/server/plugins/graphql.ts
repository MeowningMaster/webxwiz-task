import { ioc } from '#root/ioc/index.js'
import { ApolloServer } from '@apollo/server'
import { Graphql } from '#root/components/graphql.js'
import fastifyApollo, {
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

export const GrapqlPlugin = ioc.add(
    [Graphql],
    (schema): FastifyPluginAsyncTypebox =>
        async (server) => {
            const apollo = new ApolloServer({
                schema,
                plugins: [fastifyApolloDrainPlugin(server)],
            })
            await apollo.start()
            await server.register(fastifyApollo(apollo))
        },
)
