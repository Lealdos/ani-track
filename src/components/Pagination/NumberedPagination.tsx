// Numbered pagination component for easy navigation
'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { FC } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface NumberedPaginationProps {
    currentPage: number
    lastPage: number
    hasNextPage?: boolean
    onPageChange?: (page: number) => void
}

// Helper to generate page numbers with ellipsis
function getPageNumbers(
    currentPageNum: number,
    totalPages: number
): (number | string)[] {
    const pages: (number | string)[] = []
    if (totalPages <= 10) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
        return pages
    }
    pages.push(1)
    if (currentPageNum > 5) pages.push('...')
    for (
        let i = Math.max(2, currentPageNum - 2);
        i <= Math.min(totalPages - 1, currentPageNum + 2);
        i++
    ) {
        pages.push(i)
    }
    if (currentPageNum < totalPages - 4) pages.push('...')
    pages.push(totalPages)
    return pages
}

export const NumberedPagination: FC<NumberedPaginationProps> = ({
    currentPage,
    lastPage,
    hasNextPage,
    onPageChange,
}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { push } = useRouter()

    const handlePageClick = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) return
        if (onPageChange) onPageChange(page)
        else {
            const params = new URLSearchParams(searchParams)
            params.set('page', page.toString())
            push(`${pathname}?${params.toString()}`)
        }
    }

    const pageNumbers = getPageNumbers(currentPage, lastPage)

    return (
        <nav className="mt-4 flex flex-row items-center justify-center gap-2 select-none">
            <button
                className={`rounded-lg bg-purple-800 px-4 py-2 text-sm font-medium text-white transition-colors ${currentPage <= 1 ? 'opacity-50' : 'hover:bg-purple-900/90'}`}
                disabled={currentPage <= 1}
                onClick={() => handlePageClick(currentPage - 1)}
                aria-label="Previous page"
            >
                <ArrowLeft className="h-5 w-4" />
                <span className="sr-only">Previous page</span>
            </button>
            {pageNumbers.map((pageNumbers, pageIndex) =>
                typeof pageNumbers === 'number' ? (
                    <button
                        key={pageNumbers}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${pageNumbers === currentPage ? 'bg-purple-700 text-white' : 'bg-slate-600 text-white hover:bg-purple-500'}`}
                        onClick={() => handlePageClick(pageNumbers)}
                        aria-current={
                            pageNumbers === currentPage ? 'page' : undefined
                        }
                    >
                        {pageNumbers}
                    </button>
                ) : (
                    <span
                        key={`ellipsis-${pageIndex}`}
                        className="px-2 text-gray-400"
                    >
                        {pageNumbers}
                    </span>
                )
            )}
            <button
                className={`rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white transition-colors ${!hasNextPage || currentPage >= lastPage ? 'opacity-50' : 'hover:bg-purple-700/90'}`}
                disabled={!hasNextPage || currentPage >= lastPage}
                onClick={() => handlePageClick(currentPage + 1)}
                aria-label="Next page"
            >
                <ArrowRight className="h-5 w-4" />
                <span className="sr-only">Next page</span>
            </button>
        </nav>
    )
}
