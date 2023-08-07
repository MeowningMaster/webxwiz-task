import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import { Model, createConnection } from 'mongoose'
import * as schemas from './shemas/index.js'
import { Static } from '@fastify/type-provider-typebox'

type Schemas = typeof schemas
type Models = { [Key in keyof Schemas]: Model<Static<Schemas[Key]['Data']>> }

export const Mongo = ioc.add([Config], (config) => {
    const connection = createConnection(config.mongo.uri)

    const models = {} as Record<string, Model<any>>
    for (const [name, { schema }] of Object.entries(schemas)) {
        models[name] = connection.model(name, schema)
    }

    return {
        connection,
        ...(models as Models),
    }
})
