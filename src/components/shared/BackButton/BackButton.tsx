'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BackButton() {
    const router = useRouter()
    return (
        <div className="absolute top-4 left-4 z-10">
            <button
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/90 transition-colors"
                aria-label="Go back"
                onClick={() => router.back()}
            >
                <span className="sr-only">Go back</span>
                <ArrowLeft className="size-5" />
            </button>
        </div>
    )
}
