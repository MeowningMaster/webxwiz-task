import { ioc } from '#root/ioc/index.js'
import { makeSchema } from 'nexus'
import * as user from './user/index.js'
import { resolve } from 'node:path'

export type Components = keyof typeof components
export const components = { user } satisfies Record<string, { Controller: any }>

const controllers = Object.entries(components)

export const Controllers = ioc.add(
    controllers.map(([, { Controller }]) => Controller),
    (...types) => {
        return makeSchema({
            types: types.filter((type) => type !== ioc.disabled),
            outputs: {
                typegen: resolve('src', 'nexus-typegen.ts'),
            },
            // contextType: {
            //     module: resolve('src', 'context.ts'),
            //     export: 'Context',
            // },
        })
    },
)
