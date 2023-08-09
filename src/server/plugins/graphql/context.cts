import { FastifyReply, FastifyRequest } from 'fastify'

export type Context = {
    request: FastifyRequest
    reply: FastifyReply
}
