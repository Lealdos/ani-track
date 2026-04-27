import type { Anime } from '@/entities/anime/models'

export type AnimeType = 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music'

export type multipleLanguagesTitles = {
    type: 'Japanese' | 'English' | 'Spanish' | 'French' | 'German'

    title: string
}

export type broadcastInfo = {
    day:
        | 'Mondays'
        | 'Tuesdays'
        | 'Wednesdays'
        | 'Thursdays'
        | 'Fridays'
        | 'Saturdays'
        | 'Sundays'
    time: string
    timezone: string
    string: string
}

export type streaming = {
    name: string
    url: string
}

export type ListsAnimes = Pick<Anime, 'id' | 'title' | 'images'>
