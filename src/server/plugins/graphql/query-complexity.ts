import { ApolloServerPlugin } from '@apollo/server'
import { Context } from './context.cts'
import {
    getComplexity,
    simpleEstimator,
    fieldExtensionsEstimator,
    directiveEstimator,
} from 'graphql-query-complexity'
import { separateOperations } from 'graphql'
import { ioc } from '#root/ioc/index.ts'
import { Resolvers } from '#root/components/index.ts'
import { Logger } from '#root/logger/index.ts'
import { ServerError } from '#root/error/server-error.ts'

const maxComplexity = 1000

// source https://github.com/MichalLytek/type-graphql/blob/4501867fffe3e6f5b3e71af0b71651efcd48d9c3/examples/query-complexity/index.ts
export const QueryComplexityPlugin = ioc.add(
    [Resolvers],
    (schema): ApolloServerPlugin<Context> => {
        return {
            async requestDidStart() {
                return {
                    async didResolveOperation({ request, document }) {
                        const complexity = getComplexity({
                            schema,
                            query: request.operationName
                                ? separateOperations(document)[
                                      request.operationName
                                  ]
                                : document,
                            variables: request.variables,
                            estimators: [
                                fieldExtensionsEstimator(),
                                directiveEstimator(),
                                simpleEstimator(),
                            ],
                        })
                        if (complexity > maxComplexity) {
                            throw new ServerError(
                                'Sorry, too complicated query!',
                                {
                                    code: 400,
                                    context: {
                                        complexity,
                                        maxComplexity,
                                    },
                                },
                            )
                        }
                    },
                }
            },
        }
    },
)
