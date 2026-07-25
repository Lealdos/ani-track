import { AnimeCharacter } from '@/entities/anime/models'
import { useTranslations } from 'next-intl'

export function CharactersList({
    characters,
}: {
    characters: AnimeCharacter[]
}): React.ReactElement {
    const t = useTranslations('AnimeDetail')
    return (
        <div className="items-center-safe grid h-96 grid-cols-1 justify-center gap-2 overflow-y-auto p-2 md:grid-cols-2">
            {characters?.map((character) => (
                <article
                    className="m-1 flex flex-row items-center justify-center gap-4 text-balance rounded-lg border border-purple-950 p-2"
                    key={character.character.id}
                >
                    {/* Character Info */}
                    <div className="text-center-safe flex w-1/2 flex-row items-center justify-start gap-2 text-balance">
                        <img
                            src={
                                character.character.images.jpg.imageUrl ||
                                '/placeholder_avatar.png'
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
                                {character.voiceActors[0]?.person.name ??
                                    t('unknown')}
                            </h4>
                            <small>{character.voiceActors[0]?.language}</small>
                        </div>
                        <img
                            src={
                                character.voiceActors[0]?.person.images.jpg
                                    .imageUrl || '/placeholder_avatar.png'
                            }
                            alt={character.character.name}
                            className="h-26 max-h-26 w-26 max-w-26 rounded-2xl object-scale-down"
                        />
                    </div>
                </article>
            ))}
            {characters.length === 0 && (
                <p className="col-span-full text-center text-gray-400">
                    {t('noCharactersFound')}
                </p>
            )}
        </div>
    )
}
