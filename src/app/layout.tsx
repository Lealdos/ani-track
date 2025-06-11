import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Inter, Roboto_Mono, Dela_Gothic_One } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Sonner'
import Footer from '@/components/Footer/Footer'
import { unstable_ViewTransition as ViewTransition } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const Header = dynamic(() => import('@/components/Header/Header'))

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
    subsets: ['latin', 'latin-ext', 'vietnamese', 'cyrillic'],
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
        <ClerkProvider
            appearance={{
                baseTheme: dark,
            }}
            afterSignOutUrl="/"
        >
            <html lang="en">
                <body
                    className={`${inter.variable} ${roboto_mono.variable} ${delaGothicOne.variable} flex w-full flex-col items-center-safe justify-between bg-gray-950 font-sans text-white antialiased`}
                >
                    <Header />

                    <ViewTransition name="page">
                        {children}
                        <Toaster />
                    </ViewTransition>
                    <Footer />
                </body>
            </html>
        </ClerkProvider>
    )
}
