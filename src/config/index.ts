import yaml from 'yaml'
import { ioc } from '#root/ioc/index.js'
import fs from 'node:fs'
import { validate } from '#root/validator/index.js'
import * as schema from './schema.js'

async function parseConfig() {
    const text = await fs.promises.readFile('config.yaml', 'utf-8')
    const object = yaml.parse(text)
    if (!validate(schema.Config, object)) {
        throw new Error('Config is invalid')
    }
    return object
}

async function parsePackageJson() {
    const text = await fs.promises.readFile('package.json', 'utf-8')
    const object = JSON.parse(text)
    if (!validate(schema.PackageJson, object)) {
        throw new Error('Package is invalid')
    }
    return object
}

export const Config = ioc.add([], async () => {
    const [config, packageJson] = await Promise.all([
        parseConfig(),
        parsePackageJson(),
    ])
    return {
        ...config,
        packageJson,
    }
})
