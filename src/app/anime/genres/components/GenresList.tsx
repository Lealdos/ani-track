import { getGenres } from '@/services/JikanAPI/jikanAnimeApi'
import Link from 'next/link'

export default async function GenresList() {
    const genres = await getGenres()
    return (
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
    )
}
