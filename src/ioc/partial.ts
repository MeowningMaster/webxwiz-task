import { Services } from '#root/services/index.js'
import { Container, Provider } from './index.js'
import {
    Components,
    components as componentsMap,
} from '#root/components/index.js'
import { services as servicesMap } from '#root/services/index.js'

/** Allows to resolve only specific providers */
export function partial(
    ioc: Container,
    options: {
        components?: Components[]
        services?: Services[]
    } = {},
) {
    const controllers = (options.components ?? []) as string[]
    const services = (options.services ?? []) as string[]

    function disable(provider: Provider) {
        const state = ioc.getOrThrow(provider)
        state.disabled = true
    }

    for (const [name, { Controller }] of Object.entries(componentsMap)) {
        if (!controllers.includes(name)) {
            disable(Controller)
        }
    }

    for (const [name, provider] of Object.entries(servicesMap)) {
        if (!services.includes(name)) {
            disable(provider)
        }
    }
}
