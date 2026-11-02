#!/usr/bin/env node
// 本機預覽英靈殿主題，不必 build 主站：以 public/ 為網站根目錄，/content/site.json 取自
// out/content/site.json（主站 build 過的話）或 themes/_shared/site.sample.json。
// Preview Valhalla themes without building the main site.
//   node scripts/valhalla/serve-local.mjs [port=8800]   → http://localhost:8800/valhalla/<name>/
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '../..')
const port = Number(process.argv[2] ?? 8800)
const publicDir = path.join(root, 'public')
const bundleCandidates = [path.join(root, 'out', 'content', 'site.json'), path.join(root, 'themes', '_shared', 'site.sample.json')]
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
    let file
    if (urlPath === '/content/site.json') file = bundleCandidates.find((f) => fs.existsSync(f))
    else {
      file = path.join(publicDir, urlPath)
      if (!file.startsWith(publicDir)) file = undefined
      else if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
      else if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`
    }
    if (!file || !fs.existsSync(file)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end(`404 ${urlPath}`)
      return
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  .listen(port, () => console.log(`serving public/ on http://localhost:${port}  (bundle: ${bundleCandidates.find((f) => fs.existsSync(f)) ?? 'missing'})`))
