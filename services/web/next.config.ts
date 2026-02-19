import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    turbopack: {
        root: '../..',
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

