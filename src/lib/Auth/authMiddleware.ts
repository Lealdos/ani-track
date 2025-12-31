import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { errorResponse } from '@/lib/utils/apiResponse'

/**
 * Interface for authenticated session
 */
export interface AuthSession {
    user: {
        id: string
        email: string
        name: string
        image?: string
    }
    session: {
        id: string
        userId: string
        expiresAt: Date
        token: string
        [key: string]: unknown
    }
}

/**
 * Get the current session from better-auth
 */
export async function getSession(): Promise<AuthSession | null> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session) {
            return null
        }

        return session as AuthSession
    } catch (error) {
        console.error('Session error:', error)
        return null
    }
}

/**
 * Middleware to require authentication
 * Returns the session if authenticated, or an error response
 */
export async function requireAuth() {
    const session = await getSession()

    if (!session?.user) {
        return {
            error: errorResponse(
                'Unauthorized - Please log in',
                401,
                'UNAUTHORIZED'
            ),
            session: null,
        }
    }

    return {
        error: null,
        session,
    }
}

/**
 * Middleware to require the user to be the owner of a resource
 */
export async function requireOwnership(resourceUserId: string) {
    const { error, session } = await requireAuth()

    if (error) {
        return { error, session: null }
    }

    if (session!.user.id !== resourceUserId) {
        return {
            error: errorResponse(
                'Forbidden - You do not have access to this resource',
                403,
                'FORBIDDEN'
            ),
            session: null,
        }
    }

    return {
        error: null,
        session,
    }
}

/**
 * Extract user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
    const session = await getSession()
    return session?.user?.id || null
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession()
    return !!session?.user
}

/**
 * Helper to extract bearer token from request
 */
export function extractBearerToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    return authHeader.substring(7)
}

/**
 * Validate API key (if using API keys for service-to-service communication)
 */
export function validateApiKey(request: NextRequest): boolean {
    const apiKey = request.headers.get('X-API-Key')
    const validApiKey = process.env.API_KEY

    if (!validApiKey) {
        return false
    }

    return apiKey === validApiKey
}
