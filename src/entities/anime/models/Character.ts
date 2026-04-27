type CharacterImage = {
    imageUrl: string
    smallImageUrl?: string
}

type CharacterImages = {
    jpg: CharacterImage
    webp?: CharacterImage
}

type Character = {
    id: number
    url: string
    images: CharacterImages
    name: string
}

type VoiceActorPerson = {
    id: number
    url: string
    images: { jpg: { imageUrl: string } }
    name: string
}

type VoiceActor = {
    person: VoiceActorPerson
    language: string
}

export type AnimeCharacter = {
    character: Character
    role: string
    voiceActors: VoiceActor[]
}
