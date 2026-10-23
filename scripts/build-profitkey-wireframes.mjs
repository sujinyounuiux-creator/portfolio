// Draws the PROFITKEY wireframes as clean grayscale low-fidelity SVGs.
// Each layout follows the original wireframe slide in the Portfolio Figma file
// (Main, Stock analysis / community, Notice / FAQ, My page, News); it is only
// redrawn larger and clearer, with no new features added.
// Output: public/images/wireframes/profitkey-*.svg
import { mkdirSync, writeFileSync } from 'node:fs'

const W = 480
const C = { frame: '#c9c9c9', block: '#e3e3e3', dark: '#c4c4c4', line: '#d6d6d6', text: '#6f6f6f', ink: '#3f3f3f' }

const rect = (x, y, w, h, fill = C.block, r = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`
const box = (x, y, w, h, r = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${C.dark}" stroke-width="1"/>`
const line = (x1, y1, x2, y2, c = C.line, sw = 1) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${sw}"/>`
const text = (x, y, s, size = 9, weight = 400, anchor = 'start', fill = C.text) =>
  `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${s}</text>`
const circle = (cx, cy, r, fill = C.dark) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`
// a run of short grey bars standing in for a line of text
const lines = (x, y, w, n, gap = 9) => Array.from({ length: n }, (_, i) => rect(x, y + i * gap, i === n - 1 ? w * 0.6 : w, 4, C.block, 2)).join('')
const chart = (x, y, w, h) => {
  const pts = [0, 0.55, 0.3, 0.75, 0.45, 0.2, 0.6, 0.65, 0.4, 0.8, 0.35, 0.5].map((v, i, a) => `${x + (i / (a.length - 1)) * w},${y + h - v * h}`).join(' ')
  return `${box(x, y, w, h)}<polyline points="${pts}" fill="none" stroke="${C.ink}" stroke-width="1.4"/>`
}
const tabs = (y, labels, active) =>
  labels
    .map((l, i) => {
      const w = 400 / labels.length
      const x = 40 + i * w
      return text(x + w / 2, y, l, 9, i === active ? 700 : 400, 'middle', i === active ? C.ink : C.text) + line(x, y + 7, x + w, y + 7, i === active ? C.ink : C.line, i === active ? 2 : 1)
    })
    .join('')
const header = () =>
  rect(0, 0, W, 34, '#f4f4f4', 0) +
  rect(16, 11, 54, 12, C.dark) + text(43, 20, 'Logo', 7, 700, 'middle', '#555') +
  rect(90, 10, 90, 14, '#fff', 7) + box(90, 10, 90, 14, 7) + text(100, 20, 'Search', 7) +
  text(220, 20, 'Stock analysis', 8) + text(290, 20, 'News', 8) + text(325, 20, 'Notices/FAQ', 8) +
  box(420, 10, 44, 14, 4) + text(442, 20, 'Log in', 7, 700, 'middle') +
  line(0, 34, W, 34, C.frame)
const pager = (y) => [-2, -1, 0, 1, 2].map((i) => circle(W / 2 + i * 12, y, 2.5, i === 0 ? C.ink : C.dark)).join('')
const svg = (h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W * 2}" height="${h * 2}" role="img" aria-label="${label}">` +
  `<rect width="${W}" height="${h}" fill="#ffffff"/>${header()}${body}<rect x="0.5" y="0.5" width="${W - 1}" height="${h - 1}" fill="none" stroke="${C.frame}"/></svg>`

const screens = {
  main: [
    560,
    'Main page wireframe',
    // hero
    text(40, 78, 'Title', 18, 700, 'start', C.ink) + text(40, 96, 'Sub text', 10) + lines(40, 108, 150, 2) +
      text(276, 56, 'AI recommended stocks', 8, 700, 'start', C.ink) + chart(276, 62, 164, 58) + rect(276, 126, 78, 26) + rect(362, 126, 78, 26) + rect(276, 158, 164, 22) +
      line(20, 196, 460, 196) +
      // three stock lists
      ['Soaring stocks', 'Domestic/Overseas', 'Market trends']
        .map((t, i) => {
          const x = 40 + i * 140
          return text(x, 218, t, 9, 700, 'start', C.ink) + rect(x, 226, 124, 34) + rect(x, 266, 59, 28) + rect(x + 65, 266, 59, 28) + rect(x, 300, 59, 28) + rect(x + 65, 300, 59, 28)
        })
        .join('') +
      line(20, 348, 460, 348) +
      // news
      text(40, 372, 'News', 11, 700, 'start', C.ink) + box(404, 362, 36, 14, 4) + text(422, 372, 'More', 7, 400, 'middle') +
      [0, 1, 2, 3].map((i) => rect(40 + i * 102, 388, 92, 62) + text(86 + i * 102, 464, 'title', 8, 400, 'middle') + lines(52 + i * 102, 472, 68, 2)).join(''),
  ],
  'stock-analysis': [
    400,
    'Stock analysis page wireframe',
    circle(46, 60, 4) + text(56, 64, 'Item name', 11, 700, 'start', C.ink) + text(124, 64, '(123312)', 8) + text(172, 64, '10,000 won', 11, 700, 'start', C.ink) + text(236, 64, '+5.62%', 8) +
      tabs(92, ['Stock analysis', 'Community'], 0) +
      [0, 1, 2, 3, 4].map((i) => rect(40, 112 + i * 20, 90, 12) + rect(140, 112 + i * 20, 70, 12, '#efefef')).join('') +
      chart(236, 108, 204, 96) +
      text(40, 236, 'AI comments', 10, 700, 'start', C.ink) + rect(40, 246, 400, 70) + text(240, 286, 'AI comment', 10, 700, 'middle', '#555') +
      text(40, 344, 'Financial indicators', 10, 700, 'start', C.ink) + lines(40, 352, 400, 3),
  ],
  community: [
    420,
    'Stock community page wireframe',
    tabs(62, ['Stock analysis', 'Community'], 1) +
      text(40, 96, 'Community', 10, 700, 'start', C.ink) +
      rect(40, 106, 340, 24, '#f0f0f0') + text(50, 121, 'Write a comment…', 8) + box(388, 108, 52, 20, 4) + text(414, 121, 'Post', 8, 700, 'middle') +
      [0, 1, 2, 3, 4]
        .map((i) => {
          const y = 150 + i * 52
          return circle(54, y + 10, 10) + text(54, y + 32, 'Name', 7, 400, 'middle') + rect(76, y, 300, 26) + lines(84, y + 8, 200, 2) + circle(84, y + 36, 3) + circle(98, y + 36, 3)
        })
        .join(''),
  ],
  'notice-faq': [
    400,
    'Notice and FAQ page wireframe',
    tabs(62, ['Notice', 'FAQ'], 0) +
      rect(80, 82, 320, 270, '#f1f1f1') +
      Array.from({ length: 10 }, (_, i) => rect(92, 92 + i * 24, 296, 16, '#fff', 2) + rect(100, 98 + i * 24, i === 0 ? 40 : 150, 4, C.block, 2) + rect(340, 98 + i * 24, 40, 4, C.block, 2)).join('') +
      pager(372),
  ],
  'my-page': [
    360,
    'My page (my interests) wireframe',
    tabs(62, ['My interests', 'Comments I wrote', 'Edit member info'], 0) +
      circle(70, 108, 22) + text(70, 144, 'Nickname', 8, 700, 'middle', C.ink) +
      [0, 1, 2, 3].map((i) => chart(130 + (i % 2) * 160, 88 + Math.floor(i / 2) * 110, 150, 96)).join('') +
      pager(332),
  ],
  'my-comments': [
    380,
    'My page (comments I wrote) wireframe',
    tabs(62, ['My interests', 'Comments I wrote', 'Edit member info'], 1) +
      circle(70, 108, 22) + text(70, 144, 'Nickname', 8, 700, 'middle', C.ink) +
      Array.from({ length: 9 }, (_, i) => text(130, 96 + i * 26, 'My comment', 8) + rect(190, 91 + i * 26, 140, 5, C.block, 2) + text(440, 96 + i * 26, 'YYYY-MM-DD', 7, 400, 'end') + line(130, 104 + i * 26, 440, 104 + i * 26)).join('') +
      pager(352),
  ],
  news: [
    420,
    'News page wireframe',
    text(40, 66, 'Latest news', 11, 700, 'start', C.ink) +
      [0, 1, 2, 3, 4].map((i) => rect(40 + i * 82, 76, 72, 52) + text(40 + i * 82, 142, 'title', 8, 700, 'start', C.ink) + text(40 + i * 82, 154, 'from', 7)).join('') +
      text(40, 186, 'All news', 11, 700, 'start', C.ink) + line(40, 194, 440, 194, C.ink) +
      Array.from({ length: 8 }, (_, i) => rect(40, 204 + i * 22, 400, 14, '#efefef', 2) + rect(48, 209 + i * 22, 220, 4, C.dark, 2) + rect(392, 209 + i * 22, 40, 4, C.dark, 2)).join('') +
      pager(392),
  ],
}

mkdirSync('public/images/wireframes', { recursive: true })
for (const [name, [h, label, body]] of Object.entries(screens)) {
  writeFileSync(`public/images/wireframes/profitkey-${name}.svg`, svg(h, body, label))
  console.log(`profitkey-${name}.svg  ${W * 2}x${h * 2}`)
}
