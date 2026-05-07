import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { EditUserList } from './_components/EditUserList'

type Props = { params: Promise<{ id: string }> }

export default async function EditListPage({ params }: Props) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        redirect('/login')
    }

    const { id } = await params

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
            <EditUserList listId={id} />
        </div>
    )
}
