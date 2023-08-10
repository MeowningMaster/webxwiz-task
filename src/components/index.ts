import { ioc } from '#root/ioc/index.js'
import { makeSchema } from 'nexus'
import nexus from 'nexus'
import * as user from './user/index.js'
import { resolve } from 'node:path'

export type Resolvers = keyof typeof resolvers
export const resolvers = { user } satisfies Record<string, { Resolver: any }>

const controllers = Object.entries(resolvers)

export const Resolvers = ioc.add(
    controllers.map(([, { Resolver }]) => Resolver),
    (...types) => {
        return makeSchema({
            types: types.filter((type) => type !== ioc.disabled),
            outputs: {
                typegen: resolve('src/generated/nexus-typegen.cts'),
                schema: resolve('src/generated/schema.graphql'),
            },
            plugins: [
                nexus.fieldAuthorizePlugin(),
                nexus.queryComplexityPlugin(),
            ],
            contextType: {
                module: resolve('src/server/plugins/graphql/context.cts'),
                export: 'Context',
            },
        })
    },
)
