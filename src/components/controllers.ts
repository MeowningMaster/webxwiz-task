import { Provider, ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

import * as task from './task/index.js'
import * as user from './user/index.js'
import * as email from './email/index.js'

export type Controllers = keyof typeof controllers

export const controllers = {
    task: ['/task', task],
    user: ['/user', user],
    email: ['/email', email],
} as const satisfies Record<
    string,
    readonly [
        prefix: string,
        component: { Controller: Provider<FastifyPluginAsyncTypebox> },
    ]
>

const entries = Object.entries(controllers)

export const Controllers = ioc.add(
    entries.map(([, [, component]]) => component.Controller),
    (...plugins): FastifyPluginAsyncTypebox =>
        async (server) => {
            await Promise.all(
                entries
                    .map(async ([, [prefix]], index) => {
                        const plugin = plugins[index]
                        if (plugin === ioc.disabled) {
                            return null
                        }
                        return server.register(plugin, { prefix })
                    })
                    .filter((result) => result !== null),
            )
        },
)
