import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from '@/lib/prisma'
import { nextCookies } from 'better-auth/next-js'

type SocialProviders = NonNullable<
    Parameters<typeof betterAuth>[0]['socialProviders']
>

// A provider registered with undefined credentials still resolves, then throws
// a bare 500 when building the authorization URL. Register it only when its
// credentials are actually present so a misconfigured deploy fails loudly here
// and returns an honest PROVIDER_NOT_FOUND instead.
function buildSocialProviders(): SocialProviders {
    const providers: SocialProviders = {}

    const googleId = process.env.GOOGLE_CLIENT_ID
    const googleSecret = process.env.GOOGLE_CLIENT_SECRET

    if (googleId && googleSecret) {
        providers.google = { clientId: googleId, clientSecret: googleSecret }
    } else {
        const missing = [
            !googleId && 'GOOGLE_CLIENT_ID',
            !googleSecret && 'GOOGLE_CLIENT_SECRET',
        ].filter(Boolean)
        console.error(
            `[auth] Google sign-in disabled — missing env var(s): ${missing.join(', ')}. ` +
                `Set them in the deployment environment and redeploy.`
        )
    }
    return providers
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {
            // Send an email to the user with a link to reset their password
        },
    },
    socialProviders: buildSocialProviders(),
    user: {
        additionalFields: {
            userName: {
                type: 'string',
                required: true,
            },
        },
    },
    plugins: [nextCookies()],
})
