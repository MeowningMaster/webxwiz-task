import { Static, TSchema } from '@sinclair/typebox'
import { FastifySchema, InjectOptions } from 'fastify'

export interface RouteSchema extends FastifySchema {
    body?: TSchema
    querystring?: TSchema
    params?: TSchema
    response?: { [Key: number]: TSchema }
}

type StaticOptional<T extends TSchema | undefined> = T extends TSchema
    ? Static<T>
    : undefined
export type StaticRoute<T extends RouteSchema> = {
    body: StaticOptional<T['body']>
    querystring: StaticOptional<T['querystring']>
    params: StaticOptional<T['params']>
    response: T['response'] extends object
        ? { [Key in keyof T['response']]: Static<T['response'][Key]> }
        : undefined
}
