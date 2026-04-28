import { animeRepository } from '@/entities/anime/api'
import Link from 'next/link'

export default async function GenresList() {
    const genres = await animeRepository.findGenres()
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {genres?.map((g) => (
                <Link
                    key={g.id}
                    href={`/browse?genre=${g.id}`}
                    className="group transition-silk relative overflow-hidden rounded-lg border border-border/70 bg-card/60 p-4 text-left hover:-translate-y-0.5 hover:border-primary/60"
                >
                    <div className="bg-gradient-sakura absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10" />
                    <p className="font-display text-lg">{g.name}</p>
                    {g.count !== undefined && (
                        <p className="text-xs text-muted-foreground">
                            {g.count.toLocaleString()} titles
                        </p>
                    )}
                </Link>
            ))}
        </div>
    )
}
