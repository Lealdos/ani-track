import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAnimeById } from '@/lib/api';
// import { AddToListButton } from '@/components/add-to-list-button';
import { Star, Calendar, Clock, Film } from 'lucide-react';

interface Gnre {
    mal_id: number;
    name: string;
}

export async function generateMetadata({ params }: { params: { id: number } }) {
    const anime = await getAnimeById(params.id);

    if (!anime) {
        return {
            title: 'Anime Not Found',
        };
    }

    return {
        title: `${anime.title} | AniTrack`,
        description: anime.synopsis,
    };
}

export default async function AnimePage({
    params,
}: {
    params: { id: number };
}) {
    const anime = await getAnimeById(params.id);

    if (!anime) {
        notFound();
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-8 grid gap-8 md:grid-cols-[300px_1fr]'>
                <div className='space-y-4'>
                    <div className='overflow-hidden rounded-lg'>
                        <Image
                            src={
                                anime.images.jpg.large_image_url ||
                                anime.images.jpg.image_url
                            }
                            alt={anime.title}
                            width={300}
                            height={450}
                            className='h-auto w-full object-cover'
                        />
                    </div>
                    {/* <AddToListButton animeId={anime.mal_id} /> */}
                </div>

                <div className='space-y-6'>
                    <div>
                        <h1 className='text-3xl font-bold'>{anime.title}</h1>
                        {!!anime.score && (
                            <div className='mt-2 flex items-center'>
                                <Star className='mr-1 h-5 w-5 fill-yellow-500 text-yellow-500' />
                                <span className='font-medium'>
                                    {anime.score.toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <div className='flex flex-wrap gap-2'>
                            <div className='text-foreground'>{anime.type}</div>
                            {anime.rating && (
                                <div className='text-foreground'>
                                    {anime.rating}
                                </div>
                            )}
                            {anime.status && (
                                <div className='text-foreground'>
                                    {anime.status}
                                </div>
                            )}
                        </div>

                        <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground'>
                            {anime.aired?.from && (
                                <div className='flex items-center'>
                                    <Calendar className='mr-1 h-4 w-4' />
                                    <span>
                                        {new Date(
                                            anime.aired.from
                                        ).getFullYear()}
                                        {anime.aired.to &&
                                            ` - ${new Date(
                                                anime.aired.to
                                            ).getFullYear()}`}
                                    </span>
                                </div>
                            )}

                            {!!anime.episodes && (
                                <div className='flex items-center'>
                                    <Film className='mr-1 h-4 w-4' />
                                    <span>{anime.episodes} episodes</span>
                                </div>
                            )}

                            {anime.duration && (
                                <div className='flex items-center'>
                                    <Clock className='mr-1 h-4 w-4' />
                                    <span>{anime.duration}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {anime.synopsis && (
                        <div>
                            <h2 className='mb-2 text-xl font-semibold'>
                                Synopsis
                            </h2>
                            <p className='text-muted-foreground'>
                                {anime.synopsis}
                            </p>
                        </div>
                    )}

                    {anime.genres && anime.genres.length > 0 && (
                        <div>
                            <h2 className='mb-2 text-xl font-semibold'>
                                Genres
                            </h2>
                            <div className='flex flex-wrap gap-2'>
                                {anime.genres.map((genre: Gnre) => (
                                    <div
                                        key={genre.mal_id}
                                        className='border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    >
                                        {genre.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {anime.studios && anime.studios.length > 0 && (
                        <div>
                            <h2 className='mb-2 text-xl font-semibold'>
                                Studios
                            </h2>
                            <div className='flex flex-wrap gap-2'>
                                {anime.studios.map((studio: Gnre) => (
                                    <div
                                        key={studio.mal_id}
                                        className='text-foreground'
                                    >
                                        {studio.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {anime.streaming && anime.streaming.length > 0 && (
                        <div>
                            <h2 className='mb-2 text-xl font-semibold'>
                                Streaming
                            </h2>
                            <div className='flex flex-wrap gap-2'>
                                {anime.streaming.map(
                                    (streaming: { name: string }) => (
                                        <div
                                            key={streaming.name}
                                            className='text-foreground'
                                        >
                                            {streaming.name}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
