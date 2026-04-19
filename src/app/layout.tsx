// @ts-ignore
import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import dynamic from 'next/dynamic'
import { Inter, Roboto_Mono, Dela_Gothic_One } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Sonner'
import Footer from '@/components/shared/Footer/Footer'
import { ViewTransition } from 'react'
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

export const metadata: Metadata = {
    title: 'AniTrack',
    description:
        'AniTrack is a website that tracks your anime progress and gives you recommendations based on your watching history.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="bg-background">
            <body
                className={`${inter.variable} ${roboto_mono.variable} ${delaGothicOne.variable} flex min-h-screen w-full flex-col items-center scroll-smooth bg-background font-sans text-foreground antialiased`}
            >
                <SpeedInsights />
                <Header />
                <main className="flex-1 w-full">
                    <ViewTransition>{children}</ViewTransition>
                </main>
                <Toaster />
                <Footer />
            </body>
        </html>
    )
}
