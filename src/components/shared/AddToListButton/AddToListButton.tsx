'use client'

import { useState } from 'react'
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
import type { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { useAnimeLists } from '@/hooks/useAnimeLists'

type UserList = { id: string; name: string; itemCount?: number }

interface AddToListButtonProps {
    anime: JikanAnime
}

const ANIME_TO_PAYLOAD = (anime: JikanAnime) => ({
    animeId: String(anime.mal_id),
    title: anime.title,
    picture:
        anime.images?.webp?.image_url ||
        anime.images?.jpg?.large_image_url ||
        anime.images?.jpg?.image_url ||
        '',
})

export function AddToListButton({ anime }: AddToListButtonProps) {
    const [newName, setNewName] = useState('')
    const { lists, createList, addToList } = useAnimeLists()

    const handleAddToNew = () => {
        const created = createList(newName)
        if (created) {
            addToList(created.id, anime)
            toast.success(`Added to "${created.name}"`)
            setNewName('')
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="text-base">
                    <ListPlus className="mr-2 h-4 w-4" /> Add to list
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="text-base">
                    Your lists
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {lists.length === 0 ? (
                    <div className="px-2 py-1.5 text-base text-muted-foreground">
                        No lists yet.
                    </div>
                ) : (
                    lists.map((l) => {
                        const has = l.items.some(
                            (i) => i.mal_id === anime.mal_id
                        )
                        return (
                            <DropdownMenuItem
                                key={l.id}
                                onClick={() => {
                                    if (!has) {
                                        addToList(l.id, anime)
                                        toast.success(`Added to "${l.name}"`)
                                    }
                                }}
                                disabled={has}
                                className="text-base"
                            >
                                {l.name}
                                {has && (
                                    <Check className="ml-auto h-4 w-4 text-primary" />
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
                        placeholder="New list…"
                        className="h-8"
                    />
                    <Button
                        size="sm"
                        onClick={handleAddToNew}
                        disabled={!newName.trim()}
                    >
                        Add
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
