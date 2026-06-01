import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

// next-intl handles locale detection, the `[locale]` prefix and redirects.
// Auth is enforced per page/route (see the account layout and `useRequireAuth`),
// which is the approach recommended by Better-auth over middleware checks.
export const proxy = createMiddleware(routing)

export const config = {
    // Match all pathnames except for
    // - API routes (`/api`, including the Better-auth handlers)
    // - Next.js internals (`/_next`, `/_vercel`)
    // - Files with an extension (e.g. `favicon.ico`, images)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
