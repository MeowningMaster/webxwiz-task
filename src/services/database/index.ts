import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import * as schema from './schema/index.js'
import { delay } from '#root/utilities/delay.js'
import { Logger } from '#root/logger/index.js'

export const Database = ioc.add([Config, Logger], async (config, log) => {
    async function waitForConnection(maxRetries = 20, retryIntervalMs = 3000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const connenction = await mysql.createConnection(
                    config.database,
                )
                await connenction.end()
                return
            } catch (error) {
                log.warn(
                    {
                        attempt,
                        maxRetries,
                        error,
                    },
                    'Database connection not established',
                )
                await delay(retryIntervalMs)
            }
        }
        throw new Error('Unable to establish database connection')
    }
    await waitForConnection()

    const pool = mysql.createPool(config.database)
    const db = drizzle(pool, { schema })
    await migrate(db, { migrationsFolder: './migrations' })
    return db
})
