/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig

import type { NextConfig } from 'next'
