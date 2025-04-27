'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface UsePaginationProps {
  currentPage: number
  lastPage?: number
  hasNextPage?: boolean
}

export function usePagination({ currentPage, lastPage, hasNextPage }: UsePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || (lastPage && page > lastPage)) return
      const query = createQueryString('page', page.toString())
      router.push(`?${query}`)
    },
    [createQueryString, lastPage, router]
  )

  const nextPage = useCallback(() => {
    if (lastPage && currentPage >= lastPage) return
    if (!hasNextPage) return
    goToPage(currentPage + 1)
  }, [currentPage, goToPage, hasNextPage, lastPage])

  const previousPage = useCallback(() => {
    if (currentPage <= 1) return
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  return {
    nextPage,
    previousPage,
    goToPage,
    canGoNext: hasNextPage && (!lastPage || currentPage < lastPage),
    canGoPrevious: currentPage > 1
  }
}