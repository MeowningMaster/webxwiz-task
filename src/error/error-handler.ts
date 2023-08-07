import { Plugin } from '#root/server/plugin-adapter.js'
import { ServerError } from './server-error.js'

export const errorHandler = Plugin()((server, options, done) => {
    server.setSchemaErrorFormatter((errors) => {
        return new ServerError('Validation error', {
            code: 400,
            context: { errors },
        })
    })

    server.setErrorHandler(function (error: unknown, request, reply) {
        const handleError = (error: ServerError) => {
            if (error.code >= 500 && error.code < 600) {
                this.log.error(error)
            }

            reply.status(error.code).send({
                message: error.message,
                context: error.context,
                cause: error.cause,
            })
        }

        if (!(error instanceof Error)) {
            handleError(new ServerError('Unknown error', { cause: error }))
            return
        }

        if (error instanceof ServerError) {
            handleError(error)
            return
        }

        handleError(
            new ServerError(error.message, {
                cause: error.cause,
                stack: error.stack,
            }),
        )
    })
    done()
})
