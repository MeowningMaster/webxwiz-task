import { Controllers } from '#root/components/controllers.js'
import { Services } from '#root/services/index.js'
import { Container, Provider } from './index.js'
import { controllers as controllersMap } from '#root/components/controllers.js'
import { services as servicesMap } from '#root/services/index.js'

/** Allows to resolve only specific providers */
export function partial(
    ioc: Container,
    options: {
        controllers?: Controllers[]
        services?: Services[]
    } = {},
) {
    const controllers = (options.controllers ?? []) as string[]
    const services = (options.services ?? []) as string[]

    function disable(provider: Provider) {
        const state = ioc.getOrThrow(provider)
        state.disabled = true
    }

    for (const [name, [, component]] of Object.entries(controllersMap)) {
        if (!controllers.includes(name)) {
            disable(component.Controller)
        }
    }

    for (const [name, provider] of Object.entries(servicesMap)) {
        if (!services.includes(name)) {
            disable(provider)
        }
    }
}
