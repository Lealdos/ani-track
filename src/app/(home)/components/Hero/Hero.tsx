import { CalendarDays, Flame, Sparkles } from 'lucide-react'
import { PetalsOverlay } from './PetalsOverlay'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from '@/components/shared/SectionHeader/SectionHeader'

function Hero() {
    return (
        <section className="relative -top-10 h-full w-full">
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10" />
            <div className="relative w-full rounded-lg p-4">
                <Image
                    src={'/hero-sakura.jpeg'}
                    alt="Lone figure under a cherry blossom tree above a glowing night city"
                    className="fade-edges absolute inset-0 w-full object-cover opacity-40"
                    width={2560}
                    height={1440}
                />
                <div className="from-background/10 via-background/50 to-background absolute inset-0 bg-linear-to-b" />
                <div className="bg-gradient-glow absolute inset-0 opacity-80" />
                <PetalsOverlay count={22} />

                <div className="relative container flex min-h-[40vh] flex-col items-start justify-end pt-24 pb-16 md:pb-24">
                    <SectionHeader title="Welcome to AniTrack" />

                    <h1 className="font-display mt-3 max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight md:text-7xl">
                        Where every{' '}
                        <span className="text-gradient-sakura">season</span>{' '}
                        blooms a new anime.
                    </h1>
                </div>
                {/* QUICK NAV */}

                <div className="container mt-10 flex flex-col items-center-safe justify-between gap-4 md:mt-30 md:flex-row">
                    {[
                        {
                            to: '#season',
                            icon: Sparkles,
                            title: 'This Season',
                            desc: 'Currently broadcasting hits & hidden gems.',
                        },
                        {
                            to: '#schedule',
                            icon: CalendarDays,
                            title: 'Airing Now',
                            desc: "Today's broadcasting schedule.",
                        },
                        {
                            to: '#global-top',
                            icon: Flame,
                            title: 'Top Ranked',
                            desc: 'All-time greatest, by score & popularity.',
                        },
                    ].map((c) => (
                        <Link
                            key={c.to}
                            href={c.to}
                            className="group border-border/70 bg-card shadow-soft transition-silk hover:border-primary/60 relative min-w-80 overflow-hidden rounded-xl border p-5 backdrop-blur hover:-translate-y-0.5"
                        >
                            <div className="bg-gradient-sakura absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25" />
                            <c.icon className="text-primary h-5 w-5" />
                            <h3 className="font-display mt-3 text-2xl">
                                {c.title}
                            </h3>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {c.desc}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export { Hero }
