// Redraws the PROFITKEY sitemap (from Sujin's Figma sitemap) as a clean tree diagram.
// Same pages and link types as the original: public (yellow), logged in (grey), external (dark).
// Output: public/images/screens/profitkey-sitemap.svg
import { writeFileSync } from 'node:fs'

const W = 1200
const H = 640
const C = { yellow: '#FFB400', yellowSoft: '#FFF3D1', ink: '#333333', grey: '#EDEDED', greyLine: '#C9C9C9', dark: '#333333', line: '#BDBDBD', soft: '#6E6E6E' }
const FONT = 'Inter, Arial, Helvetica, sans-serif'

const text = (x, y, s, size, weight, fill = C.ink, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${s.replace(/&/g, '&amp;')}</text>`

// one page card: title + its sub-items as chips; kind: public | auth | external
const card = (x, y, w, title, items, kind = 'public') => {
  const h = 46 + items.length * 30 + 8
  const head = kind === 'auth' ? C.grey : kind === 'external' ? C.dark : C.yellow
  const headText = kind === 'external' ? '#fff' : C.ink
  let s = `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="#E2E2E2"/>`
  s += `<path d="M${x} ${y + 12} a12 12 0 0 1 12 -12 h${w - 24} a12 12 0 0 1 12 12 v26 h-${w} z" fill="${head}"/>`
  s += text(x + 14, y + 25, title, 14, 700, headText)
  items.forEach((it, i) => {
    const iy = y + 48 + i * 30
    const chip = kind === 'auth' ? C.grey : kind === 'external' ? '#F1F1F1' : C.yellowSoft
    s += `<rect x="${x + 10}" y="${iy}" width="${w - 20}" height="24" rx="6" fill="${chip}"/>` + text(x + 20, iy + 16, it, 11.5, 500, C.ink)
  })
  return { svg: s + '</g>', h, x, y, w, cx: x + w / 2 }
}
// elbow connector from (x1,y1) down to (x2,y2)
const link = (x1, y1, x2, y2, dashed = false) => {
  const my = y1 + (y2 - y1) / 2
  return `<path d="M${x1} ${y1} V${my} H${x2} V${y2}" fill="none" stroke="${C.line}" stroke-width="1.5" ${dashed ? 'stroke-dasharray="5 4"' : ''}/>`
}

const home = card(420, 40, 360, 'Home', ['AI Stock Picks', 'Market Trends (Top Gainers etc.)', 'Stock Analysis', 'News', 'Notices / FAQ', 'Log in'])
const colY = home.y + home.h + 70
const colW = 250
const gap = (W - 80 - colW * 4) / 3
const cx = (i) => 40 + i * (colW + gap)

const stock = card(cx(0), colY, colW, 'Stock Analysis', ['Stock Details', 'AI Commentary', 'Community'])
const news = card(cx(1), colY, colW, 'News', ['Latest News', 'All News'])
const notices = card(cx(2), colY, colW, 'Notices / FAQ', ['Notices', 'FAQ'])
const login = card(cx(3), colY, colW, 'Log in', ['Social Login'], 'auth')
const external = card(cx(1), news.y + news.h + 40, colW, 'News article', ['External News Article'], 'external')
const noticeDetail = card(cx(2), notices.y + notices.h + 40, colW, 'Notice', ['Notice Details'])
const account = card(cx(3), login.y + login.h + 40, colW, 'My Account', ['Watchlist', 'My Comments', 'Edit Profile'], 'auth')

const hb = home.y + home.h
let lines = ''
for (const c of [stock, news, notices, login]) lines += link(home.cx, hb, c.cx, c.y)
lines += link(news.cx, news.y + news.h, external.cx, external.y, true)
lines += link(notices.cx, notices.y + notices.h, noticeDetail.cx, noticeDetail.y)
lines += link(login.cx, login.y + login.h, account.cx, account.y)

// legend
const legend = [
  [C.yellow, 'Public'],
  [C.grey, 'Logged in'],
  [C.dark, 'External link'],
]
  .map(([fill, label], i) => `<rect x="${40 + i * 130}" y="40" width="14" height="14" rx="3" fill="${fill}" stroke="#BDBDBD"/>` + text(60 + i * 130, 52, label, 12, 500, C.soft))
  .join('')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="PROFITKEY sitemap">
<rect width="${W}" height="${H}" fill="#FFFCF5"/>
${legend}${lines}${[home, stock, news, notices, login, external, noticeDetail, account].map((c) => c.svg).join('')}
</svg>`
writeFileSync('public/images/screens/profitkey-sitemap.svg', svg)
console.log('sitemap', W, H, 'bottom', Math.max(external.y + external.h, account.y + account.h, noticeDetail.y + noticeDetail.h))
