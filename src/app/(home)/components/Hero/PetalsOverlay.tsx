'use client'
import { useMemo } from 'react'

/**
 * Decorative falling petals overlay.
 * Honors prefers-reduced-motion via the media query in index.css.
 */
export function PetalsOverlay({ count = 18 }: { count?: number }) {
    const petals = useMemo(
        () =>
            Array.from({ length: count }).map((_, i) => {
                const left = Math.random() * 100
                const delay = Math.random() * 12
                const duration = 10 + Math.random() * 10
                const size = 10 + Math.random() * 14
                const drift = (Math.random() * 20 - 10).toFixed(1)
                const opacity = 0.5 + Math.random() * 0.4
                return { i, left, delay, duration, size, drift, opacity }
            }),
        [count]
    )

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
