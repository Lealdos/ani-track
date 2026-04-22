import { auth } from '@/lib/auth'
import { UserListsDashboard } from './_components/UserListsDashboard'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function MyListsPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8">
            <UserListsDashboard />
        </div>
    )
}
