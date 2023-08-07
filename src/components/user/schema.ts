import { RouteSchema, StaticRoute } from '#root/server/route-schema.js'
import { Static, Type } from '@sinclair/typebox'

export type Credentials = Static<typeof Credentials>
export const Credentials = Type.Object({
    login: Type.String({ minLength: 4 }),
    password: Type.String({ minLength: 8 }),
})

export type Register = StaticRoute<typeof Register>
export const Register = {
    description: 'Register a new user',
    body: Credentials,
    response: {
        200: Type.Number({ minimum: 0, description: 'id' }),
    },
} satisfies RouteSchema

export type Login = StaticRoute<typeof Login>
export const Login = {
    description:
        'Get a JWT token for temporary access. The token should be used as a bearer auth',
    body: Credentials,
    response: {
        200: Type.String({ description: 'Auth token' }),
    },
} satisfies RouteSchema

export type JwtPayload = {
    id: number
    login: string
}
