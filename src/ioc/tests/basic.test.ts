import { Container } from '../index.js'
import { expect, test } from 'vitest'

const ioc = Container({ debug: true })

const message: string = 'hello world'

const A = ioc.add(
    [],
    () => ({
        getMessage() {
            return message
        },
    }),
    'A',
)

const B = ioc.add(
    [A],
    (a) => ({
        getMessage() {
            return a.getMessage()
        },
    }),
    'B',
)

test('basic', async () => {
    const instance = await ioc.resolve(B)
    expect(instance.getMessage()).toBe(message)
})
