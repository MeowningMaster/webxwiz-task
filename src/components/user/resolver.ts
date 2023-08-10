import { ioc } from '#root/ioc/index.js'
import { extendType, nonNull, objectType, stringArg } from 'nexus'
import { Logic } from './logic.js'

export const Resolver = ioc.add([Logic], (logic) => {
    const User = objectType({
        name: 'User',
        definition(t) {
            t.string('id')
            t.string('email')
        },
    })

    const OkReply = objectType({
        name: 'OkReply',
        definition(t) {
            t.nonNull.boolean('ok')
        },
    })

    const LoginReply = objectType({
        name: 'LoginReply',
        definition(t) {
            t.nonNull.string('token')
        },
    })

    const ChangeTotpReply = objectType({
        name: 'ChangeTotpReply',
        definition(t) {
            t.nonNull.string('uri')
            t.nonNull.string('qrCode', {
                description: 'data url representation of the qr code image',
            })
        },
    })

    return {
        User,
        OkReply,
        LoginReply,
        UserMutation: extendType({
            type: 'Mutation',
            definition: (t) => {
                t.nonNull.field('register', {
                    type: OkReply,
                    args: {
                        email: nonNull(stringArg()),
                        password: nonNull(stringArg()),
                    },
                    async resolve(root, args) {
                        await logic.register(args)
                        return { ok: true }
                    },
                })

                t.nonNull.field('login', {
                    type: LoginReply,
                    description: 'Totp token is required if totp is enabled',
                    args: {
                        email: nonNull(stringArg()),
                        password: nonNull(stringArg()),
                        totpToken: stringArg(),
                    },
                    async resolve(root, args) {
                        const token = await logic.login(args)
                        return { token }
                    },
                })

                t.nonNull.field('changeTotp', {
                    type: ChangeTotpReply,
                    async authorize(root, args, ctx) {
                        return ctx.email !== undefined
                    },
                    async resolve(root, args, ctx) {
                        return await logic.changeTotp(ctx.email as string)
                    },
                })

                t.nonNull.field('changePassword', {
                    type: OkReply,
                    args: {
                        password: nonNull(stringArg()),
                    },
                    async authorize(root, args, ctx) {
                        return ctx.email !== undefined
                    },
                    async resolve(root, args, ctx) {
                        await logic.changePassword(
                            ctx.email as string,
                            args.password,
                        )
                        return { ok: true }
                    },
                })
            },
        }),
    }
})
