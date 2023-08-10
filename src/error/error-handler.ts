import { fastifyPlugin } from 'fastify-plugin'
import { ServerError } from './server-error.js'
import { GraphQLFormattedError } from 'graphql'
import { Logger } from '#root/logger/index.ts'
import { ioc } from '#root/ioc/index.ts'

type ErrorHandler = (error: ServerError) => any

function genericHandler<Handler extends ErrorHandler>(
    error: unknown,
    handle: Handler,
): ReturnType<Handler> {
    if (!(error instanceof Error)) {
        return handle(new ServerError('Unknown error', { cause: error }))
    }

    if (error instanceof ServerError) {
        return handle(error)
    }

    return handle(
        new ServerError(error.message, {
            cause: error.cause,
            stack: error.stack,
        }),
    )
}

export const errorHandler = fastifyPlugin((server, options, done) => {
    server.setSchemaErrorFormatter((errors) => {
        return new ServerError('Validation error', {
            code: 400,
            context: { errors },
        })
    })

    server.setErrorHandler(function (error: unknown, request, reply) {
        const handleError: ErrorHandler = (error) => {
            if (error.code >= 500 && error.code < 600) {
                this.log.error(error)
            }

            return reply.status(error.code).send({
                message: error.message,
                context: error.context,
                cause: error.cause,
            })
        }
        genericHandler(error, handleError)
    })
    done()
})

export const ApolloErrorHandler = ioc.add(
    [Logger],
    (log) =>
        (
            formattedError: GraphQLFormattedError,
            error: unknown,
        ): GraphQLFormattedError => {
            const handleError = (error: ServerError) => {
                if (error.code >= 500 && error.code < 600) {
                    log.error(error)
                }

                return {
                    message: error.message,
                    extensions: {
                        context: error.context,
                        cause: error.cause,
                    },
                }
            }
            return genericHandler(error, handleError)
        },
)
