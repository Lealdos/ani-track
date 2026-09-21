'use client'
import { Link } from '@/i18n/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchBar } from './SearchBar'
import * as styles from './headerClasses'
import { LocaleSwitcher } from '@/components/shared/LocaleSwitcher/LocaleSwitcher'
import { useSession, signOut } from '@/lib/Auth/auth-clients'

type Route = {
    href: string
    labelKey: 'browse' | 'genres' | 'myAccount' | 'myLists' | 'login' | 'signUp'
}

const animeBrowseMenu: Route[] = [
    { href: '/browse', labelKey: 'browse' },
    // { href: '/browse/top', labelKey: 'topAnime' },
    { href: '/anime/genres', labelKey: 'genres' },
    // { href: '/account/favorites', labelKey: 'favorites' },
]

const userMenu: Route[] = [
    { href: '/account', labelKey: 'myAccount' },
    { href: '/account/my-lists', labelKey: 'myLists' },
]

const authMenu: Route[] = [
    { href: '/login', labelKey: 'login' },
    { href: '/sign-up', labelKey: 'signUp' },
]

export default function Header() {
    const t = useTranslations('Header')
    const { data: session } = useSession()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [areTransitionsEnabled, setAreTransitionsEnabled] = useState(false)
    const mobileMenuRef = useRef<HTMLDivElement | null>(null)

    const toggleMobileMenu = () => {
        const nextOpen = !isMobileMenuOpen
        setIsMobileMenuOpen(nextOpen)
        // Keep the menu mounted while the close animation plays; it is
        // unmounted on `animationend` (see effect below).
        if (nextOpen) setIsMobileMenuVisible(true)
    }

    useEffect(() => {
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

    // Seeded from the real offset on mount: the server always renders the
    // unscrolled variant, so a reload at a restored scroll position (or a jump
    // to one of the home page's `#section` anchors) would otherwise leave the
    // header stuck in the wrong variant until the first scroll event.
    useEffect(() => {
        const syncScrolled = () => {
            setIsScrolled(window.scrollY > 10)
        }

        syncScrolled()
        window.addEventListener('scroll', syncScrolled, { passive: true })

        return () => {
            window.removeEventListener('scroll', syncScrolled)
        }
    }, [])

    // That first sync can flip the header a whole state, so hold the 1s
    // transition back until the correction has painted. Without this the
    // header visibly morphs on arrival instead of rendering already-correct.
    useEffect(() => {
        let innerFrame = 0
        const outerFrame = requestAnimationFrame(() => {
            innerFrame = requestAnimationFrame(() => {
                setAreTransitionsEnabled(true)
            })
        })

        return () => {
            cancelAnimationFrame(outerFrame)
            cancelAnimationFrame(innerFrame)
        }
    }, [])

    useEffect(() => {
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

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMobileMenuOpen])

    const handleLogout = async () => {
        setIsMobileMenuOpen(false)
        await signOut()
        globalThis.location.href = '/'
    }

    const transitionClasses = areTransitionsEnabled
        ? 'transition-all duration-500 ease-out'
        : ''

    return (
        <>
            <div
                className={cn(
                    styles.wrapperBase,
                    transitionClasses,
                    isScrolled ? styles.wrapperScrolled : styles.wrapperAtTop
                )}
            >
                <header
                    className={cn(
                        styles.barBase,
                        transitionClasses,
                        isScrolled ? styles.barScrolled : styles.barAtTop
                    )}
                >
                    <div
                        className={cn(
                            styles.barInner,
                            isScrolled ? 'px-4' : ''
                        )}
                    >
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center">
                                <span className={styles.logo}>ANI TRACK</span>
                                <span className="sr-only">{t('home')}</span>
                            </Link>
                        </div>

                        <div className="mx-1 max-w-3xl flex-1">
                            <SearchBar />
                        </div>

                        {/*  menu ↓ */}

                        <button
                            id="menu-button"
                            className="flex items-center justify-center rounded-md"
                            onClick={toggleMobileMenu}
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                            aria-label={
                                isMobileMenuOpen
                                    ? t('closeMenu')
                                    : t('openMenu')
                            }
                            type="button"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6 text-white" />
                            )}
                        </button>
                    </div>
                </header>

                {/*  menu MODAL ↓*/}
                <nav
                    ref={mobileMenuRef}
                    id="mobile-menu"
                    hidden={!isMobileMenuVisible}
                    className={cn(
                        `w-90 bg-linear-to-r md:w-md left-1/2 top-64 my-20 mt-4 -translate-x-1/2 overflow-y-auto rounded-lg border-2 border-purple-900 from-slate-900/90 via-red-900 to-slate-900/90 p-4 px-2 shadow-md backdrop-blur transition-transform duration-300 ease-in-out`,
                        isMobileMenuOpen
                            ? 'animate-flip-down animate-duration-300 animate-ease-linear animate-once absolute flex flex-col items-center justify-center'
                            : 'animate-fade-down animate-duration-300 animate-reverse absolute flex flex-col items-center opacity-0'
                    )}
                    tabIndex={-1}
                    aria-labelledby="drawer-right-label"
                >
                    <h5
                        id="drawer-right-label"
                        className="mb-4 flex w-full items-center justify-center border-b border-b-red-900 pb-2 text-base font-semibold text-white"
                    >
                        {t('menu')}
                    </h5>
                    <ul className="items-center-safe flex flex-col justify-center space-y-2 text-white">
                        <li className="w-lg border-b border-b-red-900 pb-2 text-center">
                            {session?.user ? (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer py-1.5 text-white transition-transform hover:scale-105"
                                    >
                                        {t('logout')}
                                    </button>
                                    {userMenu.map((route) => (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            className="py-1.5 text-white transition-transform hover:scale-105"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            {t(route.labelKey)}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    {authMenu.map((route) => (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            className="py-1.5 text-white transition-transform hover:scale-105"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            {t(route.labelKey)}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </li>

                        {animeBrowseMenu.map((route) => (
                            <li key={route.href}>
                                <Link
                                    href={route.href}
                                    className="flex items-center rounded-lg hover:scale-105 hover:text-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>{t(route.labelKey)}</span>
                                </Link>
                            </li>
                        ))}

                        <li className="mt-2 border-t border-t-red-900 pt-3">
                            {/* Reads the locale uncached on routes that skip
                                `setRequestLocale`, so it needs its own
                                boundary. Deferring just this keeps the rest of
                                the header in the initial shell. */}
                            <Suspense fallback={null}>
                                <LocaleSwitcher />
                            </Suspense>
                        </li>
                    </ul>
                </nav>
            </div>
            <div aria-hidden="true" className={styles.spacer} />
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-10 bg-slate-900/85 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    )
}
