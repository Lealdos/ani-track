'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { mergeClassNames } from '@/lib/utils'
import { SearchBar } from './SearchBar'
import {
    SignedIn,
    UserButton,
    SignedOut,
    SignInButton,
    useUser,
} from '@clerk/nextjs'

type Route = {
    href: string
    label: string
}

export default function Header() {
    const animeBrowseMenu: Route[] = [{ href: '/browse', label: 'Browse' }]
    const { isLoaded, user } = useUser()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const mobileMenuRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsMobileMenuVisible(true)
        }
        const menu = mobileMenuRef.current
        if (!menu) return
        const handleAnimationEnd = () => {
            if (!isMobileMenuOpen) {
                setIsMobileMenuVisible(false)
            }
        }
        menu.addEventListener('animationend', handleAnimationEnd)
        return () => {
            menu.removeEventListener('animationend', handleAnimationEnd)
        }
    }, [isMobileMenuOpen])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        const handleClickOutside = (event: MouseEvent) => {
            const mobileMenu = document.getElementById('mobile-menu')

            if (
                isMobileMenuOpen &&
                mobileMenu &&
                !mobileMenu.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMobileMenuOpen])

    return (
        <>
            <div
                className={mergeClassNames(
                    `top-0 z-20 items-center justify-center rounded-full transition-all transition-discrete duration-1000 ease-out`,
                    isScrolled
                        ? 'fixed w-93 max-w-md translate-y-6 animate-rotate-border bg-conic/[from_var(--border-angle)] from-purple-800 from-80% via-red-600 via-90% to-purple-500 to-100% p-[2.5px] md:w-full md:max-w-3xl xl:max-w-6xl'
                        : 'sticky w-full max-w-full'
                )}
            >
                <header
                    className={mergeClassNames(
                        `flex h-16 w-full items-center justify-between md:h-16`,
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
                            <div className="hidden items-center gap-4 text-sm font-medium sm:flex">
                                {isLoaded && user && (
                                    <SignedIn>
                                        <UserButton />
                                    </SignedIn>
                                )}
                                <SignedOut>
                                    <SignInButton mode="modal" />
                                </SignedOut>
                            </div>
                        </div>
                        {/* Mobile menu */}

                        <button
                            id="menu-button"
                            className="flex items-center justify-center rounded-md md:hidden"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {!isMobileMenuOpen ? (
                                <>
                                    <Menu className="h-6 w-6 text-white" />
                                    <span className="sr-only">Open menu</span>
                                </>
                            ) : (
                                <>
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Close menu</span>
                                </>
                            )}
                        </button>
                    </div>
                </header>

                {/* Mobile menu drawer */}
                {isMobileMenuVisible && (
                    <nav
                        ref={mobileMenuRef}
                        id="mobile-menu"
                        className={mergeClassNames(
                            `left-1/2 z-20 mt-4 w-sm -translate-x-1/2 overflow-y-auto rounded-lg border-2 border-purple-900 bg-gradient-to-r from-slate-900/90 via-red-900 to-slate-900/90 p-4 px-2 shadow-md backdrop-blur transition-transform ease-in-out md:hidden`,
                            isMobileMenuOpen
                                ? 'absolute flex animate-flip-down flex-col items-center justify-center animate-duration-300 animate-ease-linear animate-once'
                                : 'absolute flex animate-fade-down flex-col items-center opacity-0 animate-duration-400 animate-reverse'
                        )}
                        tabIndex={-1}
                        aria-labelledby="mobile-menu-label"
                    >
                        <h5
                            id="drawer-right-label"
                            className="mb-4 flex w-full items-center justify-center border-b border-b-red-900 pb-2 text-base font-semibold text-white"
                        >
                            Menu
                        </h5>
                        <br />

                        <ul className="space-y-2 text-white">
                            <li>
                                <SignedOut>
                                    <SignInButton mode="modal" />
                                </SignedOut>
                            </li>

                            {animeBrowseMenu.map((route) => (
                                <li key={route.href}>
                                    <Link
                                        href={route.href}
                                        className="flex items-center rounded-lg hover:bg-gray-700 hover:text-white"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <span>{route.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
            {isMobileMenuOpen && (
                <div
                    className="bg-opacity-50 fixed inset-0 z-10 bg-slate-900/85 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    )
}
