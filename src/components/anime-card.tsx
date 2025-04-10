import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Anime } from '@/types/anime';
// import { AddToListButton } from '@/components/add-to-list-button';

interface AnimeCardProps {
    anime: Anime;
    showBadge?: boolean;
}

export function AnimeCard({ anime, showBadge = false }: AnimeCardProps) {
    return (
        <Card className='overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-md h-full '>
            <Link
                href={`/anime/${anime.mal_id}`}
                className='flex flex-col justify-center items-center'
            >
                <div className='relative aspect-[2/3] w-full overflow-hidden'>
                    <img
                        src={
                            anime.images?.jpg.large_image_url ||
                            anime.images?.jpg.image_url ||
                            '/placeholder.jpg'
                        }
                        alt={anime.title}
                        className='object-cover'
                    />
                    {showBadge && anime.score && (
                        <div className='absolute right-2 top-2 bg-yellow-400/90 p-1 rounded-md text-primary-foreground'>
                            ★ {anime.score.toFixed(1)}
                        </div>
                    )}
                </div>
                <CardContent className='p-3'>
                    <h3 className='line-clamp-2 font-medium leading-tight'>
                        {anime.title}
                    </h3>
                    <p className='mt-1 text-xs text-muted-foreground'>
                        {anime.type} •{' '}
                        {anime.episodes ? `${anime.episodes} eps` : '? eps'} •{' '}
                        {anime.status}
                    </p>
                </CardContent>
            </Link>
            <div className='px-3 pb-3'>
                {/* <AddToListButton animeId={anime.mal_id} /> */}
                <button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium'>
                    Add to list
                </button>
            </div>
        </Card>
    );
}
