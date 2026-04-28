import type { Anime } from '@/entities/anime/models'

export type FavoriteAnime = Pick<Anime, 'id' | 'title'> &
    Partial<
        Pick<
            Anime,
            'titleEnglish' | 'images' | 'score' | 'type' | 'episodes' | 'year'
        >
    >
