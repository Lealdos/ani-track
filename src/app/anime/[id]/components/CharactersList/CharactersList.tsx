import { CharacterDataItem } from '@/types/animeCharacter'

export function CharactersList({
    characters,
}: {
    characters: CharacterDataItem[]
}): React.ReactElement {
    return (
        <div className="grid h-96 grid-cols-1 items-center-safe justify-center gap-2 overflow-y-auto p-2 md:grid-cols-2">
            {characters?.map((character) => (
                <article
                    className="m-1 flex flex-row items-center justify-center gap-4 rounded-lg border-1 border-purple-950 p-2 text-balance"
                    key={character.character.mal_id}
                >
                    {/* Character Info */}
                    <div className="text-center-safe flex w-1/2 flex-row items-center justify-start gap-2 text-balance">
                        <img
                            src={
                                character.character.images.jpg.image_url ||
                                '/images/placeholder_avatar.png'
                            }
                            alt={character.character.name}
                            className="h-26 max-h-26 w-26 max-w-26 rounded-2xl object-scale-down"
                        />
                        <div className="flex flex-col items-start gap-1 text-balance">
                            <h3>{character.character.name}</h3>
                            <small>{character.role}</small>
                        </div>
                    </div>
                    {/* Voice Actor Info */}
                    <div className="text-center-safe flex w-1/2 flex-row items-center justify-end gap-2 text-balance">
                        <div className="flex flex-col items-end gap-1 text-balance">
                            <h4 className="text-right">
                                {character.voice_actors[0]?.person.name ??
                                    'Unknown'}
                            </h4>
                            <small>{character.voice_actors[0]?.language}</small>
                        </div>
                        <img
                            src={
                                character.voice_actors[0]?.person.images.jpg
                                    .image_url || '/placeholder_avatar.png'
                            }
                            alt={character.character.name}
                            className="h-26 max-h-26 w-26 max-w-26 rounded-2xl object-scale-down"
                        />
                    </div>
                </article>
            ))}
            {characters.length === 0 && (
                <p className="col-span-full text-center text-gray-400">
                    No characters found.
                </p>
            )}
        </div>
    )
}
