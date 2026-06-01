import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
    const t = useTranslations('NotFound')

    return (
        <div className="animate-fade-in mx-auto my-8 flex flex-col items-center justify-center gap-6 text-center">
            <Image
                src="/404.webp"
                alt="AniTrack 404 Page Not Found"
                className="h-80 w-auto md:h-96"
                width={408}
                height={612}
                priority
            />

            <h1 className="bg-linear-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text p-2 text-5xl font-extrabold text-transparent drop-shadow-lg">
                {t('title')}
            </h1>
            <p className="max-w-md text-xl text-gray-300">{t('description')}</p>
            <Link
                href="/"
                className="bg-linear-to-r mt-4 inline-block rounded-lg from-purple-700 via-pink-600 to-red-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:from-purple-800 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
                {t('goHome')}
            </Link>
        </div>
    )
}
