import { Type } from '@sinclair/typebox'

const Jwt = Type.Object({
    secret: Type.String(),
    expiresIn: Type.String(),
})

const Log = Type.Object({
    console: Type.Boolean(),
    file: Type.Optional(Type.String()),
})

const Port = Type.Integer({ minimum: 1, maximum: 65535 })

const Database = Type.Object({
    host: Type.String(),
    port: Port,
    database: Type.String(),
    user: Type.String(),
    password: Type.String(),
})

const Mailer = Type.Object({
    host: Type.String(),
    port: Port,
    auth: Type.Object({
        user: Type.String(),
        pass: Type.String(),
    }),
})

const Redis = Type.Object({
    host: Type.String(),
    port: Type.Number(),
})

export const Config = Type.Object({
    port: Type.Integer({ minimum: 1, maximum: 65535 }),
    externalUrl: Type.String({ format: 'uri' }),
    trustProxy: Type.Boolean(),
    expose: Type.Boolean(),
    jwt: Jwt,
    log: Log,
    database: Database,
    mailer: Mailer,
    redis: Redis,
})

export const PackageJson = Type.Object({
    name: Type.String(),
    description: Type.String(),
    version: Type.String(),
})
