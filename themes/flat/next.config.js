/** @type {import('next').NextConfig} */

// Valhalla theme: served from /valhalla/flat/ and reads its content at runtime from /content/site.json.
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,
  // 主題沒有 ESLint 設定，也不再安裝 ESLint；build 時略過 lint。
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: true,
  basePath: '/valhalla/flat',
  assetPrefix: '/valhalla/flat/',
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
