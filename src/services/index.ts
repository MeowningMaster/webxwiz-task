import { Provider } from '#root/ioc/index.js'
import { Mongo } from './mongo/index.js'

export type Services = keyof typeof services

export const services = {
    mongo: Mongo,
} as const satisfies Record<string, Provider>
