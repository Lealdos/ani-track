import type { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'

export type FavoriteAnime = Pick<JikanAnime, 'mal_id' | 'title'> &
    Partial<
        Pick<
            JikanAnime,
            'title_english' | 'images' | 'score' | 'type' | 'episodes' | 'year'
        >
    >
