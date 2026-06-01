import type { NextConfig } from 'next'
import path from 'node:path'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    cacheComponents: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.myanimelist.net',
                pathname: '/images/**',
            },
        ],
    },
    experimental: {
        viewTransition: true,
    },
}

export default withNextIntl(nextConfig)
