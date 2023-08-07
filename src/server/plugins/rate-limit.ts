import { ServerError } from '#root/error/server-error.js'
import { Plugin } from '../plugin-adapter.js'
import { fastifyRateLimit } from '@fastify/rate-limit'

export const rateLimit = Plugin()(async (server, options) => {
    await server.register(fastifyRateLimit, {
        max: 100,
        timeWindow: '1m',
        errorResponseBuilder: function (request, context) {
            return new ServerError(
                `Rate limit exceeded, retry in ${context.after}`,
                {
                    code: 429,
                    context: {
                        max: context.max,
                        ttl: context.ttl,
                    },
                },
            )
        },
    })
})
