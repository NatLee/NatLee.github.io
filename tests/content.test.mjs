import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const files = fs.readdirSync(path.join(root, 'content/projects'))
const projects = files.map(file => read(`content/projects/${file}`))
const ids = new Set(projects.map(project => project.id))

test('every project has one registered, unique static page', () => {
  assert.equal(ids.size, projects.length)
  const registry = fs.readFileSync(path.join(root, 'data/projects-list.ts'), 'utf8')
  const imported = [...registry.matchAll(/@\/content\/projects\/([^']+)\.json/g)].map(match => match[1])
  assert.deepEqual(new Set(imported), ids)
  assert.equal(imported.length, projects.length)
  for (const file of files) assert.equal(read(`content/projects/${file}`).id, file.replace(/\.json$/, ''))
})

test('every local project image and thumbnail is shipped with the site', () => {
  const thumbnails = read('content/_generated/thumbnails.json')
  for (const project of projects) {
    for (const src of [...(project.images ?? []), thumbnails[project.id]].filter(Boolean)) {
      if (src.startsWith('/')) assert.ok(fs.existsSync(path.join(root, 'public', src)), `${project.id}: missing ${src}`)
    }
  }
})

test('every playground card points to a real project with an HTTPS demo', () => {
  const playground = read('content/playground.json')
  assert.equal(new Set(playground.projects).size, playground.projects.length)
  for (const id of playground.projects) {
    const project = projects.find(item => item.id === id)
    assert.ok(project, `Unknown playground project: ${id}`)
    assert.ok(project.links.demo.startsWith('https://'), `Missing demo: ${id}`)
  }
})

function messageKeys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, item]) => typeof item === 'string' ? [`${prefix}${key}`] : messageKeys(item, `${prefix}${key}.`)).sort()
}

test('English and Traditional Chinese expose the same interface strings', () => {
  assert.deepEqual(messageKeys(read('messages/en.json')), messageKeys(read('messages/zh-TW.json')))
  const overlays = read('content/i18n/projects.zh.json')
  for (const project of projects) assert.ok(overlays[project.id]?.description, `Missing Chinese description: ${project.id}`)
})
