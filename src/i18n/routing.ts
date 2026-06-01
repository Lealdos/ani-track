import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    // All locales supported by the app
    locales: ['en', 'es'],

    // Used when no locale matches
    defaultLocale: 'en',
})

export type Locale = (typeof routing.locales)[number]
