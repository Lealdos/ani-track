'use client'

// import { usePathname } from 'next/navigation'
// import { SearchBar } from '@/components/search-bar';

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SearchBar } from './search-bar'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    // const pathname = usePathname()
    // const { user, signOut } = useAuth()

    const routes = [{ href: '/anime', label: 'Browse' }]

    return (
        <header className="bg-background/95 sticky top-0 z-50 w-full border-b bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur">
            <div className="mx-4 flex h-18 items-center justify-center gap-8 md:mx-8">
                <div className="flex">
                    <Link href="/" className="flex items-center">
                        <span className="bg-gradient-to-bl from-red-500 to-red-800 bg-clip-text text-xl font-bold text-transparent">
                            AniTrack
                        </span>
                    </Link>
                </div>

                <div className="hidden text-white md:flex">
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`text-white transition-colors hover:scale-105 hover:text-cyan-500`}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="hidden flex-1 md:flex md:justify-center">
                    <SearchBar />
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    {/* <div className="hidden items-center space-x-4 sm:flex">
                        <Link href="/login">
                            <button className="text-sm">Log in</button>
                        </Link>
                        <Link href="/register">
                            <button className="text-sm">Sign up</button>
                        </Link>
                    </div> */}

                    <button
                        className="flex items-center justify-center rounded-md p-2 md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="container pb-4 md:hidden">
                    <nav className="mx-4 flex flex-col items-end space-y-4">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`text-white transition-colors hover:scale-105 hover:text-cyan-500`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {route.label}
                            </Link>
                        ))}
                        {/* {!user && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )} */}
                    </nav>
                </div>
            )}
        </header>
    )
}
