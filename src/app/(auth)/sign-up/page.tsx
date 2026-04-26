import { Suspense } from 'react'
import { SignUpForm } from './_components/signUpForm'
export default function SignupPage() {
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
