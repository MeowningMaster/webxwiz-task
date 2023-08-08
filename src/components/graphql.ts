import { ioc } from '#root/ioc/index.js'
import { makeSchema } from 'nexus'
import * as user from './user/index.js'
import { resolve } from 'node:path'

const providers = [user].map(({ Graphql }) => Graphql)

export const Graphql = ioc.add(providers, (...types) => {
    return makeSchema({
        types,
        outputs: {
            typegen: resolve('src', 'nexus-typegen.ts'),
        },
        // contextType: {
        //     module: resolve('src', 'context.ts'),
        //     export: 'Context',
        // },
    })
})
