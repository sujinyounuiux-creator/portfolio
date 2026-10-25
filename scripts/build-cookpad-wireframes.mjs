// Redraws the Cookpad wireframes as clean grayscale low-fi SVGs, one per screen.
// Layout and content follow the original "wireframe" frame in the Portfolio Figma file
// (login modal, main page, search page, recipe page); only redrawn larger and tidier.
// Output: public/images/wireframes/cookpad-*.svg
import { mkdirSync, writeFileSync } from 'node:fs'

const W = 480
const C = { frame: '#c9c9c9', block: '#e3e3e3', dark: '#c4c4c4', line: '#d6d6d6', text: '#6f6f6f', ink: '#3f3f3f' }
const rect = (x, y, w, h, fill = C.block, r = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`
const box = (x, y, w, h, r = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${C.dark}"/>`
const line = (x1, y1, x2, y2, c = C.line) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}"/>`
const text = (x, y, s, size = 9, weight = 400, anchor = 'start', fill = C.text) =>
  `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${s}</text>`
const lines = (x, y, w, n, gap = 9) => Array.from({ length: n }, (_, i) => rect(x, y + i * gap, i === n - 1 ? w * 0.6 : w, 4, C.block, 2)).join('')
// image placeholder with a cross
const photo = (x, y, w, h, label) =>
  rect(x, y, w, h) + line(x, y, x + w, y + h, '#d0d0d0') + line(x + w, y, x, y + h, '#d0d0d0') + (label ? text(x + w / 2, y + h / 2 + 3, label, 8, 700, 'middle', '#8a8a8a') : '')
const search = (x, y, w) => rect(x, y, w, 22, '#fff', 11) + box(x, y, w, 22, 11) + text(x + 12, y + 14, 'Keywords (ingredients etc.)', 8) + rect(x + w + 6, y, 52, 22, C.dark, 11) + text(x + w + 32, y + 14, 'Search', 8, 700, 'middle', '#555')
const header = () =>
  rect(0, 0, W, 34, '#f4f4f4', 0) + rect(16, 11, 58, 12, C.dark) + text(45, 20, 'Logo', 7, 700, 'middle', '#555') +
  text(370, 20, 'Archive', 8) + box(420, 10, 44, 14, 4) + text(442, 20, 'Log in', 7, 700, 'middle') + line(0, 34, W, 34, C.frame)
const svg = (h, body, label, withHeader = true) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W * 2}" height="${h * 2}" role="img" aria-label="${label}">` +
  `<rect width="${W}" height="${h}" fill="#ffffff"/>${withHeader ? header() : ''}${body}<rect x="0.5" y="0.5" width="${W - 1}" height="${h - 1}" fill="none" stroke="${C.frame}"/></svg>`

const screens = {
  login: [
    360,
    'Login modal wireframe',
    // dimmed page behind a centred modal
    rect(0, 34, W, 326, '#efefef', 0) +
      rect(110, 70, 260, 230, '#fff', 8) + box(110, 70, 260, 230, 8) +
      text(240, 100, 'Log in', 13, 700, 'middle', C.ink) +
      text(136, 124, 'Email', 8) + rect(136, 130, 208, 22, '#f3f3f3', 4) +
      text(136, 168, 'Password', 8) + rect(136, 174, 208, 22, '#f3f3f3', 4) +
      rect(136, 212, 208, 26, C.dark, 13) + text(240, 229, 'Log in', 9, 700, 'middle', '#555') +
      text(240, 260, 'Sign up', 8, 400, 'middle') + text(358, 86, '×', 12, 400, 'middle'),
  ],
  main: [
    620,
    'Main page wireframe',
    // hero: logo + search
    rect(160, 70, 160, 26, C.dark) + text(240, 87, 'LOGO', 11, 700, 'middle', '#555') + search(96, 112, 230) +
      line(20, 166, 460, 166) +
      // category grid
      text(40, 192, 'Category', 11, 700, 'start', C.ink) +
      Array.from({ length: 6 }, (_, i) => photo(40 + (i % 3) * 136, 204 + Math.floor(i / 3) * 76, 128, 66)).join('') +
      line(20, 370, 460, 370) +
      // popular recipes
      text(40, 396, 'Popular Recipes', 11, 700, 'start', C.ink) +
      Array.from({ length: 8 }, (_, i) => {
        const x = 40 + (i % 4) * 102
        const y = 408 + Math.floor(i / 4) * 100
        return photo(x, y, 94, 60) + lines(x, y + 68, 80, 2)
      }).join(''),
  ],
  search: [
    560,
    'Search page wireframe',
    search(40, 52, 300) + rect(410, 52, 30, 22, '#fff', 4) + box(410, 52, 30, 22, 4) + line(417, 59, 433, 59, '#888') + line(419, 63, 431, 63, '#888') + line(422, 67, 428, 67, '#888') + text(40, 96, 'Filter', 8, 700, 'start', C.ink) +
      text(440, 96, 'Newest · Popular', 7, 400, 'end') + line(40, 104, 440, 104) +
      Array.from({ length: 6 }, (_, i) => {
        const y = 116 + i * 72
        return photo(40, y, 96, 60) + text(148, y + 14, 'Recipe title', 9, 700, 'start', C.ink) + lines(148, y + 22, 230, 2) + text(148, y + 52, '25 minutes · Author', 7)
      }).join(''),
  ],
  recipe: [
    680,
    'Recipe page wireframe',
    photo(40, 56, 200, 150, 'Food photo') +
      text(256, 72, 'Recipe title', 13, 700, 'start', C.ink) + text(256, 88, 'Author', 8) +
      text(256, 116, 'Ingredients', 10, 700, 'start', C.ink) +
      Array.from({ length: 5 }, (_, i) => rect(256, 126 + i * 15, 120, 5, C.block, 2) + rect(400, 126 + i * 15, 40, 5, C.block, 2)).join('') +
      line(20, 224, 460, 224) +
      text(40, 248, 'Recipe', 11, 700, 'start', C.ink) +
      Array.from({ length: 3 }, (_, i) => {
        const y = 260 + i * 52
        return `<circle cx="50" cy="${y + 10}" r="9" fill="${C.dark}"/>` + text(50, y + 13, String(i + 1), 8, 700, 'middle', '#555') + photo(68, y, 80, 44) + lines(160, y + 6, 280, 3)
      }).join('') +
      text(40, 432, 'Point', 11, 700, 'start', C.ink) + lines(40, 442, 400, 2) +
      text(40, 486, 'Comments', 11, 700, 'start', C.ink) +
      rect(40, 496, 400, 30, '#f3f3f3', 4) + rect(60, 532, 380, 26, '#f3f3f3', 4) +
      text(40, 586, 'More recipes', 11, 700, 'start', C.ink) +
      Array.from({ length: 4 }, (_, i) => photo(40 + i * 102, 598, 94, 60)).join(''),
  ],
}

mkdirSync('public/images/wireframes', { recursive: true })
for (const [name, [h, label, body]] of Object.entries(screens)) {
  writeFileSync(`public/images/wireframes/cookpad-${name}.svg`, svg(h, body, label))
  console.log(`cookpad-${name}.svg  ${W * 2}x${h * 2}`)
}
