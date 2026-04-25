import { useState } from 'react'
import { Tv, Clock, CheckCircle2, X, ListPlus, Check } from 'lucide-react'
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
import { useWatchStatus, WatchStatus } from '@/hooks/useWatchStatus'
import { useAnimeLists } from '@/hooks/useAnimeLists'
import { FavoriteAnime } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_OPTIONS: { value: WatchStatus; label: string; Icon: typeof Tv }[] =
    [
        { value: 'watching', label: 'Watching', Icon: Tv },
        { value: 'plan_to_watch', label: 'Plan to Watch', Icon: Clock },
        { value: 'completed', label: 'Completed', Icon: CheckCircle2 },
    ]

interface Props {
    anime: FavoriteAnime
}

export function WatchStatusActions({ anime }: Props) {
    const { getStatus, setStatus, clearStatus } = useWatchStatus()
    const { lists, createList, addToList } = useAnimeLists()
    const current = getStatus(anime.mal_id)
    const [newName, setNewName] = useState('')

    const currentLabel =
        STATUS_OPTIONS.find((o) => o.value === current)?.label ?? 'Set status'

    const handleSet = (s: WatchStatus) => {
        setStatus(anime, s)
        toast.success(
            `Marked as ${STATUS_OPTIONS.find((o) => o.value === s)?.label}`
        )
    }

    const handleAddToNew = () => {
        const created = createList(newName)
        if (created) {
            addToList(created.id, anime)
            toast.success(`Added to "${created.name}"`)
            setNewName('')
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={current ? 'default' : 'secondary'}
                        size="sm"
                    >
                        {current ? (
                            <Check className="mr-2 h-4 w-4" />
                        ) : (
                            <Tv className="mr-2 h-4 w-4" />
                        )}
                        {currentLabel}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Watch status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {STATUS_OPTIONS.map((o) => (
                        <DropdownMenuItem
                            key={o.value}
                            onClick={() => handleSet(o.value)}
                            className={cn(
                                current === o.value && 'text-primary'
                            )}
                        >
                            <o.Icon className="mr-2 h-4 w-4" />
                            {o.label}
                            {current === o.value && (
                                <Check className="ml-auto h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                    {current && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    clearStatus(anime.mal_id)
                                    toast.success('Status removed')
                                }}
                                className="text-destructive focus:text-destructive"
                            >
                                <X className="mr-2 h-4 w-4" /> Remove status
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">
                        <ListPlus className="mr-2 h-4 w-4" /> Add to list
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>Your lists</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {lists.length === 0 ? (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">
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
                                            toast.success(
                                                `Added to "${l.name}"`
                                            )
                                        }
                                    }}
                                    disabled={has}
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
        </div>
    )
}
