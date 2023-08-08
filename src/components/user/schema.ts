import { Static, Type } from '@fastify/type-provider-typebox'

export type Credentials = Static<typeof Credentials>
export const Credentials = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 }),
})

export type Register = Static<typeof Register>
export const Register = Credentials

export type Login = Static<typeof Login>
export const Login = Type.Composite([
    Credentials,
    Type.Object({
        totpToken: Type.Optional(
            Type.Union([
                Type.String({ minLength: 6, maxLength: 6 }),
                Type.Null(),
            ]),
        ),
    }),
])

export type JwtPayload = {
    id: number
    email: string
}
