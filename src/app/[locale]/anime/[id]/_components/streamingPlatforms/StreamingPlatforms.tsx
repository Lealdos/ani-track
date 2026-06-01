import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Platform {
    name: string
    logo: string
    url: string
    color: string
    subscription: string
    price: string
}

interface StreamingPlatformsProps {
    platforms: Platform[]
    animeTitle?: string
}

export function StreamingPlatforms({
    platforms,
    animeTitle,
}: StreamingPlatformsProps) {
    const t = useTranslations('AnimeDetail')
    return (
        <section className="lg:min-w-3xl mx-auto my-2 space-y-4 md:min-w-max">
            {platforms.map((platform, index) => (
                <div
                    key={index + platform.name}
                    className="bg-amber-950/34 flex flex-col justify-between gap-4 rounded-lg border border-gray-800 p-4 sm:flex-row sm:items-center"
                >
                    <div className="mb-4 flex items-center gap-4 sm:mb-0">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${platform.color}`}
                        >
                            {platform.logo}
                        </div>
                        <h3 className="text-base font-medium">
                            {t('watchOn', {
                                title: animeTitle ?? '',
                                platform: platform.name,
                            })}
                        </h3>
                    </div>
                    <button className="flex items-center justify-center gap-2 truncate rounded-lg bg-rose-950 p-2 text-base hover:bg-gray-700">
                        <a
                            href={`${platform.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-32 truncate"
                        >
                            {platform.name}
                        </a>
                        <ExternalLink className="ml-2" />
                    </button>
                </div>
            ))}
        </section>
    )
}
