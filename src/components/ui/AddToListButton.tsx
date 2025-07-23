'use client'
import { Heart, HeartOff } from 'lucide-react'
import type { Anime } from '@/types/anime'
import { useFavoriteAnimes } from '@/hooks/useFetchUserFavoriteList'

interface AddToListButtonProps {
    anime: Anime
}

export function AddToListButton({ anime }: AddToListButtonProps) {
    const { isInFavorites, addToFavorites, removeFromFavorites } =
        useFavoriteAnimes()
    const isFavorite = isInFavorites(anime.mal_id)

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                if (isFavorite) {
                    removeFromFavorites(anime.mal_id)
                } else {
                    addToFavorites(anime)
                }
            }}
            className="rounded bg-black/50 p-1 text-red-500 hover:bg-black/70"
            aria-label={
                isFavorite ? 'Remove from Favorites' : 'Add to Favorites'
            }
        >
            {isFavorite ? (
                <>
                    <HeartOff
                        className={`size-6 ${isFavorite && 'fill-red-500 hover:fill-transparent'}`}
                    />
                    <span className="sr-only">
                        {isFavorite
                            ? 'Remove from Favorites'
                            : 'Add to Favorites'}
                    </span>
                </>
            ) : (
                <>
                    <Heart
                        className={`size-6 ${isFavorite ? 'fill-red-600' : 'hover:fill-red-600'}`}
                    />
                    <span className="sr-only">
                        {isFavorite
                            ? 'Remove from Favorites'
                            : 'Add to Favorites'}
                    </span>
                </>
            )}
        </button>
    )
}
