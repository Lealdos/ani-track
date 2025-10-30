/** @type {import('next').NextConfig} */
const nextConfig = {
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
