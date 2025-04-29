'use client'

interface PaginationProps {
    current_Page: number
    has_next_page?: boolean
    last_visible_page?: number
}

export function Pagination(paginationProps: PaginationProps) {
    const { current_Page, has_next_page, last_visible_page } = paginationProps

    return (
        <div className="mt-4 flex flex-row items-center justify-between">
            <button className="rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium hover:bg-purple-900/90">
                {current_Page > 1 ? '←' : ''} Previous page
            </button>
            <span className="text-sm font-medium">
                {current_Page} of {last_visible_page}
            </span>
            <button
                className="rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium hover:bg-purple-900/90"
                disabled={!has_next_page}
            >
                Next page {has_next_page ? '→' : ''}
            </button>
        </div>
    )
}
