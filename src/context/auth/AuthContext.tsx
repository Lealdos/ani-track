'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

interface AuthContextType {
    session: Session | null
    status: 'authenticated' | 'loading' | 'unauthenticated'
    isAuthenticated: boolean
    isLoading: boolean
    signIn: typeof signIn
    signOut: typeof signOut
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
        </SessionProvider>
    )
}

function AuthContextProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()

    const value: AuthContextType = {
        session,
        status,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        signIn,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
