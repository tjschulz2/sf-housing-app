const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      include: path.resolve(__dirname, "src/images"),
      use: ['@svgr/webpack'],
    });

    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ['pbs.twimg.com'],
  },
}

module.exports = nextConfig;
