#!/usr/bin/env node
// 產生作品卡片用的本地縮圖：每個專案的 images[0] → public/images/projects/<id>.webp
// （寬 960、GIF 只取第一格），並更新 content/thumbnails.json。
// 卡片不再直接載入 2–4 MB 的 GIF；詳細頁仍然顯示原圖。
//   node scripts/make-thumbs.mjs           只補缺的
//   node scripts/make-thumbs.mjs --force   全部重做
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const projectsDir = path.join(root, 'content/projects')
const outDir = path.join(root, 'public/images/projects')
const manifestFile = path.join(root, 'content/_generated/thumbnails.json')
const force = process.argv.includes('--force')

fs.mkdirSync(outDir, { recursive: true })
const manifest = {}
const failed = []
let made = 0

for (const file of fs.readdirSync(projectsDir).sort()) {
  const project = JSON.parse(fs.readFileSync(path.join(projectsDir, file), 'utf8'))
  const source = project.images?.[0]
  if (!source) continue
  const target = path.join(outDir, `${project.id}.webp`)
  const publicPath = `/images/projects/${project.id}.webp`
  if (fs.existsSync(target) && !force) {
    manifest[project.id] = publicPath
    continue
  }
  try {
    const res = await fetch(source, { redirect: 'follow' })
    if (!res.ok) throw new Error(String(res.status))
    const input = Buffer.from(await res.arrayBuffer())
    await sharp(input, { animated: false })
      .resize({ width: 960, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(target)
    manifest[project.id] = publicPath
    made++
  } catch (err) {
    failed.push(`${project.id}: ${source} (${err.message})`)
  }
}

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n')
console.log(`make-thumbs: ${made} new, ${Object.keys(manifest).length} total`)
if (failed.length) console.log(`  failed:\n  ${failed.join('\n  ')}`)
