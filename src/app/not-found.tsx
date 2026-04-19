import Image from 'next/image'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <Image
                src="/404.png"
                alt="AniTrack 404 Page Not Found"
                className="h-64 w-auto md:h-80"
                width={408}
                height={612}
                priority
            />

            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    Page Not Found
                </h1>
                <p className="max-w-md text-lg text-muted-foreground">
                    Oops! The page you are looking for doesn&apos;t exist or has been moved.
                </p>
            </div>
            
            <Link
                href="/"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105"
            >
                <Home className="size-4" />
                Go back home
            </Link>
        </div>
    )
}
