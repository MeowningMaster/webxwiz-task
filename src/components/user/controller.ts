import { ioc } from '#root/ioc/index.js'
import { extendType, nonNull, objectType, stringArg } from 'nexus'
import { Logic } from './logic.js'

export const Controller = ioc.add([Logic], (logic) => {
    const User = objectType({
        name: 'User',
        definition(t) {
            t.string('id')
            t.string('email')
        },
    })

    const RegisterReply = objectType({
        name: 'RegisterReply',
        definition(t) {
            t.nonNull.string('id')
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
            t.nonNull.string('qrCode')
        },
    })

    return {
        User,
        RegisterReply,
        LoginReply,
        UserMutation: extendType({
            type: 'Mutation',
            definition: (t) => {
                t.nonNull.field('register', {
                    type: RegisterReply,
                    args: {
                        email: nonNull(stringArg()),
                        password: nonNull(stringArg()),
                    },
                    async resolve(_root, args) {
                        const id = await logic.register(args)
                        return { id }
                    },
                })

                t.nonNull.field('login', {
                    type: LoginReply,
                    args: {
                        email: nonNull(stringArg()),
                        password: nonNull(stringArg()),
                        totpToken: stringArg(),
                    },
                    async resolve(_root, args) {
                        const token = await logic.login(args)
                        return { token }
                    },
                })

                t.nonNull.field('changeTotp', {
                    type: ChangeTotpReply,
                    async resolve() {
                        return await logic.changeTotp(
                            'meowningmaster@gmail.com',
                        )
                    },
                })
            },
        }),
    }
})
