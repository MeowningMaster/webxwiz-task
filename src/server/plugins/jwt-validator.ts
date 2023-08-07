import { Config } from '#root/config/index.js'
import { ServerError } from '#root/error/server-error.js'
import { ioc } from '#root/ioc/index.js'
import { tokenSecuritySchema } from '#root/server/plugins/documentation/index.js'
import { Plugin } from '#root/server/plugin-adapter.js'
import { JwtPayload } from '../../components/user/schema.js'
import jwt from 'jsonwebtoken'

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JwtPayload
    }
}

export const tokenHeader = 'authorization' as const
const bearerPrefix = 'Bearer ' as const

type Security = { [securityLabel: string]: readonly string[] }

export const JwtValidator = ioc.add([Config], (config) =>
    Plugin()((server, {}, done) => {
        server.addHook('onRoute', (route) => {
            route.schema ??= {}
            route.schema.security ??= []
            ;(route.schema.security as Security[]).push({
                [tokenSecuritySchema]: [],
            })
        })

        server.decorateRequest('jwt', null)

        server.addHook('preHandler', (request, reply, done) => {
            const header = request.headers[tokenHeader]
            if (!header) {
                done(new ServerError('No Authorization header', { code: 401 }))
                return
            }

            if (!header.startsWith(bearerPrefix)) {
                done(
                    new ServerError('Authorization must be Bearer', {
                        code: 400,
                        context: { header },
                    }),
                )
            }

            const token = header.substring(bearerPrefix.length)

            try {
                const payload = jwt.verify(token, config.jwt.secret)
                request.jwt = payload as JwtPayload
                done()
            } catch (error) {
                if (error instanceof Error) {
                    done(
                        new ServerError(error.message, {
                            code: 400,
                            context: { header },
                        }),
                    )
                    return
                }

                done(
                    new ServerError('Unknown error during JWT validation', {
                        context: { header, error },
                    }),
                )
            }
        })

        done()
    }),
)
