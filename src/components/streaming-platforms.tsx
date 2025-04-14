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
}

export function StreamingPlatforms({ platforms }: StreamingPlatformsProps) {
    return (
        <div className="space-y-4">
            {platforms.map((platform, index) => (
                <div
                    key={index}
                    className="flex flex-col justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 sm:flex-row sm:items-center"
                >
                    <div className="mb-4 flex items-center gap-4 sm:mb-0">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${platform.color}`}
                        >
                            {platform.logo}
                        </div>
                        <div>
                            <h3 className="font-medium">{platform.name}</h3>
                            <div className="text-sm text-gray-400">
                                {platform.subscription} • {platform.price}
                            </div>
                        </div>
                    </div>
                    <button className="bg-gray-800 hover:bg-gray-700">
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ver ahora
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </button>
                </div>
            ))}
        </div>
    )
}
