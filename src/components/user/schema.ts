import { Static, Type } from '@fastify/type-provider-typebox'

export type Credentials = Static<typeof Credentials>
export const Credentials = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 }),
})

export type JwtPayload = {
    id: number
    email: string
}
