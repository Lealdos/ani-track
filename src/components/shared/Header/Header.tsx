'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Menu, X, User, LogOut, List, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchBar } from './SearchBar'
import { useSession, signOut } from '@/lib/Auth/auth-clients'
import { useRouter } from 'next/navigation'

type Route = {
    href: string
    label: string
    icon: React.ReactNode
}

export default function Header() {
    const router = useRouter()

    const animeBrowseMenu: Route[] = [
        { href: '/browse', label: 'Browse', icon: <Compass className="size-4" /> }
    ]
    const {
        data: session,
        refetch,
        isRefetching,
    } = useSession()
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

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/')
                },
            },
        })
        refetch()
    }

    return (
        <>
            <div
                className={cn(
                    `top-0 z-20 w-full transition-all duration-500 ease-out`,
                    isScrolled
                        ? 'fixed'
                        : 'sticky'
                )}
            >
                <header
                    className={cn(
                        `flex h-16 w-full items-center justify-center transition-all duration-300`,
                        isScrolled
                            ? 'glass border-b border-border/50 shadow-lg shadow-primary/5'
                            : 'bg-background/80 backdrop-blur-sm border-b border-border/30'
                    )}
                >
                    <div className="container mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
                                <span className="font-gothic text-lg font-bold text-primary">A</span>
                            </div>
                            <span className="gradient-home-name font-gothic text-lg font-bold md:text-xl">
                                ANI TRACK
                            </span>
                        </Link>

                        {/* Search Bar - Center */}
                        <div className="flex-1 max-w-xl hidden sm:block">
                            <SearchBar />
                        </div>

                        {/* Desktop Nav Links */}
                        <nav className="hidden md:flex items-center gap-2">
                            {animeBrowseMenu.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                                >
                                    {route.icon}
                                    {route.label}
                                </Link>
                            ))}
                            
                            {session?.user ? (
                                <div className="flex items-center gap-2 ml-2">
                                    <Link
                                        href="/account/my-lists"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                                    >
                                        <List className="size-4" />
                                        My Lists
                                    </Link>
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                                    >
                                        <User className="size-4" />
                                        Account
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
                                    >
                                        <LogOut className="size-4" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 ml-2">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/sign-up"
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            id="menu-button"
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-secondary/50 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-controls="mobile-menu"
                            aria-label="Open menu"
                            type="button"
                        >
                            {!isMobileMenuOpen ? (
                                <Menu className="size-5 text-foreground" />
                            ) : (
                                <X className="size-5 text-foreground" />
                            )}
                        </button>
                    </div>
                </header>

                {/* Mobile Search Bar */}
                <div className="sm:hidden px-4 py-2 bg-background/80 backdrop-blur-sm border-b border-border/30">
                    <SearchBar />
                </div>

                {/* Mobile Menu Modal */}
                {isMobileMenuVisible && (
                    <nav
                        ref={mobileMenuRef}
                        id="mobile-menu"
                        className={cn(
                            `absolute left-1/2 -translate-x-1/2 mt-2 w-[calc(100%-2rem)] max-w-sm rounded-xl glass p-4 shadow-xl shadow-primary/10 md:hidden`,
                            isMobileMenuOpen
                                ? 'animate-flip-down animate-duration-300 animate-ease-linear animate-once'
                                : 'animate-fade-down animate-duration-300 animate-reverse opacity-0'
                        )}
                        tabIndex={-1}
                        aria-labelledby="mobile-menu-label"
                    >
                        <div className="space-y-1">
                            {animeBrowseMenu.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {route.icon}
                                    {route.label}
                                </Link>
                            ))}
                            
                            <div className="my-2 h-px bg-border/50" />
                            
                            {session?.user ? (
                                <>
                                    <Link
                                        href="/account/my-lists"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <List className="size-4" />
                                        My Lists
                                    </Link>
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="size-4" />
                                        My Account
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-accent hover:bg-secondary/50 transition-colors"
                                    >
                                        <LogOut className="size-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/sign-up"
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                )}
            </div>
            
            {/* Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    )
}
