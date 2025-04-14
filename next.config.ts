import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.myanimelist.net',
                port: '',
                pathname: '/images/anime/**/**',
            },
        ],
    },
}

export default nextConfig
