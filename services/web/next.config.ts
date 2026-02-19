import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    bundler: 'webpack',
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

