/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: { styledComponents: true },
    assetPrefix: process.env.NODE_ENV === 'development' ? '' : undefined,
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(woff2)$/,
            type: 'asset/resource',
        });
        return config;
    },
};

export default nextConfig;
