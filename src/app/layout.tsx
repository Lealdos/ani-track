import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import dynamic from 'next/dynamic'
import { Inter, Roboto_Mono, Dela_Gothic_One } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/shared/components/ui/Sonner'
import Footer from '@/shared/components/Footer/Footer'
// @ts-ignore
import { ViewTransition } from 'react'
import { AuthProvider } from '@/context/auth/AuthContext'
const Header = dynamic(() => import('@/shared/components/Header/Header'))

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
        <html lang="en">
            <body
                className={`${inter.variable} ${roboto_mono.variable} ${delaGothicOne.variable} flex w-full flex-col items-center-safe justify-between scroll-smooth bg-gray-950 font-sans text-white antialiased`}
            >
                <AuthProvider>
                    <SpeedInsights />
                    <Header />

                    <ViewTransition> {children}</ViewTransition>
                    <Toaster />
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    )
}
