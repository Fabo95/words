/** @type {import('next').NextConfig} */
const nextConfig = {
    // We are using biome instead.
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
