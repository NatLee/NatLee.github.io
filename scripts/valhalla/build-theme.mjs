#!/usr/bin/env node
// 建置一個英靈殿主題：themes/<name>/ → public/valhalla/<name>/。
// Build one Valhalla theme from themes/<name>/ into public/valhalla/<name>/.
//
//   node scripts/valhalla/build-theme.mjs <name>
//
// 主題在瀏覽器裡讀 /content/site.json，所以「內容改了」不需要跑這支；只有主題的程式碼或樣式改了才需要。
// Themes read /content/site.json at runtime, so run this only when a theme's code changes, never for content.
//
// 步驟：必要時 npm ci → next build（basePath 必須是 /valhalla/<name>）→ 複製 out/ → 每個 HTML 注入 noindex 與返回膠囊。
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const name = process.argv[2]
if (!name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('usage: node scripts/valhalla/build-theme.mjs <name>')
  process.exit(1)
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '../..')
const src = path.join(root, 'themes', name)
const dest = path.join(root, 'public', 'valhalla', name)
const MARKER = 'data-valhalla'

if (!fs.existsSync(path.join(src, 'package.json'))) {
  console.error(`themes/${name}/package.json not found. Plain-HTML themes live directly in public/valhalla/${name}/ and need no build.`)
  process.exit(1)
}

const run = (cmd) => execSync(cmd, { cwd: src, stdio: 'inherit' })
if (!fs.existsSync(path.join(src, 'node_modules'))) run('npm ci --no-audit --no-fund')
run('npx next build')

const out = path.join(src, 'out')
fs.rmSync(dest, { recursive: true, force: true })
fs.cpSync(out, dest, { recursive: true })

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p, files)
    else files.push(p)
  }
  return files
}

const inject = `<meta name="robots" content="noindex" ${MARKER}="${name}"><script src="/valhalla/_banner.js" ${MARKER}="${name}" defer></script>`
const allowedRoots = ['/valhalla/', '/content/', '/mascots/', '/images/', '/favicon.svg', '/']
const stray = new Set()
let injected = 0
for (const file of walk(dest)) {
  if (!file.endsWith('.html')) continue
  let html = fs.readFileSync(file, 'utf8')
  if (!html.includes(MARKER)) {
    html = html.replace(/<\/head>/i, `${inject}</head>`)
    fs.writeFileSync(file, html)
    injected++
  }
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1]
    if (!url.startsWith(`/valhalla/${name}/`) && !allowedRoots.some((r) => (r === '/' ? url === '/' : url.startsWith(r)))) stray.add(url)
  }
}

const bytes = walk(dest).reduce((n, f) => n + fs.statSync(f).size, 0)
console.log(`\nbuilt theme ${name}: ${walk(dest).length} files, ${(bytes / 1048576).toFixed(1)} MB, banner injected into ${injected} page(s)`)
if (stray.size) console.log(`  warning: root-absolute paths outside /valhalla/${name}/: ${[...stray].slice(0, 10).join(', ')}`)
