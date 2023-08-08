import { ioc } from '#root/ioc/index.js'
import { JwtPayload, Register, Login } from './schema.js'
import { ServerError } from '#root/error/server-error.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Config } from '#root/config/index.js'
import { Mongo } from '#root/services/mongo/index.js'
import { randomBytes } from 'crypto'
import { Secret, TOTP } from 'otpauth'
import QRCode from 'qrcode'

export const Logic = ioc.add([Config, Mongo], (config, mongo) => {
    return {
        async register({ email, password }: Register) {
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

        async login({ email, password, totpToken }: Login) {
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

            if (totpToken) {
                if (user.totpSecret === undefined) {
                    throw new ServerError('The user has no totp secret', {
                        code: 400,
                        context: { email },
                    })
                }

                const totp = Totp(user.totpSecret)
                const verified = totp.validate({ token: totpToken, window: 2 })
                if (verified === null) {
                    throw new ServerError('The totp token is incorrect', {
                        code: 400,
                        context: { email },
                    })
                }
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

        async changeTotp(email: string) {
            const secret = randomBytes(60).toString('utf8')
            let totp = Totp(secret)

            const updated = await mongo.user
                .updateOne(
                    { email },
                    { totpSecret: secret, qrCodeObtained: false },
                )
                .exec()
            if (updated.modifiedCount === 0) {
                throw new ServerError('The user is not registed', {
                    code: 400,
                    context: { email },
                })
            }

            const uri = totp.toString()
            const qrCode = await QRCode.toDataURL(totp.toString())
            return { uri, qrCode }
        },
    }
})

function Totp(secret: string) {
    return new TOTP({
        label: 'Tester',
        secret: Secret.fromUTF8(secret),
    })
}
