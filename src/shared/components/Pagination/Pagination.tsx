'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'

interface PaginationProps {
    current_Page: number
    has_next_page?: boolean
    last_visible_page?: number
}

export function Pagination(paginationProps: PaginationProps) {
    const { current_Page, has_next_page, last_visible_page } = paginationProps

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { push } = useRouter()

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    const handlePageClick = (pageNumber: number) => {
        const newURL = createPageURL(pageNumber)
        return push(newURL)
    }

    return (
        <div className="mt-4 flex flex-row items-center justify-between">
            <button
                className={`rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium ${current_Page <= 1 ? 'opacity-50' : 'hover:bg-purple-900/90'}`}
                disabled={current_Page <= 1}
                onClick={() => handlePageClick(current_Page - 1)}
            >
                {current_Page >= 1 ? '←' : ''} Previous page
            </button>
            <span className="text-sm font-medium">
                {current_Page} of {last_visible_page}
            </span>
            <button
                className={`rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium ${!has_next_page ? 'opacity-50' : 'hover:bg-purple-900/90'}`}
                disabled={!has_next_page}
                onClick={() => handlePageClick(current_Page + 1)}
            >
                Next page {has_next_page ? '→' : ''}
            </button>
        </div>
    )
}
