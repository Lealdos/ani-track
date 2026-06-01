import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SignUpForm } from './_components/signUpForm'

export default async function SignupPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session?.user) {
        redirect('/account')
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Suspense>
                    <SignUpForm />
                </Suspense>
            </div>
        </div>
    )
}
