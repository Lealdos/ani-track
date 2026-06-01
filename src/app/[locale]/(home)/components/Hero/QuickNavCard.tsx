import type { LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type QuickNavCardProps = {
    to: string
    icon: LucideIcon
    title: string
    desc: string
}

function QuickNavCard({ to, icon: Icon, title, desc }: QuickNavCardProps) {
    return (
        <Link
            href={to}
            className="shadow-soft transition-silk border-border/70 bg-card hover:border-primary/60 group relative min-w-80 overflow-hidden rounded-xl border p-5 backdrop-blur hover:-translate-y-0.5"
        >
            <div className="bg-gradient-sakura absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25" />
            <Icon className="text-primary h-5 w-5" />
            <h2 className="font-display mt-3 text-2xl">{title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{desc}</p>
        </Link>
    )
}

export { QuickNavCard }
