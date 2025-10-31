interface Image {
    image_url: string
    small_image_url?: string // small_image_url is optional as it might not be present in all image types
}

interface CharacterImages {
    jpg: Image
    webp?: Image // webp is optional
}

export interface Character {
    mal_id: number
    url: string
    images: CharacterImages
    name: string
}

interface Person {
    mal_id: number
    url: string
    images: {
        jpg: {
            image_url: string
        }
    }
    name: string
}

interface VoiceActor {
    person: Person
    language: string
}

export type JikanCharacterDataItem = {
    character: Character
    role: string
    voice_actors: VoiceActor[]
}

export type CharacterApiResponse = {
    data: JikanCharacterDataItem[]
}
