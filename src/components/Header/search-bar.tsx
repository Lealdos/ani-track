'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Search } from 'lucide-react'

export function SearchBar() {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(query)
        if (!query) {
            return router.push('/animes')
        }
        if (query.trim()) {
            router.push(`/animes/browse?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <form onSubmit={handleSearch}>
            <div className="relative">
                <input
                    type="search"
                    placeholder="Search anime..."
                    className="h-auto w-full rounded-lg border border-t-red-700 border-r-red-700 border-b-red-500 border-l-red-500 p-3 pl-10 text-sm text-black"
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
