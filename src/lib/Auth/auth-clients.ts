import { createAuthClient } from 'better-auth/react'

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
    baseURL: 'http://localhost:3000/api/auth',
})
