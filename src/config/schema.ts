import { Type } from '@fastify/type-provider-typebox'

const Jwt = Type.Object({
    secret: Type.String(),
    expiresIn: Type.String(),
})

const Log = Type.Object({
    console: Type.Boolean(),
    file: Type.Optional(Type.String()),
})

const Port = Type.Integer({ minimum: 1, maximum: 65535 })

const Mongo = Type.Object({
    uri: Type.String({ format: 'uri' }),
})

export const Config = Type.Object({
    port: Port,
    externalUrl: Type.String({ format: 'uri' }),
    trustProxy: Type.Boolean(),
    expose: Type.Boolean(),
    jwt: Jwt,
    log: Log,
    mongo: Mongo,
})

export const PackageJson = Type.Object({
    name: Type.String(),
    description: Type.String(),
    version: Type.String(),
})
