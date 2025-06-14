/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@reown/appkit', '@reown/appkit-adapter-wagmi', '@react95/core', '@react95/icons', 'styled-components', 'three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
}

module.exports = nextConfig; 