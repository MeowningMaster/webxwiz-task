import { Plugin } from '../../plugin-adapter.js'
import { Tags } from './tags.js'

interface TagsPluginOptions {
    tags: Array<keyof Tags>
}

export const tagsAdder = Plugin<TagsPluginOptions>()((
    server,
    { tags },
    done,
) => {
    server.addHook('onRoute', (route) => {
        route.schema ??= {}
        route.schema.tags ??= []
        ;(route.schema.tags as string[]).push(...tags)
    })
    done()
})
