#!/usr/bin/env node
// 抓各 repo 的 GitHub 星數，寫進 content/github.json。
// 部署流程在 build 前執行（有 GITHUB_TOKEN 就帶上）；網路或 API 出問題時保留原本的快照，不讓部署失敗。
//   node scripts/sync-github.mjs
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outFile = path.join(root, 'content/_generated/github.json')
const projectsDir = path.join(root, 'content/projects')

const repos = new Set()
for (const file of fs.readdirSync(projectsDir)) {
  const project = JSON.parse(fs.readFileSync(path.join(projectsDir, file), 'utf8'))
  const url = project.githubUrl || project.links?.github
  const match = url?.match(/github\.com\/([^/]+\/[^/#?]+)/i)
  if (match) repos.add(match[1].replace(/\.git$/, ''))
}
const opensource = JSON.parse(fs.readFileSync(path.join(root, 'content/opensource.json'), 'utf8'))
for (const pkg of opensource.packages) repos.add(pkg.repo)

const previous = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : { repos: {} }
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'natlee-portfolio-sync',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

const next = { generatedAt: new Date().toISOString(), repos: {} }
const failed = []
let fetched = 0
for (const repo of [...repos].sort((a, b) => a.localeCompare(b))) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    next.repos[repo] = { stars: data.stargazers_count, pushedAt: data.pushed_at?.slice(0, 10) }
    fetched++
  } catch (err) {
    failed.push(`${repo} (${err.message})`)
    if (previous.repos?.[repo]) next.repos[repo] = previous.repos[repo]
  }
}

if (fetched === 0) {
  console.warn(`sync-github: nothing fetched, keeping the existing snapshot. ${failed.slice(0, 3).join(', ')}`)
  process.exit(0)
}

fs.writeFileSync(outFile, JSON.stringify(next, null, 2) + '\n')
console.log(`sync-github: ${fetched}/${repos.size} repos updated`)
if (failed.length) console.log(`  kept previous values for: ${failed.join(', ')}`)
