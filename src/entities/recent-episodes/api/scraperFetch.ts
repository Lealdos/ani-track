import { createAppError } from '@/lib/utils/errors'

const BROWSER_USER_AGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

/**
 * Fetches a JSON document from a scraped site. Upstream failures are turned
 * into 502 AppErrors so `handleError` reports them as a bad gateway.
 */
export async function scraperFetch<T>(url: string): Promise<T> {
    let response: Response
    try {
        response = await fetch(url, {
            headers: {
                'User-Agent': BROWSER_USER_AGENT,
                Accept: 'application/json, text/html;q=0.9, */*;q=0.8',
            },
            signal: AbortSignal.timeout(10_000),
        })
    } catch (error) {
        throw createAppError(
            `Upstream request failed: ${url} (${(error as Error).message})`,
            { statusCode: 502, code: 'UPSTREAM_ERROR' }
        )
    }

    if (!response.ok) {
        throw createAppError(
            `Upstream error: ${url} responded ${response.status} ${response.statusText}`,
            { statusCode: 502, code: 'UPSTREAM_ERROR' }
        )
    }

    try {
        return (await response.json()) as T
    } catch {
        throw createAppError(`Upstream returned invalid JSON: ${url}`, {
            statusCode: 502,
            code: 'UPSTREAM_PARSE_ERROR',
        })
    }
}
