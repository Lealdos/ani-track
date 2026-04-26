'use client'
import { FavoriteProvider } from '@/context/favoriteContext'
import { WatchStatusProvider } from '@/hooks/useWatchStatus'
import { AnimeListsProvider } from '@/hooks/useAnimeLists'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <FavoriteProvider>
            <WatchStatusProvider>
                <AnimeListsProvider>{children}</AnimeListsProvider>
            </WatchStatusProvider>
        </FavoriteProvider>
    )
}
