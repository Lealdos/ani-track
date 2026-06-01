import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    // All locales supported by the app
    locales: ['en', 'es'],

    // Used when no locale matches
    defaultLocale: 'en',
    localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
