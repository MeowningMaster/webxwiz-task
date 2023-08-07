import { ioc } from '#root/ioc/index.js'
import { Server } from '#root/server/index.js'
import { test } from 'vitest'
import { Credentials, Login, Register } from './schema.js'
import { faker } from '@faker-js/faker'
import { partial } from '#root/ioc/partial.js'

partial(ioc, {
    controllers: ['user'],
    services: ['database'],
})
const { inject } = await ioc.resolve(Server)

const credentials: Credentials = {
    login: faker.internet.userName(),
    password: faker.internet.password(),
}

test('Register', async () => {
    await inject<Register>({
        method: 'POST',
        path: '/v1/user/register',
        body: credentials,
    })
})

let bearer: string

test('Login', async () => {
    const { body: token } = await inject<Login>({
        method: 'POST',
        path: '/v1/user/login',
        body: credentials,
    })
    bearer = `Bearer ${token}`
})

test('Delete', async () => {
    await inject({
        method: 'DELETE',
        path: '/v1/user',
        headers: { authorization: bearer },
    })
})
