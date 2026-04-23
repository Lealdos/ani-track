'use client'
import { useState, useEffect } from 'react'

type Petal = {
    i: number
    left: number
    delay: number
    duration: number
    size: number
    drift: string
    opacity: number
}

/**
 * Decorative falling petals overlay.
 * Honors prefers-reduced-motion via the media query in index.css.
 * Petals are generated client-side only to avoid SSR/hydration mismatch.
 */
export function PetalsOverlay({ count = 18 }: { count?: number }) {
    const [petals, setPetals] = useState<Petal[]>([])

    useEffect(() => {
        setPetals(
            Array.from({ length: count }).map((_, i) => ({
                i,
                left: Math.random() * 100,
                delay: Math.random() * 12,
                duration: 10 + Math.random() * 10,
                size: 10 + Math.random() * 14,
                drift: (Math.random() * 20 - 10).toFixed(1),
                opacity: 0.5 + Math.random() * 0.4,
            }))
        )
    }, [count])

    return (
        <div
            aria-hidden="true"
            className="petals-overlay pointer-events-none absolute inset-0 overflow-hidden"
        >
            {petals.map((p) => (
                <span
                    key={p.i}
                    className="petal"
                    style={{
                        left: `${p.left}%`,
                        width: `${p.size}px`,
                        height: `${p.size * 0.85}px`,
                        opacity: p.opacity,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        ['--drift' as never]: `${p.drift}vw`,
                    }}
                />
            ))}
        </div>
    )
}
