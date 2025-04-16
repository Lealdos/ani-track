'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Search } from 'lucide-react'

export function SearchBar() {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div className="relative">
                <input
                    type="search"
                    placeholder="Search anime..."
                    className="bg-background h-auto w-full rounded-lg p-3 pl-10 text-sm text-black"
                    value={query}
                    onChange={(e: {
                        target: { value: React.SetStateAction<string> }
                    }) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute top-0 right-0 h-full px-3 text-sm"
                >
                    <span className="sr-only">Search</span>
                    <Search className="h-4 w-4" />
                </button>
            </div>
        </form>
    )
}
