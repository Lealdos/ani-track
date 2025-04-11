'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Search } from 'lucide-react';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className='relative w-full max-w-md'>
            <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <input
                    type='search'
                    placeholder='Search anime...'
                    className='w-full bg-background h-auto p-3 pl-10 text-sm text-black rounded-lg'
                    value={query}
                    onChange={(e: {
                        target: { value: React.SetStateAction<string> };
                    }) => setQuery(e.target.value)}
                />
                <button
                    type='submit'
                    className='absolute right-0 top-0 h-full px-3 text-sm'
                >
                    <span className='sr-only'>Search</span>
                    <Search className='h-4 w-4' />
                </button>
            </div>
        </form>
    );
}
