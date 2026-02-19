import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    turbopack: {
        resolveAlias: {
            '@app/*': './src/*',
        },
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

