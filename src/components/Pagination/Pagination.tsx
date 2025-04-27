'use client'

import { usePagination } from '@/hooks/usePagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  lastPage?: number
  hasNextPage?: boolean
  className?: string
}

export function Pagination({ currentPage, lastPage, hasNextPage, className }: PaginationProps) {
  const { nextPage, previousPage, goToPage, canGoNext, canGoPrevious } = usePagination({
    currentPage,
    lastPage,
    hasNextPage,
  })

  const renderPageNumbers = () => {
    if (!lastPage) return null
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (lastPage <= maxPagesToShow) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i)
        pages.push('...')
        pages.push(lastPage)
      } else if (currentPage >= lastPage - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = lastPage - 2; i <= lastPage; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(lastPage)
      }
    }

    return pages.map((page, index) => (
      <button
        key={index}
        onClick={() => (typeof page === 'number' ? goToPage(page) : undefined)}
        className={cn(
          'h-8 w-8 rounded-md text-sm',
          typeof page === 'number'
            ? page === currentPage
              ? 'bg-purple-900 font-semibold text-white'
              : 'text-gray-300 hover:bg-purple-900/50'
            : 'cursor-default text-gray-400'
        )}
        disabled={typeof page !== 'number'}
      >
        {page}
      </button>
    ))
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <button
        onClick={previousPage}
        disabled={!canGoPrevious}
        className={cn(
          'flex h-8 items-center justify-center rounded-md px-2 text-sm',
          canGoPrevious
            ? 'text-gray-300 hover:bg-purple-900/50'
            : 'cursor-not-allowed text-gray-600'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </button>

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      <button
        onClick={nextPage}
        disabled={!canGoNext}
        className={cn(
          'flex h-8 items-center justify-center rounded-md px-2 text-sm',
          canGoNext
            ? 'text-gray-300 hover:bg-purple-900/50'
            : 'cursor-not-allowed text-gray-600'
        )}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </button>
    </div>
  )
}
