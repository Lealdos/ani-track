import { getAllAnimes } from '@/lib/api'
import { AnimeList } from '@/components/anime-list'

export default async function BrowseAnime() {
    const { data: anime, pagination } = await getAllAnimes(3)
    return (
        <div className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
            <AnimeList animes={anime} showBadge />
            <div className="mt-4 flex flex-row items-center justify-between">
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    {pagination.current_page > 1 ? '←' : ''} Previous page
                </button>
                {pagination.current_page}
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Next page {pagination.has_next_page ? '→' : ''}
                </button>
            </div>
        </div>
    )
}
