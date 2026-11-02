/** @type {import('next').NextConfig} */
// Stonk theme: served from /valhalla/stonk/ and reads /content/site.json at runtime.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/valhalla/stonk',
  assetPrefix: '/valhalla/stonk/',
}

module.exports = nextConfig
