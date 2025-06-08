/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@react95/core', '@react95/icons', 'styled-components'],
}

module.exports = nextConfig 