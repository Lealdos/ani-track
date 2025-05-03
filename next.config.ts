import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://cdn.myanimelist.net/images/**')],
        domains: ['cdn.myanimelist.net'],
    },
    experimental: {
        viewTransition: true,
    },
}

export default nextConfig
