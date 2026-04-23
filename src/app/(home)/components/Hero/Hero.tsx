import { CalendarDays, Flame, Sparkles } from 'lucide-react'
import { PetalsOverlay } from './PetalsOverlay'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from '@/components/shared/SectionHeader/SectionHeader'

function Hero() {
    return (
        <section className="f-full relative -top-10 w-full">
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10" />
            <div className="relative flex h-screen w-full flex-col items-center justify-evenly rounded-lg p-4">
                <Image
                    src={'/hero-sakura.jpeg'}
                    alt="Lone figure under a cherry blossom tree above a glowing night city"
                    className="absolute inset-0 h-full w-full object-center opacity-40 md:object-cover"
                    width={2560}
                    height={1440}
                    loading="eager"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/50 to-background" />
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

                <div className="container flex flex-col items-center-safe justify-between gap-4 md:mt-40 md:flex-row md:justify-start">
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
                            className="group shadow-soft transition-silk relative min-w-80 overflow-hidden rounded-xl border border-border/70 bg-card p-5 backdrop-blur hover:-translate-y-0.5 hover:border-primary/60"
                        >
                            <div className="bg-gradient-sakura absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25" />
                            <c.icon className="h-5 w-5 text-primary" />
                            <h3 className="font-display mt-3 text-2xl">
                                {c.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
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
