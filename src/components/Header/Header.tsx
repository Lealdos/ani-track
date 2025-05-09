'use client'

// import { usePathname } from 'next/navigation'
// import { SearchBar } from '@/components/search-bar';

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { mergeClassNames } from '@/lib/utils'
import { SearchBar } from './SearchBar'

type Route = {
    href: string
    label: string
}

export default function Header() {
    const animeBrowseMenu: Route[] = [{ href: '/browse', label: 'Browse' }]
    const AuthHeaderRoutes: Route[] = [
        { href: '/login', label: 'Log in' },
        { href: '/register', label: 'Sign up' },
    ]

    const [IsMobileMenuVisible, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    // const pathname = usePathname()
    // const { user, signOut } = useAuth()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        const handleClickOutside = (event: MouseEvent) => {
            const drawer = document.getElementById('mobile-drawer')

            if (
                IsMobileMenuVisible &&
                drawer &&
                !drawer.contains(event.target as Node)
            ) {
                setIsMenuOpen(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [IsMobileMenuVisible])

    return (
        <div
            className={mergeClassNames(
                `top-0 z-50 items-center justify-center rounded-full transition-all transition-discrete duration-1000 ease-out`,
                isScrolled
                    ? 'fixed w-93 max-w-md translate-y-10 animate-rotate-border bg-conic/[from_var(--border-angle)] from-purple-800 from-80% via-red-600 via-90% to-purple-500 to-100% p-[2.5px] md:w-full md:max-w-3xl xl:max-w-6xl'
                    : 'sticky w-full max-w-full'
            )}
        >
            <header
                className={mergeClassNames(
                    `flex h-14 w-full items-center justify-between md:h-16`,
                    isScrolled
                        ? 'rounded-full bg-gradient-to-r from-slate-900/90 via-red-900 to-slate-900/90 shadow-md backdrop-blur md:px-20'
                        : 'border-b border-b-red-900 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 px-2 backdrop-blur md:px-40'
                )}
            >
                <div
                    className={mergeClassNames(
                        'mx-auto flex w-full items-center justify-between gap-4',
                        isScrolled ? 'px-4' : ''
                    )}
                >
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center">
                            <span className="bg-gradient-to-bl from-red-500 to-red-800 bg-clip-text font-sans text-xl font-bold text-transparent italic">
                                AniTrack
                            </span>
                        </Link>

                        <nav className="hidden items-center text-sm font-medium md:flex">
                            {animeBrowseMenu.map((route) => (
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

                    <div className="mx-1 max-w-md flex-1">
                        <SearchBar />
                    </div>

                    <div className="flex items-center gap-4">
                        <nav className="hidden items-center gap-4 text-sm font-medium sm:flex">
                            {AuthHeaderRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={`w-max text-white transition-colors hover:scale-105 hover:text-cyan-500`}
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile menu */}

                        <button
                            id="menu-button"
                            className="relative flex items-center justify-center rounded-md p-2 md:hidden"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            {!IsMobileMenuVisible && (
                                <Menu
                                    className="h-6 w-6 text-white"
                                    strokeWidth={2}
                                />
                            )}
                            <span className="sr-only">Open menu</span>
                        </button>
                    </div>
                </div>

                <aside
                    id="mobile-drawer"
                    className={mergeClassNames(
                        `fixed z-20 overflow-y-auto rounded-lg bg-gradient-to-tr from-slate-900/90 via-purple-900/90 to-slate-900/90 p-4 shadow-md backdrop-blur-sm transition-transform duration-500 ease-in-out md:hidden`,
                        IsMobileMenuVisible
                            ? 'top-0 right-0 h-screen w-48 translate-x-0'
                            : '-top-10 -right-8 h-0.5 w-0.5 translate-x-full'
                    )}
                    tabIndex={-1}
                    aria-labelledby="drawer-right-label"
                >
                    <h5
                        id="drawer-right-label"
                        className="mb-4 inline-flex items-center text-base font-semibold text-white"
                    >
                        <User className="mr-2.5 h-4 w-4" />
                        Menu
                    </h5>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute end-12 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-white"
                    >
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                    </button>
                    <ul className="space-y-2 text-white">
                        {AuthHeaderRoutes.map((route) => (
                            <li key={route.href}>
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={`w-max text-white transition-colors hover:scale-105 hover:text-cyan-500`}
                                >
                                    {route.label}
                                </Link>
                            </li>
                        ))}

                        {animeBrowseMenu.map((route) => (
                            <li key={route.href}>
                                <Link
                                    href={route.href}
                                    className="flex items-center rounded-lg p-2 hover:bg-gray-700 hover:text-white"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>{route.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
            </header>
        </div>
    )
}
