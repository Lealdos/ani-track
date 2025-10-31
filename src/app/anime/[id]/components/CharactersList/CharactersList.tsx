import { CharacterDataItem } from '@/types/animeCharacter'

export function CharactersList({
    characters,
}: {
    characters: CharacterDataItem[]
}): React.ReactElement {
    return (
        <div className="grid grid-cols-1 items-center-safe justify-center gap-6 align-middle md:grid-cols-2 lg:grid-cols-3">
            {characters?.map((character) => (
                <article
                    className="flex flex-row items-center justify-center gap-4 rounded-lg bg-red-500 p-4"
                    key={character.character.mal_id}
                >
                    {/* Character Info */}
                    <div className="flex flex-row items-center justify-end-safe">
                        <img
                            src={character.character.images.jpg.image_url}
                            alt={character.character.name}
                            className="h-26 w-26 rounded object-scale-down"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <h3>{character.character.name}</h3>
                            <small>{character.role}</small>
                        </div>
                    </div>
                    {/* Voice Actor Info */}
                    <div className="flex flex-row items-center justify-end-safe">
                        <div className="flex flex-col items-center gap-4">
                            <h4>{character.voice_actors[0]?.person.name}</h4>
                            <small>{character.voice_actors[0]?.language}</small>
                        </div>
                        <img
                            src={
                                character.voice_actors[0]?.person.images.jpg
                                    .image_url
                            }
                            alt={character.character.name}
                            className="h-26 w-26 rounded object-scale-down"
                        />
                    </div>
                </article>
            ))}
        </div>
    )
}
