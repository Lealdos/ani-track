'use client'
import { Heart, HeartOff } from 'lucide-react'
import type { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { useFavorites } from '@/context/favoriteContext'

interface AddToListButtonProps {
    anime: JikanAnime
}

export function AddToListButton({ anime }: AddToListButtonProps) {
    const { isInFavorites, addToFavorites, removeFromFavorites } =
        useFavorites()

    const isFavorite = isInFavorites(anime.mal_id)

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                if (isFavorite) {
                    console.log('remove from favorites')
                    removeFromFavorites(anime.mal_id)
                } else {
                    console.log('add to favorites')
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
                    <span className="sr-only">Add to Favorites</span>
                </>
            ) : (
                <>
                    <Heart
                        className={`size-6 ${isFavorite ? 'fill-red-600' : 'hover:fill-red-600'}`}
                    />
                    <span className="sr-only">Remove from Favorites</span>
                </>
            )}
        </button>
    )
}
