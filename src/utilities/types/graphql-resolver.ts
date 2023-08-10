import type {
    ResultValue,
    ArgsValue,
} from 'nexus/dist-esm/typegenTypeHelpers.d.ts'
import type { NexusGenFieldTypes } from '#root/generated/nexus-typegen.cjs'

export type GraphQlResult<
    TypeName extends keyof NexusGenFieldTypes,
    FieldName extends keyof NexusGenFieldTypes[TypeName],
> = FieldName extends string
    ? { [Key in FieldName]: ResultValue<TypeName, FieldName> }
    : any

export type GraphQlArgs<
    TypeName extends keyof NexusGenFieldTypes,
    FieldName extends keyof NexusGenFieldTypes[TypeName],
> = FieldName extends string ? ArgsValue<TypeName, FieldName> : any
