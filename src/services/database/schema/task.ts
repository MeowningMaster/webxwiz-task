import {
    mysqlTable,
    serial,
    varchar,
    int,
    text,
    mysqlEnum,
    index,
} from 'drizzle-orm/mysql-core'
import { user } from './user.js'
import { utc } from '../custom-columns/date-time.js'

export const task = mysqlTable(
    'task',
    {
        id: serial('id').primaryKey(),
        userId: int('user_id')
            .references(() => user.id, { onDelete: 'cascade' })
            .notNull(),
        title: varchar('name', { length: 256 }).notNull(),
        description: text('description').notNull(),
        status: mysqlEnum('status', ['pending', 'in-progress', 'completed'])
            .notNull()
            .default('pending'),
        notifyDate: utc('notify_date'),
        dueDate: utc('due_date'),
    },
    (task) => ({
        userIdIndex: index('user_id_idx').on(task.userId),
        titleIndex: index('title_idx').on(task.title),
        status: index('status_idx').on(task.status),
        notifyDate: index('notify_date_idx').on(task.notifyDate),
        dueDate: index('due_date_idx').on(task.dueDate),
    }),
)
