'use client'
import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from '@/lib/Auth/auth-clients'
import { toast } from 'sonner'

export function useRequireAuth() {
    const { data: session } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const isAuthenticated = !!session?.user?.id

    const requireAuth = useCallback(
        (action: () => void) => {
            if (isAuthenticated) {
                action()
                return
            }
            toast.info('Sign in to use this feature', {
                action: {
                    label: 'Sign in',
                    onClick: () =>
                        router.push(
                            `/login?callbackURL=${encodeURIComponent(pathname)}`
                        ),
                },
            })
            router.push(`/login?callbackURL=${encodeURIComponent(pathname)}`)
        },
        [isAuthenticated, router, pathname]
    )

    return { isAuthenticated, requireAuth }
}
