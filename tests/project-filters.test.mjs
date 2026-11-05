import assert from 'node:assert/strict'
import test from 'node:test'
import { readProjectFilters, projectFilterSearch } from '../lib/project-filters.ts'

const themes = ['energy', 'infra', 'ai', 'libraries', 'web']

test('shared URLs preserve the demo filter, theme and non-Latin search text', () => {
  const filters = { theme: 'web', query: '臺灣 + 地圖', demoOnly: true }
  assert.deepEqual(readProjectFilters(projectFilterSearch(filters), themes), filters)
})

test('a link to all live demos does not require a search or theme', () => {
  assert.deepEqual(readProjectFilters('?demo=1', themes), { theme: 'all', query: '', demoOnly: true })
})

test('unknown themes and non-boolean demo parameters do not hide results', () => {
  assert.deepEqual(readProjectFilters('?theme=unknown&demo=false', themes), { theme: 'all', query: '', demoOnly: false })
})

test('clearing filters removes their URL parameters', () => {
  assert.equal(projectFilterSearch({ theme: 'all', query: '  ', demoOnly: false }), '')
})
