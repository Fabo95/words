import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    turbopack: {
        resolveAlias: {
            '@app': path.resolve(__dirname, 'src'),
        },
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

