import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
    eyebrow?: string
    title: string
    to?: string
    cta?: string
}

export function SectionHeader({ eyebrow, title, to, cta }: Props) {
    const t = useTranslations('SectionHeader')
    const resolvedCta = cta ?? t('viewAll')
    return (
        <div className="mx-6 mb-6 flex items-end justify-between gap-4">
            <div>
                {eyebrow && (
                    <p className="text-primary/80 mb-1 text-xs uppercase tracking-[0.2em]">
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
                    className="text-muted-foreground hover:text-primary inline-flex shrink-0 items-center gap-1 text-sm transition-colors"
                >
                    {resolvedCta} <ArrowRight className="h-4 w-4" />
                </Link>
            )}
        </div>
    )
}
