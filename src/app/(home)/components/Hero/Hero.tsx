import { CalendarDays, Flame, Sparkles } from 'lucide-react'
import { PetalsOverlay } from './PetalsOverlay'
import Image from 'next/image'
import Link from 'next/link'

function Hero() {
    return (
        <div className="relative -top-20">
            <section className="relative mb-12 h-screen w-full overflow-hidden rounded-lg">
                <Image
                    src={'/hero-sakura.jpeg'}
                    alt="Lone figure under a cherry blossom tree above a glowing night city"
                    className="fade-edges absolute inset-0 h-full w-screen object-cover opacity-20"
                    width={2560}
                    height={1440}
                    priority
                />
                <div className="from-background/40 via-background/70 to-background absolute inset-0 bg-linear-to-b" />
                <div className="bg-gradient-glow absolute inset-0 opacity-80" />
                <PetalsOverlay count={22} />

                <div className="relative container flex min-h-[78vh] flex-col items-start justify-end pt-24 pb-16 md:pb-24">
                    <p className="text-primary text-xs tracking-[0.3em] uppercase">
                        Ani Track
                    </p>
                    <h1 className="font-display mt-3 max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight md:text-7xl">
                        Where every{' '}
                        <span className="text-gradient-sakura">season</span>{' '}
                        blooms a new story.
                    </h1>
                    <p className="text-muted-foreground mt-5 max-w-xl text-base md:text-lg">
                        Track the season's chart, see what's airing tonight,
                        follow the all-time greats and wander through every
                        genre — all in one moonlit place.
                    </p>
                </div>
                {/* QUICK NAV */}

                <div className="absolute container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            className="group border-border/70 bg-card/70 shadow-soft transition-silk hover:border-primary/60 relative overflow-hidden rounded-xl border p-5 backdrop-blur hover:-translate-y-0.5"
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
            </section>
        </div>
    )
}

export { Hero }
