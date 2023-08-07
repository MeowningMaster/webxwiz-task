import { Container } from '../index.js'
import { expect, test } from 'vitest'
import { delay } from '../../utilities/delay.js'

const ioc = Container({ debug: true })

const message: string = 'hello world'

const A = ioc.add(
    [],
    async () => {
        await delay(10)
        return {
            getMessage: () => message,
        }
    },
    'A',
)
const B = ioc.add(
    [A],
    async (a) => {
        await delay(20)
        return a
    },
    'B',
)
const C = ioc.add([A], async (a) => a, 'C')

test('simultaneous', async () => {
    const providers = [B, C, A]
    const [b, c, a] = await Promise.all(providers.map(ioc.resolve.bind(ioc)))
    expect(b.getMessage()).toBe(message)
    expect(c.getMessage()).toBe(message)
    expect(a.getMessage()).toBe(message)
})
