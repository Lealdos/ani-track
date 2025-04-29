'use client'

// import { usePathname } from 'next/navigation'
// import { SearchBar } from '@/components/search-bar';

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchBar } from './search-bar'

type Route = {
    href: string
    label: string
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
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
                isMenuOpen &&
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
    }, [isMenuOpen])

    const LeftHeaderRoutes: Route[] = [{ href: '/browse', label: 'Browse' }]
    const RightHeaderRoutes: Route[] = [
        { href: '/login', label: 'Log in' },
        { href: '/register', label: 'Sign up' },
    ]

    return (
        <header
            className={cn(
                `top-0 z-50 flex h-18 w-full items-center justify-between border-b px-4`,
                isScrolled
                    ? 'fixed bg-gradient-to-r from-slate-900/85 via-purple-900/80 to-slate-900/85 shadow-md backdrop-blur-sm'
                    : 'sticky bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur'
            )}
        >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center">
                        <span className="bg-gradient-to-bl from-red-500 to-red-800 bg-clip-text font-sans text-xl font-bold text-transparent italic">
                            AniTrack
                        </span>
                    </Link>

                    <nav className="hidden items-center text-sm font-medium md:flex">
                        {LeftHeaderRoutes.map((route) => (
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

                <div className="mx-4 max-w-md flex-1">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden items-center gap-4 text-sm font-medium sm:flex">
                        {RightHeaderRoutes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`w-max text-white transition-colors hover:scale-105 hover:text-cyan-500`}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </nav>

                    <button
                        id="menu-button"
                        className="relative flex items-center justify-center rounded-md p-2 md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {!isMenuOpen && (
                            <Menu
                                className="h-6 w-6 text-white"
                                strokeWidth={2}
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div
                    id="mobile-drawer"
                    className={`fixed top-0 right-0 z-40 container h-screen w-72 -translate-x-full overflow-y-auto bg-gradient-to-tr from-slate-900/90 via-purple-900/90 to-slate-900/90 p-4 shadow-md backdrop-blur-sm transition-transform ${
                        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
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
                        className="absolute end-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-white"
                    >
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                    </button>
                    <ul className="space-y-2 text-white">
                        <li>
                            <Link
                                href="/login"
                                className="flex items-center rounded-lg p-2 hover:bg-gray-700 hover:text-white"
                            >
                                <span>Login</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/register"
                                className="flex items-center rounded-lg p-2 hover:bg-gray-700 hover:text-white"
                            >
                                <span>Register</span>
                            </Link>
                        </li>
                        {LeftHeaderRoutes.map((route) => (
                            <li key={route.href}>
                                <Link
                                    href={route.href}
                                    className="flex items-center rounded-lg p-2 hover:bg-gray-700 hover:text-white"
                                >
                                    <span>{route.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    )
}
