import { FastifyReply, FastifyRequest } from 'fastify'

export type Context = {
    request: FastifyRequest
    reply: FastifyReply
    /** user email from token */
    email?: string
}
