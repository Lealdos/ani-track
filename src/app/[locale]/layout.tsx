// @ts-ignore
import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import dynamic from 'next/dynamic'
import { Inter, Roboto_Mono, Dela_Gothic_One } from 'next/font/google'
import './globals.css'
import { ViewTransition, Suspense } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { Toaster } from '@/components/ui/Sonner'
import Footer from '@/components/shared/Footer/Footer'
import Providers from '@/context/providers'

const Header = dynamic(() => import('@/components/shared/Header/Header'))

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto-mono',
})

const delaGothicOne = Dela_Gothic_One({
    variable: '--font-dela-gothic-one',
    weight: ['400'],
    subsets: ['latin', 'latin-ext'],
})

let siteUrl = 'http://localhost:3000'

if (process.env.NEXT_PUBLIC_SITE_URL) {
    siteUrl = process.env.NEXT_PUBLIC_SITE_URL
} else if (process.env.VERCEL_URL) {
    siteUrl = `https://${process.env.VERCEL_URL}`
}

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'AniTrack',
    description:
        'AniTrack is a website that tracks your anime progress and gives you recommendations based on your watching history.',
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    // Enable static rendering for the active locale
    setRequestLocale(locale)

    return (
        <html lang={locale}>
            <body
                className={`${inter.variable} ${roboto_mono.variable} ${delaGothicOne.variable} items-center-safe flex min-h-screen w-full flex-col scroll-smooth bg-gray-950 font-sans text-white antialiased`}
            >
                <NextIntlClientProvider>
                    <SpeedInsights />
                    <Toaster position="bottom-center" className="z-50" />
                    <Suspense>
                        <Header />
                    </Suspense>
                    <Providers>
                        <main className="flex w-full flex-1 flex-col">
                            <ViewTransition>{children}</ViewTransition>
                        </main>
                    </Providers>
                    <Suspense>
                        <Footer />
                    </Suspense>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
