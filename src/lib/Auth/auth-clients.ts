import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { auth } from '../auth'

export const {
    signIn,
    signUp,
    useSession,
    signOut,
    getSession,
    getAccessToken,
    refreshToken,
    resetPassword,
    changePassword,
} = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [inferAdditionalFields<typeof auth>()],
})
