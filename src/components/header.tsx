'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
// import { Button } from "@/components/ui/button"
// import { SearchBar } from '@/components/search-bar';
import { Menu, X } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    // const { user, signOut } = useAuth()

    const routes = [
        { href: '/', label: 'Home' },
        { href: '/anime', label: 'Browse' },
        { href: '/genres', label: 'Genres' },
        { href: '/seasonal', label: 'Seasonal' },
    ];

    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-16 items-center'>
                <div className='mr-4 flex'>
                    <Link href='/' className='flex items-center space-x-2'>
                        <span className='text-xl font-bold'>AniTrack</span>
                    </Link>
                </div>

                <div className='hidden md:flex md:flex-1'>
                    <nav className='flex items-center space-x-6 text-sm font-medium'>
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`transition-colors hover:text-foreground/80 ${
                                    pathname === route.href
                                        ? 'text-foreground'
                                        : 'text-foreground/60'
                                }`}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className='hidden flex-1 md:flex md:justify-center'>
                    {/* <SearchBar /> */}
                    <input type='text' placeholder='Search...' />
                </div>

                <div className='flex flex-1 items-center justify-end space-x-4'>
                    {/* {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-lists">My Lists</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (  )}*/}
                    <div className='hidden items-center space-x-4 sm:flex'>
                        <Link href='/login'>
                            <button className='text-sm'>Log in</button>
                        </Link>
                        <Link href='/register'>
                            <button className='text-sm'>Sign up</button>
                        </Link>
                    </div>

                    <button
                        className='flex items-center justify-center rounded-md p-2 text-foreground md:hidden'
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className='h-6 w-6' />
                        ) : (
                            <Menu className='h-6 w-6' />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className='container pb-4 md:hidden'>
                    <nav className='flex flex-col space-y-4'>
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                                    pathname === route.href
                                        ? 'text-foreground'
                                        : 'text-foreground/60'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {route.label}
                            </Link>
                        ))}
                        {/* {!user && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors hover:text-foreground/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium transition-colors hover:text-foreground/80"
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
    );
}
