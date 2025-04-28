import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="animate-fade-in flex min-h-screen flex-col items-center justify-center gap-8 text-center">
            <Image
                src="/404.png"
                alt="AniTrack Logo"
                width={320}
                height={280}
                priority
            />

            <h1 className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text p-2 text-5xl font-extrabold text-transparent drop-shadow-lg">
                Page Not Found
            </h1>
            <p className="max-w-md text-lg text-gray-400">
                Oops! The page you are looking for does not exist or has been
                moved.
            </p>
            <Link
                href="/"
                className="mt-4 inline-block rounded-lg bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:from-purple-600 hover:to-red-500 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
                Go back home
            </Link>
        </div>
    )
}
