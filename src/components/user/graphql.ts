import { ioc } from '#root/ioc/index.js'
import { extendType, nonNull, objectType, stringArg } from 'nexus'
import { Logic } from './logic.js'

export const Graphql = ioc.add([Logic], (logic) => {
    return {
        User: objectType({
            name: 'User',
            definition(t) {
                t.string('id')
                t.string('email')
            },
        }),

        RegisterReply: objectType({
            name: 'RegisterReply',
            definition(t) {
                t.nonNull.string('id')
            },
        }),

        LoginReply: objectType({
            name: 'LoginReply',
            definition(t) {
                t.nonNull.string('token')
            },
        }),

        UserMutation: extendType({
            type: 'Mutation',
            definition: (t) => {
                t.nonNull.field('register', {
                    type: 'RegisterReply',
                    args: {
                        email: nonNull(stringArg()),
                        password: nonNull(stringArg()),
                    },
                    async resolve(_root, args) {
                        console.log('register', args)
                        const id = await logic.register(args)
                        return { id }
                    },
                })

                t.nonNull.field('login', {
                    type: 'LoginReply',
                    args: {
                        email: nonNull(stringArg()),
                        password: nonNull(stringArg()),
                    },
                    async resolve(_root, args) {
                        console.log('login', args)
                        const token = await logic.login(args)
                        return { token }
                    },
                })
            },
        }),
    }
})
