'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

interface SignUpParams {
    email: string
    password: string
    fullName: string
    username: string
}
export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        })

        return {
            success: true,
            message: 'Signed in successfully.',
            headers: await headers(),
        }
    } catch (error) {
        const e = error as Error

        return {
            success: false,
            message: e.message || 'An unknown error occurred.',
        }
    }
}

export const signUp = async (
    params: SignUpParams
): Promise<{ success: boolean; message: string }> => {
    const { email, password, username, fullName } = params
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
                userName: username,
            },
        })

        return {
            success: true,
            message: 'Signed up successfully.',
        }
    } catch (error) {
        const e = error as Error

        return {
            success: false,
            message: e.message || 'An unknown error occurred.',
        }
    }
}
