'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BackButton() {
    const router = useRouter()
    return (
        <div className="absolute top-6 left-6">
            <button
                className="rounded-full border-gray-700 bg-black/50 p-2 md:p-2"
                aria-label="Go back"
                onClick={() => router.back()}
            >
                <span className="sr-only">Go back</span>
                <ArrowLeft className="h-6 w-6" />
            </button>
        </div>
    )
}
