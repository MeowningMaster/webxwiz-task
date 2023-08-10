import { OutgoingHttpHeaders } from 'http'
import { Injector, isOk } from '../injector.ts'
import { GraphQLClient } from 'graphql-request'

type Fetch = typeof fetch

export function GraphQlInjector(injector: Injector) {
    const fetch: Fetch = async (url, init = {}) => {
        if (typeof url !== 'string') {
            throw new Error('Unreachable state')
        }
        const reply = await injector({
            url,
            method: init.method as HTTPMethods | undefined,
            body: init.body ?? undefined,
            headers: init.headers as OutgoingHttpHeaders | undefined,
        })
        return {
            ok: isOk(reply.statusCode),
            redirected: false,
            status: reply.statusCode,
            statusText: reply.statusMessage,
            url,
            headers: new Headers(reply.headers as Record<string, string>),
            text() {
                return reply.payload
            },
        } as unknown as Response
    }

    return new GraphQLClient('/v1/graphql', { fetch })
}

type HTTPMethods =
    | 'DELETE'
    | 'delete'
    | 'GET'
    | 'get'
    | 'HEAD'
    | 'head'
    | 'PATCH'
    | 'patch'
    | 'POST'
    | 'post'
    | 'PUT'
    | 'put'
    | 'OPTIONS'
    | 'options'
