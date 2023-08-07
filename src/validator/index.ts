import ajv from 'ajv'
import ajvFormats from 'ajv-formats'
import type { TAnySchema, Static } from '@sinclair/typebox'

export const validator = new ajv.default({
    strict: true,
    keywords: ['style', 'explode'],
    useDefaults: true,
    coerceTypes: true,
})

ajvFormats.default(validator)

export function validate<Schema extends TAnySchema>(
    schema: Schema,
    data: unknown,
): data is Static<Schema> {
    return validator.validate<Static<Schema>>(schema as ajv.Schema, data)
}
