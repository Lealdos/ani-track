import { SectionHeader } from '@/components/shared/SectionHeader/SectionHeader'
import { Skeleton } from '@/components/ui/skeleton'

import { getGenres } from '@/services/JikanAPI/jikanAnimeApi'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function Genres() {
    const genres = await getGenres()

    return (
        <div className="container py-12">
            <SectionHeader title={'Browse by Genre'} />
            {
                <Suspense
                    fallback={
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {Array.from({ length: 18 }).map((_, i) => (
                                <Skeleton
                                    key={`skeleton-genres-${i}-${crypto.randomUUID()}`}
                                    className="bg-muted/60 h-16 rounded-lg"
                                />
                            ))}
                        </div>
                    }
                >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {genres?.map((g) => (
                            <Link
                                key={g.mal_id}
                                href={`/browse?genre=${g.mal_id}`}
                                className="group border-border/70 bg-card/60 transition-silk hover:border-primary/60 relative overflow-hidden rounded-lg border p-4 text-left hover:-translate-y-0.5"
                            >
                                <div className="bg-gradient-sakura absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10" />
                                <p className="font-display text-lg">{g.name}</p>
                                {g.count !== undefined && (
                                    <p className="text-muted-foreground text-xs">
                                        {g.count.toLocaleString()} titles
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                </Suspense>
            }
        </div>
    )
}
