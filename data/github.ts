// GitHub 星數快照：scripts/sync-github.mjs 在部署時更新 content/github.json，抓不到就沿用 repo 裡的版本。
import githubJson from '@/content/_generated/github.json'

export interface RepoStats {
  stars: number
  pushedAt?: string
}

interface GithubSnapshot {
  generatedAt: string
  repos: Record<string, RepoStats>
  /** 個人頁置頂的 repo（owner/name），照置頂順序。 */
  pinned?: string[]
}

const snapshot = githubJson as GithubSnapshot
const byLowerName = new Map(Object.entries(snapshot.repos).map(([name, stats]) => [name.toLowerCase(), stats]))

export function getRepoStats(repo: string): RepoStats | undefined {
  return byLowerName.get(repo.toLowerCase())
}

/** 個人頁置頂的 repo，照置頂順序；快照裡沒有就是空的。 */
export function getPinnedRepos(): string[] {
  return snapshot.pinned ?? []
}
