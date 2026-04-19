'use client'
import { Heart } from 'lucide-react'
import type { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { useFavorites } from '@/context/favoriteContext'
import { cn } from '@/lib/utils'

interface AddToListButtonProps {
    anime: JikanAnime
    className?: string
}

export function AddFavoritesButton({ anime, className }: AddToListButtonProps) {
    const { isInFavorites, addToFavorites, removeFromFavorites } =
        useFavorites()

    const isFavorite = isInFavorites(anime.mal_id)

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (isFavorite) {
                    removeFromFavorites(anime.mal_id)
                } else {
                    addToFavorites(anime)
                }
            }}
            className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                isFavorite 
                    ? 'bg-accent/20 text-accent hover:bg-accent/30' 
                    : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-accent hover:bg-background/90',
                className
            )}
            aria-label={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
            <Heart
                className={cn(
                    'size-4 transition-all',
                    isFavorite && 'fill-accent'
                )}
            />
        </button>
    )
}
