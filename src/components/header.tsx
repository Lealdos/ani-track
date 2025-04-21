'use client'

// import { usePathname } from 'next/navigation'
// import { SearchBar } from '@/components/search-bar';

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { SearchBar } from './search-bar'
import { cn } from '@/lib/utils'

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

    const routes = [{ href: '/anime', label: 'Browse' }]

    return (
        <header
            className={cn(
                `sticky top-0 z-50 flex w-full border-b`,
                isScrolled
                    ? 'bg-gradient-to-r from-slate-900/85 via-purple-900/80 to-slate-900/85 shadow-md backdrop-blur-sm'
                    : 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur'
            )}
        >
            <div className="mx-4 flex h-18 grow-4 items-center justify-center gap-8 md:mx-8">
                <div className="flex">
                    <Link href="/" className="flex items-center">
                        <span className="bg-gradient-to-bl from-red-500 to-red-800 bg-clip-text font-sans text-xl font-bold text-transparent italic">
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

                <div className="hidden flex-1 grow-8 md:flex md:justify-center">
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
                </div>
            </div>

            {/* Mobile menu */}

            <button
                id="menu-button"
                className="relative flex items-center justify-center rounded-md p-2 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {!isMenuOpen && <Menu className="h-6 w-6" strokeWidth={2} />}
            </button>
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
                        {routes.map((route) => (
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
