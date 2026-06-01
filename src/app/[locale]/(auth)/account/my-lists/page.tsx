import { auth } from '@/lib/auth'
import {
    DashboardSkeleton,
    UserListsDashboard,
} from './_components/UserListsDashboard'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Suspense } from 'react'

export default async function MyListsPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                <UserListsDashboard />
            </div>
        </Suspense>
    )
}
