/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['pg', 'typeorm']
    },
}

module.exports = nextConfig
