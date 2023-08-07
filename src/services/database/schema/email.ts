import {
    mysqlTable,
    varchar,
    int,
    uniqueIndex,
    boolean,
} from 'drizzle-orm/mysql-core'
import { user } from './user.js'

export const email = mysqlTable(
    'email',
    {
        userId: int('user_id')
            .primaryKey()
            .references(() => user.id, { onDelete: 'cascade' }),
        email: varchar('email', { length: 256 }).notNull(),
        confirmed: boolean('confirmed').notNull(),
    },
    (email) => ({
        emailIndex: uniqueIndex('email_idx').on(email.email),
    }),
)
