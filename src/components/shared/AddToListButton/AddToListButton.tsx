'use client'

import { useEffect, useMemo, useState } from 'react'
import { PlusCircle, ListPlus, Loader2, Check } from 'lucide-react'
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'

type UserList = { id: string; name: string; itemCount?: number }

interface AddToListButtonProps {
    anime: JikanAnime
    className?: string
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

export function AddToListButton({ anime, className }: AddToListButtonProps) {
    const [lists, setLists] = useState<UserList[]>([])
    const [open, setOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [listName, setListName] = useState('')
    const [isLoadingLists, setIsLoadingLists] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [addingListId, setAddingListId] = useState<string | null>(null)

    const payload = useMemo(() => ANIME_TO_PAYLOAD(anime), [anime])

    useEffect(() => {
        if (!open || lists.length) return
        void fetchLists()
    }, [open])

    const fetchLists = async () => {
        try {
            setIsLoadingLists(true)
            const res = await fetch('/api/_users-lists', {
                credentials: 'include',
            })
            if (!res.ok) throw new Error('Failed to load lists')
            const data = (await res.json()) as {
                success?: boolean
                data?: UserList[]
            }
            setLists(data.data || [])
        } catch (error) {
            console.error(error)
            toast.error('Could not load your lists')
        } finally {
            setIsLoadingLists(false)
        }
    }

    const handleAdd = async (listId: string) => {
        try {
            setAddingListId(listId)
            const res = await fetch(`/api/_users-lists/${listId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error('Failed to add to list')
            toast.success('Added to list')
        } catch (error) {
            console.error(error)
            toast.error('Could not add to list')
        } finally {
            setAddingListId(null)
        }
    }

    const handleCreate = async () => {
        if (!listName.trim()) {
            toast.error('Please enter a list name')
            return
        }
        try {
            setIsCreating(true)
            const res = await fetch('/api/_users-lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: listName.trim() }),
            })
            if (!res.ok) throw new Error('Failed to create list')
            const data = (await res.json()) as { data: UserList }
            setLists((prev) => [data.data, ...prev])
            setDialogOpen(false)
            setListName('')
            // Optionally add immediately to the new list
            await handleAdd(data.data.id)
        } catch (error) {
            console.error(error)
            toast.error('Could not create list')
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            'gap-2 bg-slate-900/70 text-white hover:bg-slate-800',
                            className
                        )}
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add to list
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Your lists</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isLoadingLists && (
                        <DropdownMenuItem disabled className="gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading…
                        </DropdownMenuItem>
                    )}
                    {!isLoadingLists && lists.length === 0 && (
                        <DropdownMenuItem disabled>
                            No lists yet
                        </DropdownMenuItem>
                    )}
                    {lists.map((list) => (
                        <DropdownMenuItem
                            key={list.id}
                            className="gap-2"
                            disabled={addingListId === list.id}
                            onSelect={(e) => {
                                e.preventDefault()
                                void handleAdd(list.id)
                            }}
                        >
                            {addingListId === list.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4 opacity-0 data-[state=checked]:opacity-100" />
                            )}
                            <span>{list.name}</span>
                            {typeof list.itemCount === 'number' && (
                                <span className="ml-auto text-xs text-slate-400">
                                    {list.itemCount}
                                </span>
                            )}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="gap-2 text-cyan-300"
                        onSelect={(e) => {
                            e.preventDefault()
                            setDialogOpen(true)
                        }}
                    >
                        <ListPlus className="h-4 w-4" />
                        Create new list
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new list</DialogTitle>
                    <DialogDescription>
                        Give your list a name to start tracking anime.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <Input
                        placeholder="e.g. Fall 2026 watchlist"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setDialogOpen(false)
                                setListName('')
                            }}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={isCreating}
                            type="button"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                    Creating…
                                </>
                            ) : (
                                'Create list'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
