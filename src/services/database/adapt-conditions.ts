import { ServerError } from '#root/error/server-error.js'
import {
    CompareOperations,
    Conditions,
    LikeOperatiors,
    compareOperations,
    likeOperatiors,
} from '#root/validator/conditions-adapter.js'
import {
    SQL,
    eq,
    isNotNull,
    isNull,
    lt,
    ne,
    lte,
    gt,
    gte,
    like,
    ilike,
    AnyColumn,
} from 'drizzle-orm'
import { MySqlTableWithColumns } from 'drizzle-orm/mysql-core'

const comparators = {
    lt,
    lte,
    gt,
    gte,
} as const satisfies Record<CompareOperations, (left: SQL, right: SQL) => SQL>

const likes = {
    like,
    ilike,
} as const satisfies Record<
    LikeOperatiors,
    (left: AnyColumn, right: SQL) => SQL
>

export function adaptConditions(
    table: MySqlTableWithColumns<any>,
    conditions: Conditions,
): SQL<unknown>[] {
    const result: SQL<unknown>[] = []
    for (const [field, params] of Object.entries(conditions)) {
        const colunm = table[field]
        if (params.eq !== undefined) {
            result.push(
                params.eq === null ? isNull(colunm) : eq(colunm, params.eq),
            )
        }
        if (params.ne !== undefined) {
            result.push(
                params.ne === null ? isNotNull(colunm) : ne(colunm, params.ne),
            )
        }
        for (const operation of compareOperations) {
            const value = params[operation]
            if (value === undefined) {
                continue
            }
            if (value === null) {
                throw new ServerError(`${operation} can't be null`, {
                    context: { field },
                })
            }
            result.push(comparators[operation](colunm, value))
        }
        for (const operation of likeOperatiors) {
            const value = params[operation]
            if (value === undefined) {
                continue
            }
            if (typeof value !== 'string') {
                throw new ServerError(`${operation} should be string`, {
                    context: { field, value },
                })
            }
            result.push(likes[operation](colunm, value))
        }
    }
    return result
}
