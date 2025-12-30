import type { NextConfig } from 'next'
const path = require('path')
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
    turbopack: {
        root: path.join(__dirname, './'),
    },
}

export default nextConfig
