import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Sonner'
import Footer from '@/components/Footer/Footer'
import { unstable_ViewTransition as ViewTransition } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const Header = dynamic(() => import('@/components/Header/Header'))
const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
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
                    className={`${geistSans.variable} ${geistMono.variable} flex w-full flex-col items-center-safe justify-between bg-gray-950 text-white antialiased`}
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
