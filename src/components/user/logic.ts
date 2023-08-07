import { ioc } from '#root/ioc/index.js'
import { JwtPayload, Credentials } from './schema.js'
import { ServerError } from '#root/error/server-error.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Config } from '#root/config/index.js'
import { Mongo } from '#root/services/mongo/index.js'

export const Logic = ioc.add([Config, Mongo], (config, mongo) => {
    return {
        async register({ email, password }: Credentials) {
            const existsResult = await mongo.user.exists({ email })
            if (existsResult !== null) {
                throw new ServerError('The email is already taken', {
                    code: 400,
                    context: { email },
                })
            }

            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(password, salt)

            const { _id } = await mongo.user.create({ email, passwordHash })
            return _id.toString()
        },

        async login({ email, password }: Credentials) {
            const user = await mongo.user.findOne({ email }).exec()
            if (user === null) {
                throw new ServerError('The user is not registed', {
                    code: 400,
                    context: { email },
                })
            }

            const permitted = await bcrypt.compare(password, user.passwordHash)
            if (!permitted) {
                throw new ServerError('The password is incorrect', {
                    code: 400,
                    context: { email },
                })
            }

            const tokenPayload: JwtPayload = {
                id: user.id,
                email,
            }

            return jwt.sign(tokenPayload, config.jwt.secret, {
                expiresIn: config.jwt.expiresIn,
            })
        },

        async delete(email: string) {
            await mongo.user.findOneAndDelete({ email }).exec()
        },
    }
})
