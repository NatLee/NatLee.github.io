/** @type {import('next').NextConfig} */
// Stonk theme: served from /valhalla/stonk/ and reads /content/site.json at runtime.
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,
  // 主題沒有 ESLint 設定，也不再安裝 ESLint；build 時略過 lint。
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/valhalla/stonk',
  assetPrefix: '/valhalla/stonk/',
}

module.exports = nextConfig
