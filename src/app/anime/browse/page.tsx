import { SearchBar } from '@/components/search-bar'
import { SearchResults } from '@/components/search-results'
import { Suspense } from 'react'

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>
}) {
    const { q } = await searchParams
    return (
        <main className="container mx-auto min-h-screen w-full px-4 py-8">
            <div className="mb-8 md:hidden">
                <SearchBar />
            </div>
            {q ? (
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                        </div>
                    }
                >
                    <SearchResults query={q} />
                </Suspense>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">
                        Search for anime
                    </h3>
                    <p className="text-sm text-gray-600">
                        Enter a search term to find anime titles.
                    </p>
                </div>
            )}
        </main>
    )
}
