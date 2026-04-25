import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: {
        message: string
        code?: string
        details?: unknown
    }
    meta?: {
        timestamp: string
        [key: string]: unknown
    }
}

/**
 * Create a success response
 */
export function successResponse<T>(
    data: T,
    status: number = 200,
    meta?: Record<string, unknown>
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            meta: {
                timestamp: new Date().toISOString(),
                ...meta,
            },
        },
        { status }
    )
}

/**
 * Create an error response
 */
export function errorResponse(
    message: string,
    status: number = 500,
    code?: string,
    details?: unknown
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: {
                message,
                code,
                details,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        },
        { status }
    )
}

/**
 * Handle Zod validation errors
 */
export function zodErrorResponse(error: ZodError): NextResponse<ApiResponse> {
    const formattedErrors = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }))

    return errorResponse(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        formattedErrors
    )
}

/**
 * Handle Prisma errors
 */
export function handlePrismaError(error: unknown): NextResponse<ApiResponse> {
    if (typeof error === 'object' && error !== null) {
        const prismaError = error as {
            code?: string
            meta?: { target?: string[] }
        }

        switch (prismaError.code) {
            case 'P2002':
                return errorResponse(
                    `A record with this ${prismaError.meta?.target?.[0] || 'field'} already exists`,
                    409,
                    'DUPLICATE_RECORD'
                )
            case 'P2025':
                return errorResponse('Record not found', 404, 'NOT_FOUND')
            case 'P2003':
                return errorResponse(
                    'Foreign key constraint failed',
                    400,
                    'FOREIGN_KEY_ERROR'
                )
            default:
                return errorResponse(
                    'Database operation failed',
                    500,
                    'DATABASE_ERROR',
                    prismaError.code
                )
        }
    }

    return errorResponse('An unexpected error occurred', 500)
}

/**
 * Generic error handler
 */
export function handleError(error: unknown): NextResponse<ApiResponse> {
    console.error('API Error:', error)

    if (error instanceof ZodError) {
        return zodErrorResponse(error)
    }

    if (error instanceof Error) {
        const appErr = error as Error & { statusCode?: number; code?: string }

        // AppError from @/lib/utils/errors (has statusCode set)
        if (appErr.statusCode) {
            return errorResponse(error.message, appErr.statusCode, appErr.code)
        }

        // Prisma error (has code but no statusCode)
        if ('code' in error && typeof appErr.code === 'string') {
            return handlePrismaError(error)
        }

        return errorResponse(error.message, 500, 'INTERNAL_ERROR')
    }

    return errorResponse('An unexpected error occurred', 500)
}
