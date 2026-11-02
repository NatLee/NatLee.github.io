/** @type {import('next').NextConfig} */

// Valhalla theme: served from /valhalla/flat/ and reads its content at runtime from /content/site.json.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/valhalla/flat',
  assetPrefix: '/valhalla/flat/',
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
