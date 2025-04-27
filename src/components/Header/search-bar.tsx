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
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-200" />
                <input
                    type="search"
                    placeholder="Search animes..."
                    className="h-10 w-full rounded-lg border border-t-red-700 border-r-red-700 border-b-red-500 border-l-red-500 bg-black/40 p-2 pr-12 pl-10 text-sm text-white placeholder:text-gray-400"
                    value={query}
                    onChange={(e: {
                        target: { value: React.SetStateAction<string> }
                    }) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute top-1/2 right-1 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-400 hover:text-white"
                >
                    <span className="sr-only">Search</span>
                    Enter
                </button>
            </div>
        </form>
    )
}
