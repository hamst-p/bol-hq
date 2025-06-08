/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: { styledComponents: true },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(woff2)$/,
            type: 'asset/resource',
        });
        return config;
    },
};

export default nextConfig;
