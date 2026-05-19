import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Props {
    eyebrow?: string
    title: string
    to?: string
    cta?: string
}

export function SectionHeader({ eyebrow, title, to, cta = 'View all' }: Props) {
    return (
        <div className="mx-6 mb-6 flex items-end justify-between gap-4">
            <div>
                {eyebrow && (
                    <p className="mb-1 text-xs tracking-[0.2em] text-primary/80 uppercase">
                        {eyebrow}
                    </p>
                )}
                <h2 className="font-display flex items-center gap-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    {title.split(' ').map((word, i) => (
                        <span
                            key={`${word}-${i}`}
                            className={`inline-block ${i % 2 === 0 ? 'text-gradient-sakura' : ''}`}
                        >
                            {word}
                        </span>
                    ))}
                </h2>
            </div>
            {to && (
                <Link
                    href={to}
                    className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                    {cta} <ArrowRight className="h-4 w-4" />
                </Link>
            )}
        </div>
    )
}
