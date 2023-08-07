import { Container } from '../index.js'
import { expect, test } from 'vitest'
import { delay } from '../../utilities/delay.js'

const ioc = Container({ debug: true })

const message = 'hello world'

const A = ioc.add(
    [],
    async () => {
        await delay(10)
        return {
            getMessage() {
                return message
            },
        }
    },
    'A',
)

const B = ioc.add(
    [A],
    async (a) => {
        await delay(10)
        return {
            getMessage() {
                return a.getMessage()
            },
        }
    },
    'B',
)

test('async', async () => {
    const instance = await ioc.resolve(B)
    expect(instance.getMessage()).toBe(message)
})
