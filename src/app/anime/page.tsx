import { getAllAnimes } from '@/lib/api';
import { AnimeList } from '@/components/anime-list';

export default async function BrowseAnime() {
    const { data: anime, pagination } = await getAllAnimes(3);
    return (
        <div className='container mx-auto px-4 py-8 text-white min-h-screen w-full'>
            <AnimeList animes={anime} showBadge />
            <div className='flex flex-row justify-between items-center mt-4'>
                <button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium'>
                    {pagination.current_page > 1 ? '←' : ''} Previous page
                </button>
                {pagination.current_page}
                <button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium'>
                    Next page {pagination.has_next_page ? '→' : ''}
                </button>
            </div>
        </div>
    );
}
