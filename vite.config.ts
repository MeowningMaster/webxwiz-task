import * as path from 'node:path'
import { defineConfig } from 'vitest/config'

export function alias(relativePath: string) {
    return path.resolve(__dirname, relativePath)
}

export default defineConfig({
    resolve: {
        alias: [{ find: '#root', replacement: alias('./src') }],
    },
})
