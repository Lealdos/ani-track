import { CalendarDays, Flame, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PetalsOverlay } from './PetalsOverlay'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { SectionHeader } from '@/components/shared/SectionHeader/SectionHeader'

function Hero() {
    const t = useTranslations('Hero')
    return (
        <section className="f-full relative -top-10 w-full">
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10" />
            <div className="relative flex h-screen w-full flex-col items-center justify-evenly rounded-lg p-4">
                <Image
                    src={'/hero-sakura.webp'}
                    alt="Lone figure under a cherry blossom tree above a glowing night city"
                    className="absolute inset-0 h-full w-full object-center opacity-40 md:object-cover"
                    width={2560}
                    height={1440}
                    loading="eager"
                    priority
                />
                <div className="bg-linear-to-b from-background/10 via-background/50 to-background absolute inset-0" />
                <div className="bg-gradient-glow absolute inset-0 opacity-80" />
                <PetalsOverlay count={22} />

                <div className="container relative flex min-h-[40vh] flex-col items-start justify-end pb-16 pt-24 md:pb-24">
                    <SectionHeader title={t('welcome')} />

                    <h1 className="font-display mt-3 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                        {t.rich('tagline', {
                            season: (chunks) => (
                                <span className="text-gradient-sakura">
                                    {chunks}
                                </span>
                            ),
                        })}
                    </h1>
                </div>
                {/* QUICK NAV */}

                <div className="items-center-safe container flex flex-col flex-wrap justify-between gap-4 md:mt-40 md:flex-row md:justify-start">
                    {[
                        {
                            to: '#season',
                            icon: Sparkles,
                            title: t('thisSeason'),
                            desc: t('thisSeasonDesc'),
                        },
                        {
                            to: '#schedule',
                            icon: CalendarDays,
                            title: t('airingNow'),
                            desc: t('airingNowDesc'),
                        },
                        {
                            to: '#global-top',
                            icon: Flame,
                            title: t('topRanked'),
                            desc: t('topRankedDesc'),
                        },
                    ].map((c) => (
                        <Link
                            key={c.to}
                            href={c.to}
                            className="shadow-soft transition-silk border-border/70 bg-card hover:border-primary/60 group relative min-w-80 overflow-hidden rounded-xl border p-5 backdrop-blur hover:-translate-y-0.5"
                        >
                            <div className="bg-gradient-sakura absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25" />
                            <c.icon className="text-primary h-5 w-5" />
                            <h2 className="font-display mt-3 text-2xl">
                                {c.title}
                            </h2>
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
