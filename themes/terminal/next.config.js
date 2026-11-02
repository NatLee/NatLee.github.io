/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/valhalla/terminal',
  assetPrefix: '/valhalla/terminal/',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
