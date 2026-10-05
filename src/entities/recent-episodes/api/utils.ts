// Scraping is slow, so keep results for 5 minutes and serve stale up to 1 hour.
export const RECENT_EPISODES_CACHE_LIFE = {
    stale: 300,
    revalidate: 300,
    expire: 3600,
}
