'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ListPlus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Input } from '@/components/ui/input'
import type { Anime } from '@/entities/anime/models'
import { useAnimeLists } from '@/hooks/useAnimeLists'
import { useRequireAuth } from '@/hooks/useRequireAuth'

type UserList = { id: string; name: string; itemCount?: number }

interface AddToListButtonProps {
    anime: Anime
    showLabel?: boolean
}

const ANIME_TO_PAYLOAD = (anime: Anime) => ({
    animeId: String(anime.id),
    title: anime.title,
    picture:
        anime.images?.webp?.imageUrl ||
        anime.images?.jpg?.largeImageUrl ||
        anime.images?.jpg?.imageUrl ||
        '',
})

export function AddToListButton({
    anime,
    showLabel = false,
}: AddToListButtonProps) {
    const t = useTranslations('AddToList')
    const [newName, setNewName] = useState('')
    const { lists, createList, addToList } = useAnimeLists()
    const { requireAuth } = useRequireAuth()

    const handleAddToNew = () => {
        requireAuth(() => {
            const created = createList(newName)
            if (created) {
                addToList(created.id, anime)
                toast.success(t('addedTo', { name: created.name }))
                setNewName('')
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="secondary"
                    size="sm"
                    className={`text-base ${showLabel ? 'bg-violet-900' : 'bg-black/80 text-white hover:bg-black/70'}`}
                >
                    <ListPlus
                        className={`size-6 md:size-7 ${showLabel ? 'mr-2' : ''}`}
                    />
                    <span className={showLabel ? '' : 'sr-only'}>
                        {t('addToList')}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={`${showLabel ? 'start' : 'end'}`}
                className="w-64"
            >
                <DropdownMenuLabel className="text-base">
                    {t('yourLists')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {lists.length === 0 ? (
                    <div className="text-muted-foreground px-2 py-1.5 text-base">
                        {t('noListsYet')}
                    </div>
                ) : (
                    lists.map((l) => {
                        const has = l.items.some((i) => i.id === anime.id)
                        return (
                            <DropdownMenuItem
                                key={l.id}
                                onClick={() => {
                                    if (!has) {
                                        requireAuth(() => {
                                            addToList(l.id, anime)
                                            toast.success(
                                                t('addedTo', { name: l.name })
                                            )
                                        })
                                    }
                                }}
                                disabled={has}
                                className="text-base"
                            >
                                {l.name}
                                {has && (
                                    <Check className="text-primary ml-auto h-4 w-4" />
                                )}
                            </DropdownMenuItem>
                        )
                    })
                )}
                <DropdownMenuSeparator />
                <div className="flex gap-1 p-2">
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddToNew()
                            }
                        }}
                        placeholder={t('newListPlaceholder')}
                        className="h-8"
                    />
                    <Button
                        size="sm"
                        onClick={handleAddToNew}
                        disabled={!newName.trim()}
                    >
                        {t('add')}
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
