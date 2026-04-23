import { ExternalLink } from 'lucide-react'

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
    return (
        <div className="my-2 space-y-4">
            {platforms.map((platform, index) => (
                <div
                    key={index + platform.name}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-gray-800 bg-amber-950/34 p-4 sm:flex-row sm:items-center"
                >
                    <div className="mb-4 flex items-center gap-4 sm:mb-0">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${platform.color}`}
                        >
                            {platform.logo}
                        </div>
                        <div>
                            <h3 className="text-base font-medium">
                                Watch {animeTitle} on {platform.name}
                            </h3>
                            <div className="text-sm text-gray-400">
                                {platform.subscription} • {platform.price}
                            </div>
                        </div>
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
        </div>
    )
}
