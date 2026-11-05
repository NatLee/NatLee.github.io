/** URL state shared by the project index and its regression tests. */
export function readProjectFilters(search: string, themes: readonly string[]) {
  const params = new URLSearchParams(search)
  const requestedTheme = params.get('theme')
  return {
    theme: requestedTheme && themes.includes(requestedTheme) ? requestedTheme : 'all',
    query: params.get('q') ?? '',
    demoOnly: params.get('demo') === '1',
  }
}

export function projectFilterSearch(filters: { theme: string; query: string; demoOnly: boolean }) {
  const params = new URLSearchParams()
  if (filters.theme !== 'all') params.set('theme', filters.theme)
  if (filters.query.trim()) params.set('q', filters.query.trim())
  if (filters.demoOnly) params.set('demo', '1')
  const search = params.toString()
  return search ? `?${search}` : ''
}
