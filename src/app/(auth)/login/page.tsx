import { Suspense } from 'react'
import { headers } from 'next/headers'
import SignInForm from './_components/SignInForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session?.user) {
        redirect('/account')
    }

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-8">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Suspense>
                    <SignInForm />
                </Suspense>
            </div>
        </div>
    )
}
