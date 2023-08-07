export class ServerError extends Error {
    code: number
    /** Context is shown to user */
    context?: unknown
    /** Only logged. Isn't shown to user */
    logs?: unknown

    constructor(
        message: string,
        options: {
            code?: number
            context?: unknown
            logs?: unknown
            cause?: unknown
            stack?: string
        } = {},
    ) {
        super(message)
        this.message = message
        this.code = options.code ?? 500
        this.context = options.context
        this.logs = options.logs
        this.cause = options.cause
        this.stack = options.stack
    }
}
