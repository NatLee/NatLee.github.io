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

test('why and architecture are bilingual, and each diagram is well formed', () => {
  const overlays = read('content/i18n/projects.zh.json')
  // 節點種類只接受合約裡寫的那幾種（lib/content/contract.ts 的 ArchitectureKind）。
  const contract = fs.readFileSync(path.join(root, 'lib/content/contract.ts'), 'utf8')
  const kinds = [...contract.match(/^export type ArchitectureKind = (.+)$/m)[1].matchAll(/'([a-z]+)'/g)].map(match => match[1])
  // 只寫在英文的欄位：中文照順序疊上去，不能自己另外標。
  const englishOnly = ['core', 'kind', 'id', 'to']
  for (const project of projects) {
    const zh = overlays[project.id] ?? {}
    if (project.why) assert.ok(zh.why, `${project.id}: why needs a Chinese version`)
    if (zh.why) assert.ok(project.why, `${project.id}: Chinese why without an English one`)
    const steps = project.architecture
    if (!steps) {
      assert.ok(!zh.architecture, `${project.id}: Chinese architecture without an English one`)
      continue
    }
    const where = (index, node) => `${project.id}: layer ${index + 1}${node ? ` node ${node}` : ''}`
    const checkNode = (node, label) => {
      assert.ok(node.title, `${label} needs a title`)
      assert.ok(Array.isArray(node.items) && node.items.length <= 3, `${label} lists 0–3 items`)
      if (node.kind) assert.ok(kinds.includes(node.kind), `${label}: kind must be one of ${kinds.join(', ')}`)
    }
    // 作品頁橫排最多放五層；少於兩層就不是流程了。每層最多三個並排的節點。
    assert.ok(steps.length >= 2 && steps.length <= 5, `${project.id}: architecture needs 2–5 layers`)
    const idsOf = step => (step.nodes ? step.nodes.map(node => node.id) : [step.id].filter(Boolean))
    let cores = 0
    steps.forEach((step, index) => {
      const last = index === steps.length - 1
      assert.ok(!(last && step.next), `${where(index)}: the last layer has no arrow`)
      if (step.core) cores++
      const nodes = step.nodes ?? [step]
      if (step.nodes) {
        assert.ok(step.nodes.length >= 2 && step.nodes.length <= 3, `${where(index)}: a layer with nodes has 2–3 of them`)
        assert.ok(step.title, `${where(index)}: a layer with nodes needs a caption (title)`)
        assert.equal(new Set(idsOf(step)).size, step.nodes.length, `${where(index)}: node ids must be unique`)
        assert.ok(!step.kind && !step.to && !step.id && !step.items.length, `${where(index)}: with nodes, put kind/to/id/items on the nodes`)
      }
      nodes.forEach((node, i) => {
        if (step.nodes && node.core) cores++
        checkNode(node, where(index, step.nodes ? i + 1 : undefined))
        if (node.to) {
          assert.ok(!last, `${where(index)}: the last layer cannot point anywhere`)
          const nextIds = idsOf(steps[index + 1])
          for (const id of node.to) assert.ok(nextIds.includes(id), `${where(index)}: to "${id}" is not an id in the next layer`)
        }
      })
    })
    assert.equal(cores, 1, `${project.id}: exactly one node or layer is the project itself (core)`)

    assert.ok(Array.isArray(zh.architecture), `${project.id}: architecture needs a Chinese version`)
    assert.equal(zh.architecture.length, steps.length, `${project.id}: Chinese architecture must have the same layers`)
    zh.architecture.forEach((step, index) => {
      const en = steps[index]
      assert.ok(step.title, `${where(index)}: Chinese title missing`)
      assert.equal(Boolean(step.next), Boolean(en.next), `${where(index)}: arrow label must exist in both languages`)
      assert.equal(step.nodes?.length ?? 0, en.nodes?.length ?? 0, `${where(index)}: Chinese must have the same nodes`)
      for (const node of [step, ...(step.nodes ?? [])]) {
        for (const key of englishOnly) assert.ok(!(key in node), `${where(index)}: write ${key} only in English`)
      }
      ;(step.nodes ?? []).forEach((node, i) => assert.ok(node.title, `${where(index, i + 1)}: Chinese title missing`))
    })
  }
})

test('gains, lessons and flow charts are bilingual and well formed', () => {
  const overlays = read('content/i18n/projects.zh.json')
  // 步驟種類只接受合約裡 FlowStep 寫的那幾種。
  const contract = fs.readFileSync(path.join(root, 'lib/content/contract.ts'), 'utf8')
  const flowKinds = [...contract.match(/^ {2}kind\?: ('start'.+)$/m)[1].matchAll(/'([a-z]+)'/g)].map(match => match[1])
  for (const project of projects) {
    const zh = overlays[project.id] ?? {}
    assert.equal(Boolean(project.gains), Boolean(zh.gains), `${project.id}: gains needs both languages`)
    if (project.lessons || zh.lessons) {
      assert.ok(Array.isArray(project.lessons) && project.lessons.length >= 1 && project.lessons.length <= 3, `${project.id}: lessons has 1–3 items`)
      assert.equal(zh.lessons?.length, project.lessons.length, `${project.id}: Chinese lessons must have the same items`)
    }
    const steps = project.flow
    if (!steps) {
      assert.ok(!zh.flow, `${project.id}: Chinese flow without an English one`)
      continue
    }
    const ids = steps.map(step => step.id)
    const where = index => `${project.id}: flow step ${index + 1}`
    // 圖用 dagre 排，可以分岔、匯合、往回走；太長要捲很久，所以最多 16 步，每一步最多連出 3 條線。
    assert.ok(steps.length >= 3 && steps.length <= 16, `${project.id}: flow needs 3–16 steps`)
    assert.equal(new Set(ids).size, ids.length, `${project.id}: flow step ids must be unique`)
    steps.forEach((step, index) => {
      assert.ok(step.id && step.label, `${where(index)} needs an id and a label`)
      if (step.kind) assert.ok(flowKinds.includes(step.kind), `${where(index)}: kind must be one of ${flowKinds.join(', ')}`)
      const out = [...(step.to ?? []), ...(step.branch ? [{ id: step.branch.to, label: step.branch.when }] : [])]
      for (const link of out) assert.ok(ids.includes(link.id) && link.id !== step.id, `${where(index)}: goes to an unknown step or itself (${link.id})`)
      assert.ok(out.length + (step.to ? 0 : 1) <= 3, `${where(index)}: at most three ways out`)
      if (step.kind === 'decision') {
        // 判斷至少兩條路，每條都要寫條件（新格式寫在 to，舊格式是「branch 加上接下一步」）。
        const ways = step.to ? step.to : [{ label: step.next }, { label: step.branch?.when }]
        assert.ok(ways.length >= 2 && ways.every(link => link.label), `${where(index)}: a decision needs two or more labelled ways out`)
      } else {
        assert.ok(!step.branch, `${where(index)}: only decisions branch`)
      }
      assert.ok(!(index === steps.length - 1 && step.next), `${where(index)}: the last flow step has no arrow`)
    })
    assert.ok(Array.isArray(zh.flow) && zh.flow.length === steps.length, `${project.id}: Chinese flow must have the same steps`)
    const groupZh = new Map()
    zh.flow.forEach((step, index) => {
      const en = steps[index]
      assert.ok(step.label, `${where(index)}: Chinese label missing`)
      for (const key of ['id', 'kind']) assert.ok(!(key in step), `${project.id}: write ${key} only in English`)
      assert.ok(!step.branch?.to, `${project.id}: write branch.to only in English`)
      assert.ok(!(step.to ?? []).some(link => 'id' in link), `${project.id}: write the ids in to only in English`)
      assert.equal(Boolean(step.next), Boolean(en.next), `${where(index)}: arrow label must exist in both languages`)
      assert.equal(Boolean(step.branch?.when), Boolean(en.branch), `${where(index)}: branch condition must exist in both languages`)
      assert.equal(step.to?.length ?? 0, en.to?.length ?? 0, `${where(index)}: Chinese must have the same ways out`)
      ;(en.to ?? []).forEach((link, i) => assert.equal(Boolean(step.to?.[i]?.label), Boolean(link.label), `${where(index)}: way ${i + 1} label must exist in both languages`))
      assert.equal(Boolean(step.group), Boolean(en.group), `${where(index)}: group must exist in both languages`)
      if (en.group) {
        // 同一個英文分組在中文也要是同一個名字，不然會畫成兩個框。
        if (!groupZh.has(en.group)) groupZh.set(en.group, step.group)
        assert.equal(step.group, groupZh.get(en.group), `${where(index)}: group "${en.group}" has two Chinese names`)
      }
    })
  }
})

test('image captions line up with the images, and Tapi has remarks in both languages', () => {
  const overlays = read('content/i18n/projects.zh.json')
  for (const project of projects) {
    const zh = overlays[project.id] ?? {}
    if (!project.imageCaptions) {
      assert.ok(!zh.imageCaptions, `${project.id}: Chinese captions without English ones`)
      continue
    }
    assert.equal(project.imageCaptions.length, project.images.length, `${project.id}: one caption per image (the cover may be empty)`)
    assert.equal(zh.imageCaptions?.length, project.images.length, `${project.id}: Chinese captions must line up with the images`)
    project.imageCaptions.forEach((caption, i) => assert.equal(Boolean(caption), Boolean(zh.imageCaptions[i]), `${project.id}: caption ${i + 1} must exist in both languages`))
  }
  // 作品頁上的 Tapi 不提通道（使用者 2026-11-18：通道是 Telepy 自己的頁面才講的事），通用台詞和作品自己的台詞都檢查。
  const tunnel = /tunnel|通道|隧道|reverse ssh/i
  const mascots = read('content/mascots.json')
  for (const [id, mascot] of Object.entries(mascots)) {
    if (id === '$schema' || !mascot.remarks) continue
    for (const [section, set] of Object.entries(mascot.remarks)) {
      assert.ok(set.en?.length && set.en.length === set.zh?.length, `${id}.remarks.${section}: same number of lines in both languages`)
      for (const line of [...set.en, ...set.zh]) assert.ok(!tunnel.test(line), `${id}.remarks.${section}: "${line}" talks about tunnels`)
    }
  }
  for (const project of projects) {
    const zh = overlays[project.id] ?? {}
    if (!project.mascotLines) {
      assert.ok(!zh.mascotLines, `${project.id}: Chinese Tapi lines without English ones`)
      continue
    }
    assert.ok(project.mascotLines.length >= 1 && project.mascotLines.length <= 3, `${project.id}: 1–3 Tapi lines`)
    assert.equal(zh.mascotLines?.length, project.mascotLines.length, `${project.id}: same number of Tapi lines in both languages`)
    for (const line of [...project.mascotLines, ...zh.mascotLines]) assert.ok(!tunnel.test(line), `${project.id}: Tapi line "${line}" talks about tunnels`)
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
