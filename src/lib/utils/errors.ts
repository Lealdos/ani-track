/**
 * Custom error types for better error handling
 */

export interface AppErrorOptions {
    statusCode?: number
    code?: string
    isOperational?: boolean
}

/**
 * Create an application error
 */
export function createAppError(
    message: string,
    options: AppErrorOptions = {}
): Error & AppErrorOptions {
    const error = new Error(message) as Error & AppErrorOptions
    error.statusCode = options.statusCode || 500
    error.code = options.code || 'INTERNAL_ERROR'
    error.isOperational = options.isOperational ?? true
    return error
}

/**
 * Create a validation error
 */
export function createValidationError(message: string, details?: unknown) {
    const error = createAppError(message, {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
    })
    ;(error as Error & { details?: unknown }).details = details
    return error
}

/**
 * Create an authentication error
 */
export function createAuthenticationError(
    message: string = 'Authentication required'
) {
    return createAppError(message, {
        statusCode: 401,
        code: 'UNAUTHORIZED',
    })
}

/**
 * Create an authorization error
 */
export function createAuthorizationError(message: string = 'Access denied') {
    return createAppError(message, {
        statusCode: 403,
        code: 'FORBIDDEN',
    })
}

/**
 * Create a not found error
 */
export function createNotFoundError(resource: string = 'Resource') {
    return createAppError(`${resource} not found`, {
        statusCode: 404,
        code: 'NOT_FOUND',
    })
}

/**
 * Create a conflict error
 */
export function createConflictError(message: string) {
    return createAppError(message, {
        statusCode: 409,
        code: 'CONFLICT',
    })
}

/**
 * Create a rate limit error
 */
export function createRateLimitError(message: string = 'Too many requests') {
    return createAppError(message, {
        statusCode: 429,
        code: 'RATE_LIMIT_EXCEEDED',
    })
}

/**
 * Error logger utility
 */
export function logError(
    error: Error,
    context?: Record<string, unknown>
): void {
    const appError = error as Error & AppErrorOptions

    const errorLog = {
        timestamp: new Date().toISOString(),
        name: error.name,
        message: error.message,
        stack: error.stack,
        statusCode: appError.statusCode,
        code: appError.code,
        isOperational: appError.isOperational,
        ...context,
    }

    // In production, this would be sent to a logging service
    console.error('Error Log:', JSON.stringify(errorLog, null, 2))
}

/**
 * Check if error is operational (expected) or programming error
 */
export function isOperationalError(error: Error): boolean {
    const appError = error as Error & { isOperational?: boolean }
    return appError.isOperational ?? false
}
