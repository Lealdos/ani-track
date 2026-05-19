import { Suspense } from 'react'

import { UserListsService } from '@/app/api/users-lists/_services/userListsService'
import {
    PublicListContent,
    PublicListSkeleton,
} from './_components/PublicListContent'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
    const { id } = await params
    const result = await UserListsService.getPublicById(id)

    if (result.status === 'not-found')
        return { title: 'List not found | AniTrack' }
    if (result.status === 'private') return { title: 'Private list | AniTrack' }

    const { list } = result
    const owner = list.user.userName || list.user.name
    const title = `${list.name} | AniTrack`
    const description = `An anime list by @${owner} on AniTrack — ${list.listItems.length} anime`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `/anime/lists/${list.id}`,
            siteName: 'AniTrack',
            type: 'website',
        },
        twitter: { card: 'summary', title, description },
    }
}

export default function PublicListPage({ params }: Props) {
    return (
        <Suspense fallback={<PublicListSkeleton />}>
            <PublicListContent params={params} />
        </Suspense>
    )
}
