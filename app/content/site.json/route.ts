// 在 build 時輸出 /content/site.json（靜態檔）。英靈殿的主題在瀏覽器裡讀它，所以內容一改，
// 只要主站照常部署一次，所有主題都會顯示新內容，不必各自重 build。格式：lib/content/contract.ts
import { buildSiteBundle } from '@/data/bundle'

export const dynamic = 'force-static'

export function GET() {
  return new Response(JSON.stringify(buildSiteBundle()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
