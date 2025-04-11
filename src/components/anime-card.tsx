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
        <Card className='overflow-hidden transition-all duration-400 hover:scale-105 hover:shadow-xl flex flex-col justify-between items-center'>
            <Link href={`/anime/${anime.mal_id}`}>
                <div className='relative '>
                    <img
                        src={
                            anime.images?.jpg.large_image_url ||
                            anime.images?.jpg.image_url ||
                            '/placeholder.jpg'
                        }
                        alt={anime.title}
                        className='object-cover rounded'
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
            <div className='pb-3'>
                {/* <AddToListButton animeId={anime.mal_id} /> */}
                <button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium'>
                    Add to list
                </button>
            </div>
        </Card>
    );
}
