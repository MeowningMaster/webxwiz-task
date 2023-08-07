import { FastifyInstance, FastifySchema, InjectOptions } from 'fastify'
import { ServerError } from '#root/error/server-error.js'

export type RouteInjectOptions<T extends FastifySchema = FastifySchema> =
    InjectOptions & {
        body?: T['body']
    }

/** Request fastify from tests */
export function Injector(server: FastifyInstance) {
    return async <Schema extends FastifySchema = FastifySchema>(
        options: RouteInjectOptions<Schema> | string,
    ) => {
        const response = await server.inject(options as InjectOptions)

        let payload: any = undefined

        const contentType = response.headers['content-type']
        if (contentType !== undefined) {
            if (typeof contentType !== 'string') {
                throw new Error('Content-Type sould be string')
            }

            if (contentType.startsWith('text/plain')) {
                payload = response.body
            } else if (contentType.startsWith('application/json')) {
                payload = response.json()
            }
        }

        if (!isOk(response.statusCode)) {
            const error = payload as ServerError
            throw new ServerError(error.message, {
                code: response.statusCode,
                context: error.context,
            })
        }

        const body = payload as Schema['response'] extends { 200: any }
            ? Schema['response'][200]
            : undefined
        return { ...response, body }
    }
}

function isOk(code: number) {
    return code >= 200 && code < 300
}
