import { animeRepository } from '@/entities/anime/api'
import { Link } from '@/i18n/navigation'

export default async function GenresList() {
    const genres = await animeRepository.findGenres()
    return (
        <main className="container mx-auto grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {/* id 0 = genres outside the ANILIST_GENRES map (adult-only), not browsable */}
            {genres
                ?.filter((g) => g.id !== 0)
                .map((g) => (
                    <Link
                        key={g.id}
                        href={`/browse?genres=${g.id}`}
                        className="transition-silk border-border/70 bg-card/60 hover:border-primary/60 group relative overflow-hidden rounded-lg border p-4 text-left hover:-translate-y-0.5"
                    >
                        <div className="bg-gradient-sakura absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10" />
                        <p className="font-display text-lg">{g.name}</p>
                    </Link>
                ))}
        </main>
    )
}
