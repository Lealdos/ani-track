export type AnimeType = 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music'

export type multipleLanguagesTitles = {
    type: 'Japanese' | 'English' | 'Spanish' | 'French' | 'German'

    title: string
}

export type broadcastInfo = {
    day:
        | 'Monday'
        | 'Tuesday'
        | 'Wednesday'
        | 'Thursday'
        | 'Friday'
        | 'Saturday'
        | 'Sunday'
    time: string
    timezone: string
    string: string
}

export type streaming = {
    name: string
    url: string
}
