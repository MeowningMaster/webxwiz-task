import {
    mysqlTable,
    varchar,
    char,
    int,
    uniqueIndex,
} from 'drizzle-orm/mysql-core'

export const user = mysqlTable(
    'user',
    {
        id: int('id').autoincrement().primaryKey(),
        login: varchar('login', { length: 256 }).notNull(),
        passwordHash: char('password_hash', { length: 60 }).notNull(),
    },
    (user) => ({
        loginIndex: uniqueIndex('login_idx').on(user.login),
    }),
)
