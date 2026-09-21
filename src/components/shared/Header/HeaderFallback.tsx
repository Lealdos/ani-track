import { Menu, Search } from 'lucide-react'

import * as styles from './headerClasses'

// Stands in for <Header/> while its Suspense boundary is pending. It paints the
// same bar at the same size, minus anything that needs translations or client
// state (the real header's `useTranslations` is the uncached read that forces
// the boundary in the first place). Without this the header area renders blank
// for a beat and then pops in, which reads as the header fading in on load.
export function HeaderFallback() {
    return (
        <>
            <div
                aria-hidden="true"
                className={`${styles.wrapperBase} ${styles.wrapperAtTop}`}
            >
                <div className={`${styles.barBase} ${styles.barAtTop}`}>
                    <div className={styles.barInner}>
                        <div className="flex items-center gap-8">
                            <span className={styles.logo}>ANI TRACK</span>
                        </div>

                        <div className="mx-1 max-w-3xl flex-1">
                            <div className={styles.searchWrap}>
                                <Search className={styles.searchIcon} />
                                <div className={styles.searchField} />
                            </div>
                        </div>

                        <div className="flex items-center justify-center rounded-md">
                            <Menu className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>
            <div aria-hidden="true" className={styles.spacer} />
        </>
    )
}
