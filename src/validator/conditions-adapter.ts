import {
    Static,
    TObject,
    TPartial,
    TProperties,
    TSchema,
    Type,
} from '@sinclair/typebox'

export type Conditions = Static<
    TObject<AdaptProperties<Record<string, TSchema>>>
>

export type EqualityOperators = (typeof equalityOperators)[number]
export const equalityOperators = ['eq', 'ne'] as const

export type CompareOperations = (typeof compareOperations)[number]
export const compareOperations = ['lt', 'gt', 'lte', 'gte'] as const

export type LikeOperatiors = (typeof likeOperatiors)[number]
export const likeOperatiors = ['like', 'ilike'] as const

export type AllOperations = (typeof allOperations)[number]
export const allOperations = [
    ...equalityOperators,
    ...compareOperations,
    ...likeOperatiors,
] as const

type AdaptProperty<T extends TSchema> = TPartial<
    TObject<Record<AllOperations, T>>
>
type AdaptProperties<T extends TProperties> = {
    [Key in keyof T]: AdaptProperty<T[Key]>
}

export function ConditionsAdapter<T extends TProperties>(
    schema: TObject<T>,
): TPartial<TObject<AdaptProperties<T>>> {
    const properties: TProperties = {}
    for (const [key, propertySchema] of Object.entries(schema.properties)) {
        properties[key] = Type.Partial(
            Type.Record(
                Type.Union(
                    allOperations.map((operation) => Type.Literal(operation)),
                ),
                propertySchema,
            ),
        )
    }
    return Type.Partial({ ...schema, properties }) as any
}
