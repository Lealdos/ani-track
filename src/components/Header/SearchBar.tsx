'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Search } from 'lucide-react'

export function SearchBar() {
    const [query, setQuery] = useState('')
    const { push } = useRouter()

    const handleSearch = (searchEvent: React.FormEvent) => {
        searchEvent.preventDefault()
        if (!query) {
            return push('/browse')
        }
        const cleanQuery = query.trim()
        push(`/browse?q=${encodeURIComponent(cleanQuery).trim()}`)
        setQuery('')
    }

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative flex w-full items-center justify-center">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-200" />
                <input
                    type="search"
                    placeholder="Search animes..."
                    className="h-10 w-full rounded-lg border border-t-red-700 border-r-red-700 border-b-red-500 border-l-red-500 bg-black/40 p-2 pr-10 pl-10 text-sm text-white placeholder:text-gray-400"
                    value={query}
                    onChange={(searchEvent: {
                        target: { value: React.SetStateAction<string> }
                    }) => setQuery(searchEvent.target.value)}
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
