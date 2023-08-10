import { ioc } from '#root/ioc/index.ts'
import { partial } from '#root/ioc/partial.ts'
import { Server } from '#root/server/index.ts'
import { afterAll, test } from 'vitest'
import { Credentials } from './schema.ts'
import { faker } from '@faker-js/faker'
import {
    GraphQlArgs,
    GraphQlResult,
} from '#root/utilities/types/graphql-resolver.ts'
import * as user from '#root/components/user/index.ts'
import { TOTP, URI } from 'otpauth'

partial(ioc, {
    resolvers: ['user'],
    services: ['mongo'],
})
const { injectGraphql } = await ioc.resolve(Server)
const userLogic = await ioc.resolve(user.Logic)

const credentials: Credentials = {
    email: faker.internet.userName(),
    password: faker.internet.password(),
}

test('Register', async () => {
    await injectGraphql.request(
        `#graphql
            mutation Mutation($email: String!, $password: String!) {
                register(email: $email, password: $password) {
                    ok
                }
            }
        `,
        credentials,
    )
})

afterAll(async () => {
    await userLogic.delete(credentials.email)
})

let bearer: string
test('Login', async () => {
    const args: GraphQlArgs<'Mutation', 'login'> = credentials
    const reply: GraphQlResult<'Mutation', 'login'> =
        await injectGraphql.request(
            `#graphql
                mutation Mutation($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        token
                    }
                }
            `,
            args,
        )
    const { token } = reply.login
    bearer = `Bearer ${token}`
})

let totp: TOTP
test('Change totp', async () => {
    const reply: GraphQlResult<'Mutation', 'changeTotp'> =
        await injectGraphql.request(
            `#graphql
                mutation Mutation {
                    changeTotp {
                        qrCode
                        uri
                    }
                }
            `,
            undefined,
            { authorization: bearer },
        )

    const { uri } = reply.changeTotp
    totp = URI.parse(uri) as TOTP
})

test('Change password', async () => {
    const password = faker.internet.password()
    const args: GraphQlArgs<'Mutation', 'changePassword'> = { password }
    await injectGraphql.request(
        `#graphql
            mutation Mutation($password: String!) {
                changePassword(password: $password) {
                    ok
                }
            }
        `,
        args,
        { authorization: bearer },
    )
    credentials.password = password
})

test('Login again', async () => {
    const args: GraphQlArgs<'Mutation', 'login'> = {
        ...credentials,
        totpToken: totp.generate(),
    }
    await injectGraphql.request(
        `#graphql
            mutation Mutation($email: String!, $password: String!, $totpToken: String) {
                login(email: $email, password: $password, totpToken: $totpToken) {
                    token
                }
            }
        `,
        args,
    )
})
