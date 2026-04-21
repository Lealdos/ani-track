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
        <div className="mb-6 flex items-end justify-between gap-4">
            <div>
                {eyebrow && (
                    <p className="text-primary/80 mb-1 text-xs tracking-[0.2em] uppercase">
                        {eyebrow}
                    </p>
                )}
                <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                    {title}
                </h2>
            </div>
            {to && (
                <Link
                    href={to}
                    className="text-muted-foreground hover:text-primary inline-flex shrink-0 items-center gap-1 text-sm transition-colors"
                >
                    {cta} <ArrowRight className="h-4 w-4" />
                </Link>
            )}
        </div>
    )
}
