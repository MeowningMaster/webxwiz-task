import { ServerError } from '#root/error/server-error.js'
import { Writable } from '#root/utilities/types/writable.js'

export type Provider<R = unknown, P extends any[] = any[]> = {
    (...parameters: P): R
}

type Parameters = readonly Provider[]

type ProviderState<Instance = unknown> = {
    parameters?: Parameters
    promise?: Promise<Instance>
    /** For debugging and tests */
    name?: string
    disabled: boolean
}

export type Resolve<TProvider extends Provider> = TProvider extends Provider
    ? Awaited<ReturnType<TProvider>>
    : never
export type ResolveParameters<TParameters extends Parameters> = Writable<{
    [Key in keyof TParameters]: Resolve<TParameters[Key]>
}>

const disabled = new Proxy(
    {},
    {
        get(target, reciever) {
            if (reciever !== 'then') {
                throw new ServerError('Provider is disabled')
            }
        },
    },
)

/** Inverse of control container that resolves providers and theirs dependencies */
export type Container = ReturnType<typeof Container>
export function Container(options: { debug: boolean } = { debug: false }) {
    const states = new Map<Provider, ProviderState>()

    return {
        add<
            const TParameters extends Parameters,
            TProvider extends Provider = Provider<
                unknown,
                ResolveParameters<TParameters>
            >,
        >(
            parameters: TParameters,
            provider: TProvider,
            name?: string,
        ): TProvider {
            states.set(provider, { parameters, name, disabled: false })
            return provider
        },

        get<TProvider extends Provider>(provider: TProvider) {
            return states.get(provider) as
                | ProviderState<Resolve<TProvider>>
                | undefined
        },

        getOrThrow<TProvider extends Provider>(provider: TProvider) {
            const state = this.get(provider)
            if (state === undefined) {
                throw new Error(`Provider isn't registered`)
            }
            return state
        },

        async resolve<TProvider extends Provider>(
            provider: TProvider,
        ): Promise<Resolve<TProvider>> {
            const state = this.getOrThrow(provider)

            if (state.disabled) {
                return disabled as Promise<Resolve<TProvider>>
            }

            if (state.promise !== undefined) {
                return state.promise
            }

            let resolveInstance!: (
                instance: Resolve<TProvider> | PromiseLike<Resolve<TProvider>>,
            ) => void

            state.promise = new Promise((resolve) => {
                resolveInstance = resolve
            })

            const parametersPromises = new Array<Promise<unknown>>()
            if (state.parameters) {
                for (const parameterProvider of state.parameters) {
                    parametersPromises.push(this.resolve(parameterProvider))
                }
            }
            const parametersInstances = await Promise.all(parametersPromises)

            const instance = (await provider(
                ...parametersInstances,
            )) as Promise<Resolve<TProvider>>
            resolveInstance(instance)
            if (options.debug) {
                console.log(`Resolved ${state.name}`)
            }
            return state.promise
        },

        delete(provider: Provider) {
            states.delete(provider)
        },

        clear() {
            states.clear()
        },

        disabled,
    }
}

export const ioc = Container()
