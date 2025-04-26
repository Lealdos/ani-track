'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useSearchParams } from 'next/navigation'

interface PaginationProps {
    currentPage: number
    nextPage?: boolean
    lastPage?: number
}

export function Pagination(paginationProps: PaginationProps) {
    const { currentPage, nextPage, lastPage } = paginationProps
    const router = useRouter()
    const [searchParams, setSearchParams] = useSearchParams()
    const havePrevPage = currentPage > 1

    return (
        <div className="mt-4 flex flex-row items-center justify-between">
            <button className="rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium hover:bg-purple-900/90">
                {currentPage > 1 ? '←' : ''} Previous page
            </button>
            <span className="text-sm font-medium">
                {currentPage} of {lastPage}
            </span>
            <button className="rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium hover:bg-purple-900/90">
                Next page {nextPage ? '→' : ''}
            </button>
        </div>
    )
}
