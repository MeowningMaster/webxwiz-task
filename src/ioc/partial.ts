import { Services } from '#root/services/index.js'
import { Container, Provider } from './index.js'
import { Resolvers, resolvers as resolversMap } from '#root/components/index.js'
import { services as servicesMap } from '#root/services/index.js'

/** Allows to resolve only specific providers */
export function partial(
    ioc: Container,
    options: {
        resolvers?: Resolvers[]
        services?: Services[]
    } = {},
) {
    const resolvers = (options.resolvers ?? []) as string[]
    const services = (options.services ?? []) as string[]

    function disable(provider: Provider) {
        const state = ioc.getOrThrow(provider)
        state.disabled = true
    }

    for (const [name, { Resolver }] of Object.entries(resolversMap)) {
        if (!resolvers.includes(name)) {
            disable(Resolver)
        }
    }

    for (const [name, provider] of Object.entries(servicesMap)) {
        if (!services.includes(name)) {
            disable(provider)
        }
    }
}
