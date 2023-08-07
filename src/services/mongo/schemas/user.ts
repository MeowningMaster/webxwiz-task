import { Static, Type } from '@fastify/type-provider-typebox'
import { Schema } from 'mongoose'

type Data = Static<typeof Data>
export const Data = Type.Object({
    email: Type.String({ format: 'email' }),
    passwordHash: Type.String({ minLength: 60, maxLength: 60 }),
})

export const schema = new Schema<Data>({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
})

export type User = Data
export const User = Data
