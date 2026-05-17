import { ExternalLink } from 'lucide-react'

interface FreePageProps {
    animeTitleRomaji: string
}

const freeSites = [
    {
        name: 'AniWaves',
        language: 'English',
        buildUrl: (title: string) =>
            `https://aniwaves.ru/filter?keyword=${encodeURIComponent(title)}`,
    },
    {
        name: 'AnimeAV1',
        language: 'Spanish',
        buildUrl: (title: string) =>
            `https://animeav1.com/catalogo?search=${encodeURIComponent(title)}`,
    },
]

export function FreePage({ animeTitleRomaji }: FreePageProps) {
    return (
        <section className="mt-8 md:min-w-max lg:min-w-3xl">
            <h2 className="mb-4 text-2xl font-bold">Watch for free</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {freeSites.map((site) => (
                    <a
                        key={site.name}
                        href={site.buildUrl(animeTitleRomaji)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 rounded-lg border border-purple-800 bg-rose-950/60 p-3 text-base text-gray-100 transition-colors hover:bg-rose-900"
                    >
                        <span>
                            Watch {animeTitleRomaji} on {site.name} (
                            {site.language})
                        </span>
                        <ExternalLink className="h-4 w-4" />
                    </a>
                ))}
            </div>
        </section>
    )
}
