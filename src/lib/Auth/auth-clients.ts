import { createAuthClient } from 'better-auth/react'

export const {
    signIn,
    signUp,
    useSession,
    signOut,
    resetPassword,
    changePassword,
} = createAuthClient()
