/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@reown/appkit', '@reown/appkit-adapter-wagmi', '@react95/core', '@react95/icons', 'styled-components', 'three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config, { isServer, dev }) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    
    // WebWorkerファイルの処理を改善
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // WebWorkerファイルを無視
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /HeartbeatWorker/,
      })
    );

    // Terserで問題のあるファイルを除外し、設定を調整
    if (!dev && config.optimization && config.optimization.minimizer) {
      config.optimization.minimizer = config.optimization.minimizer.map((plugin) => {
        if (plugin.constructor.name === 'TerserPlugin') {
          return {
            ...plugin,
            options: {
              ...plugin.options,
              exclude: /HeartbeatWorker/,
              terserOptions: {
                parse: {
                  ecma: 2020,
                },
                compress: {
                  drop_console: false,
                  drop_debugger: false,
                  ecma: 2020,
                },
                mangle: {
                  safari10: true,
                },
                format: {
                  ecma: 2020,
                  safari10: true,
                },
              },
              extractComments: false,
            },
          };
        }
        return plugin;
      });
    }

    return config;
  },
}

module.exports = nextConfig; 