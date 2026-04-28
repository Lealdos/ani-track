'use client'
import { Heart, HeartOff } from 'lucide-react'
import type { Anime } from '@/entities/anime/models'
import { useFavorites } from '@/context/favoriteContext'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { Button } from '@components/ui/button'

interface AddToListButtonProps {
    anime: Anime
}

export function AddFavoritesButton({ anime }: AddToListButtonProps) {
    const { isInFavorites, addToFavorites, removeFromFavorites } =
        useFavorites()
    const { requireAuth } = useRequireAuth()

    const isFavorite = isInFavorites(anime.id)

    return (
        <Button
            onClick={(e) => {
                e.preventDefault()
                requireAuth(() => {
                    if (isFavorite) {
                        removeFromFavorites(anime.id)
                    } else {
                        addToFavorites(anime)
                    }
                })
            }}
            variant="secondary"
            size="sm"
            className="bg-black/80 text-red-500 hover:bg-black/70"
            aria-label={
                isFavorite ? 'Remove from Favorites' : 'Add to Favorites'
            }
        >
            {isFavorite ? (
                <>
                    <HeartOff
                        className={`size-6 md:size-7 ${isFavorite && 'fill-red-500 hover:fill-transparent'}`}
                    />
                    <span className="sr-only">Remove from Favorites</span>
                </>
            ) : (
                <>
                    <Heart
                        className={`size-6 md:size-7 ${isFavorite ? 'fill-red-600' : 'hover:fill-red-600'}`}
                    />
                    <span className="sr-only">Add to Favorites</span>
                </>
            )}
        </Button>
    )
}
