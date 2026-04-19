// Numbered pagination component for easy navigation
'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { FC } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface NumberedPaginationProps {
    currentPage: number
    lastPage: number
    hasNextPage?: boolean
    onPageChange?: (page: number) => void
}

// Helper to generate page numbers with ellipsis
function getPageNumbers(
    currentPageNum: number,
    totalPages: number,
    maxPagesToShow: number = 7
): (number | '...')[] {
    const pages: (number | '...')[] = []
    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
        return pages
    }
    pages.push(1)
    if (currentPageNum > 4) pages.push('...')
    for (
        let i = Math.max(2, currentPageNum - 1);
        i <= Math.min(totalPages - 1, currentPageNum + 1);
        i++
    ) {
        pages.push(i)
    }
    if (currentPageNum < totalPages - 3) pages.push('...')
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

    const maxPagesToShow = 7
    const pageNumbers = getPageNumbers(currentPage, lastPage, maxPagesToShow)

    return (
        <nav className="flex items-center justify-center gap-1 select-none">
            <button
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage <= 1 
                        ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                        : 'bg-card border border-border/50 text-foreground hover:bg-secondary'
                }`}
                disabled={currentPage <= 1}
                onClick={() => handlePageClick(currentPage - 1)}
                aria-label="Previous page"
            >
                <ChevronLeft className="size-4" />
            </button>
            
            <div className="flex items-center gap-1">
                {pageNumbers.map((pageNum, pageIndex) =>
                    typeof pageNum === 'number' ? (
                        <button
                            key={pageNum}
                            className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all ${
                                pageNum === currentPage 
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                                    : 'bg-card border border-border/50 text-foreground hover:bg-secondary'
                            }`}
                            onClick={() => handlePageClick(pageNum)}
                            aria-current={pageNum === currentPage ? 'page' : undefined}
                        >
                            {pageNum}
                        </button>
                    ) : (
                        <span
                            key={`ellipsis-${pageIndex}`}
                            className="flex items-center justify-center w-10 h-10 text-muted-foreground"
                        >
                            ...
                        </span>
                    )
                )}
            </div>
            
            <button
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    !hasNextPage || currentPage >= lastPage 
                        ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                        : 'bg-card border border-border/50 text-foreground hover:bg-secondary'
                }`}
                disabled={!hasNextPage || currentPage >= lastPage}
                onClick={() => handlePageClick(currentPage + 1)}
                aria-label="Next page"
            >
                <ChevronRight className="size-4" />
            </button>
        </nav>
    )
}
