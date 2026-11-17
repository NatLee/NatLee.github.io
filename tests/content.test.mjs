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

test('every project belongs to listed categories, and old themes still get one of their five values', () => {
  const { themes } = read('content/project-themes.json')
  const known = new Map(themes.map(theme => [theme.id, theme]))
  assert.equal(known.size, themes.length, 'Category ids must be unique')
  // site.json 的舊欄位 theme 只接受合約裡寫的那幾種值，新分類的 legacyTheme 要是其中之一。
  const contract = fs.readFileSync(path.join(root, 'lib/content/contract.ts'), 'utf8')
  const legacy = [...contract.match(/^ {2}theme: (.+)$/m)[1].matchAll(/'([a-z]+)'/g)].map(match => match[1])
  const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8')
  for (const theme of themes) {
    assert.ok(theme.label?.en && theme.label?.zh, `Category ${theme.id} needs English and Chinese names`)
    assert.ok(legacy.includes(theme.legacyTheme), `Category ${theme.id}: legacyTheme must be one of ${legacy.join(', ')}`)
    assert.ok(['dot', 'ring'].includes(theme.marker), `Category ${theme.id}: marker must be dot or ring`)
    assert.ok(css.includes(`--${theme.color}:`), `Category ${theme.id}: colour token --${theme.color} is not in app/globals.css`)
    assert.ok(projects.some(project => project.themes?.includes(theme.id)), `Category ${theme.id} has no projects`)
  }
  const looks = themes.map(theme => `${theme.color}/${theme.marker}`)
  assert.equal(new Set(looks).size, looks.length, 'Two categories share the same colour and marker')
  for (const project of projects) {
    assert.ok(!('theme' in project), `${project.id}: write themes (a list), not theme`)
    assert.ok(Array.isArray(project.themes) && project.themes.length > 0, `${project.id}: needs at least one category`)
    assert.equal(new Set(project.themes).size, project.themes.length, `${project.id}: a category is listed twice`)
    for (const id of project.themes) assert.ok(known.has(id), `${project.id}: unknown category ${id}`)
  }
})

test('why and architecture are bilingual and the diagram has one core step', () => {
  const overlays = read('content/i18n/projects.zh.json')
  for (const project of projects) {
    const zh = overlays[project.id] ?? {}
    if (project.why) assert.ok(zh.why, `${project.id}: why needs a Chinese version`)
    if (zh.why) assert.ok(project.why, `${project.id}: Chinese why without an English one`)
    const steps = project.architecture
    if (!steps) {
      assert.ok(!zh.architecture, `${project.id}: Chinese architecture without an English one`)
      continue
    }
    // 作品頁橫排最多放五步；少於兩步就不是流程了。
    assert.ok(steps.length >= 2 && steps.length <= 5, `${project.id}: architecture needs 2–5 steps`)
    assert.equal(steps.filter(step => step.core).length, 1, `${project.id}: exactly one step is the project itself (core)`)
    steps.forEach((step, index) => {
      assert.ok(step.title, `${project.id}: step ${index + 1} needs a title`)
      assert.ok(Array.isArray(step.items) && step.items.length <= 3, `${project.id}: step ${index + 1} lists 0–3 items`)
      const last = index === steps.length - 1
      assert.ok(!(last && step.next), `${project.id}: the last step has no arrow`)
    })
    assert.ok(Array.isArray(zh.architecture), `${project.id}: architecture needs a Chinese version`)
    assert.equal(zh.architecture.length, steps.length, `${project.id}: Chinese architecture must have the same steps`)
    zh.architecture.forEach((step, index) => {
      assert.ok(step.title, `${project.id}: Chinese step ${index + 1} needs a title`)
      assert.ok(!('core' in step), `${project.id}: write core only in English`)
      assert.equal(Boolean(step.next), Boolean(steps[index].next), `${project.id}: step ${index + 1} arrow label must exist in both languages`)
    })
  }
})

test('every theme keeps an identical copy of the site.json contract', () => {
  const contract = fs.readFileSync(path.join(root, 'lib/content/contract.ts'), 'utf8')
  for (const copy of ['themes/flat/lib/site-contract.ts', 'themes/stonk/lib/site-contract.ts', 'themes/terminal/lib/site/contract.ts']) {
    assert.equal(fs.readFileSync(path.join(root, copy), 'utf8'), contract, `${copy} differs from lib/content/contract.ts`)
  }
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

test('every work chapter points to real roles, an existing era and real spin-offs', () => {
  const { chapters } = read('content/work.json')
  const roles = read('content/experience.json')
  const eras = new Set(read('content/personal.json').eras.map(era => era.period))
  assert.equal(new Set(chapters.map(chapter => chapter.id)).size, chapters.length)
  const claimed = new Map()
  for (const chapter of chapters) {
    assert.ok(eras.has(chapter.era), `${chapter.id}: era "${chapter.era}" is not in personal.json`)
    const chapterRoles = roles.filter(role => chapter.companyIds.includes(role.companyId))
    for (const companyId of chapter.companyIds) assert.ok(chapterRoles.some(role => role.companyId === companyId), `${chapter.id}: no role with companyId ${companyId}`)
    for (const role of chapterRoles) for (const name of [role.company, role.group].filter(Boolean)) claimed.set(name, chapter.id)
    const education = new Set(read('content/education.json').map(item => item.id))
    const sources = new Set((chapter.sources ?? []).map(source => source.id))
    for (const source of chapter.sources ?? []) {
      assert.ok(source.label?.en && source.label?.zh, `${chapter.id}: source ${source.id} needs a label in both languages`)
      if (source.educationId) assert.ok(education.has(source.educationId), `${chapter.id}: unknown education ${source.educationId}`)
    }
    const seen = []
    const placed = new Set()
    for (const spinoff of chapter.spinoffs) {
      assert.ok(ids.has(spinoff.id), `${chapter.id}: unknown spin-off ${spinoff.id}`)
      // 同一個 repo 可以屬於好幾個來源，但同一章同一個來源只能出現一次。
      const place = `${spinoff.id}@${spinoff.source ?? 'company'}`
      assert.ok(!placed.has(place), `${chapter.id}: ${spinoff.id} is listed twice under the same source`)
      placed.add(place)
      if (spinoff.source) assert.ok(sources.has(spinoff.source), `${chapter.id}: ${spinoff.id} names an unknown source ${spinoff.source}`)
      if (spinoff.from) assert.ok(seen.includes(spinoff.from), `${chapter.id}: ${spinoff.id} continues ${spinoff.from}, which must be listed before it`)
      assert.ok(spinoff.note?.en && spinoff.note?.zh, `${chapter.id}: ${spinoff.id} needs a note in both languages`)
      seen.push(spinoff.id)
    }
  }
  // 有 company 的作品都要落在某一章，否則它會從 /work 和徽章裡消失。
  for (const project of projects.filter(item => item.company)) assert.ok(claimed.has(project.company), `${project.id}: company "${project.company}" has no work chapter`)
})

function messageKeys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, item]) => typeof item === 'string' ? [`${prefix}${key}`] : messageKeys(item, `${prefix}${key}.`)).sort()
}

test('English and Traditional Chinese expose the same interface strings', () => {
  assert.deepEqual(messageKeys(read('messages/en.json')), messageKeys(read('messages/zh-TW.json')))
  const overlays = read('content/i18n/projects.zh.json')
  for (const project of projects) assert.ok(overlays[project.id]?.description, `Missing Chinese description: ${project.id}`)
})
