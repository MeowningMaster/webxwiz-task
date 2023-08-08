import { Static, Type } from '@fastify/type-provider-typebox'
import { Schema } from 'mongoose'

type User = Static<typeof User>
export const User = Type.Object({
    email: Type.String({ format: 'email' }),
    passwordHash: Type.String({ minLength: 60, maxLength: 60 }),
    totpSecret: Type.Optional(Type.String({ minLength: 60, maxLength: 60 })),
})

export const schema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    totpSecret: { type: String },
})
