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
            <div className="relative flex w-full items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                    type="search"
                    placeholder="Search anime..."
                    className="h-10 w-full rounded-lg border border-border/50 bg-secondary/50 px-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <kbd className="absolute right-3 hidden sm:flex items-center gap-1 rounded border border-border/50 bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Enter
                </kbd>
            </div>
        </form>
    )
}
