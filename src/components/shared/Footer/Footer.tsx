import Link from 'next/link'
import { Github, Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="w-full border-t border-border/50 bg-card/50">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex flex-col items-center justify-between gap-6 py-8 md:flex-row md:py-6">
                    {/* Logo & Tagline */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                                <span className="font-gothic text-sm font-bold text-primary">A</span>
                            </div>
                            <span className="gradient-home-name font-gothic text-base font-bold">
                                ANI TRACK
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                            Track your anime journey
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link 
                            href="/browse" 
                            className="hover:text-foreground transition-colors"
                        >
                            Browse
                        </Link>
                        <Link 
                            href="/account/my-lists" 
                            className="hover:text-foreground transition-colors"
                        >
                            My Lists
                        </Link>
                    </div>

                    {/* Credits */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            Built with <Heart className="size-3.5 fill-accent text-accent" /> using Next.js
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                            Powered by Jikan API
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
