import type { NextConfig } from 'next'
import path from 'node:path'
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

export default nextConfig
