import {
    FastifyBaseLogger,
    FastifyPluginAsync,
    FastifyPluginCallback,
    FastifyPluginOptions,
    FastifyTypeProvider,
    FastifyTypeProviderDefault,
    RawServerBase,
    RawServerDefault,
} from 'fastify'
import { PluginMetadata, fastifyPlugin } from 'fastify-plugin'

/** Types fix for fastify-plugin */
export function Plugin<
    Options extends FastifyPluginOptions = Record<never, never>,
>() {
    return <
        RawServer extends RawServerBase = RawServerDefault,
        TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
        Logger extends FastifyBaseLogger = FastifyBaseLogger,
        Fn extends
            | FastifyPluginCallback<Options, RawServer, TypeProvider, Logger>
            | FastifyPluginAsync<
                  Options,
                  RawServer,
                  TypeProvider,
                  Logger
              > = FastifyPluginCallback<
            Options,
            RawServer,
            TypeProvider,
            Logger
        >,
    >(
        fn: Fn extends unknown
            ? Fn extends (...args: any) => Promise<any>
                ? FastifyPluginAsync<Options, RawServer, TypeProvider, Logger>
                : FastifyPluginCallback<
                      Options,
                      RawServer,
                      TypeProvider,
                      Logger
                  >
            : Fn,
        options?: PluginMetadata | string,
    ): Fn => fastifyPlugin(fn, options)
}
