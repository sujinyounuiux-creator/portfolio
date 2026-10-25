// Builds a richer Cookpad cover from the real Cookpad screens in the Portfolio Figma file:
// the recipe list and recipe detail pages in browser windows, plus the mobile home screen
// (cut from the original cover frame) in a phone. Nothing new is drawn inside the screens.
// Sources: design-exports/cookpad-{list,recipe,main,cover-frame}.png
// Output: public/images/projects/cookpad-cover.webp (1600x900)
import sharp from 'sharp'

const W = 1600
const H = 900
const C = { bg: '#FFF4E8', orange: '#FF9934', red: '#370000', grey: '#646464', line: '#F1DCC6' }
const FONT = "'Segoe UI', Arial, sans-serif"

// a browser window: soft shadow, rounded white body, a slim bar with three dots
const windowSvg = (w, h, bar) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w + 80}" height="${h + bar + 80}">
<defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#5a2a00" flood-opacity="0.16"/></filter></defs>
<rect x="40" y="30" width="${w}" height="${h + bar}" rx="14" fill="#fff" filter="url(#s)"/>
<path d="M40 ${30 + bar} V44 a14 14 0 0 1 14 -14 H${40 + w - 14} a14 14 0 0 1 14 14 V${30 + bar} Z" fill="#F7EEE4"/>
${[0, 1, 2].map((i) => `<circle cx="${62 + i * 16}" cy="${30 + bar / 2}" r="5" fill="${['#FF9934', '#FFC48A', '#E9D6C2'][i]}"/>`).join('')}
</svg>`

// rounded mask for screen content
const mask = (w, h, r) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`)
const rounded = async (input, w, h, r, extract) => {
  let img = sharp(input)
  if (extract) img = img.extract(extract)
  const buf = await img.resize(w, h).png().toBuffer()
  return sharp(buf).composite([{ input: mask(w, h, r), blend: 'dest-in' }]).png().toBuffer()
}

const BAR = 30
const WIN_W = 700
const WIN_H = Math.round((WIN_W * 9) / 16)
// keep the bottom corners rounded: the screen sits under the bar
const screen = (src) => rounded(src, WIN_W, WIN_H, 14)

const listWin = { x: 640, y: 70 }
const recipeWin = { x: 820, y: 330 }
const phone = { x: 1300, y: 300, w: 236, h: 500 }

const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<circle cx="1130" cy="470" r="420" fill="${C.orange}" opacity="0.13"/>
<circle cx="1490" cy="130" r="120" fill="${C.orange}" opacity="0.10"/>
<circle cx="560" cy="820" r="70" fill="${C.orange}" opacity="0.12"/>
<text x="110" y="340" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="4" fill="${C.orange}">UI/UX REDESIGN</text>
<text x="106" y="440" font-family="${FONT}" font-size="104" font-weight="700" fill="${C.red}">Cookpad</text>
<text x="110" y="506" font-family="${FONT}" font-size="30" fill="${C.grey}">Easier recipe search, filters</text>
<text x="110" y="548" font-family="${FONT}" font-size="30" fill="${C.grey}">and threaded comments</text>
${['Responsive web', 'Search filters', 'Custom icons']
  .map((t, i, a) => {
    const widths = [196, 178, 170]
    const x = 110 + widths.slice(0, i).reduce((s, v) => s + v + 12, 0)
    return `<rect x="${x}" y="592" width="${widths[i]}" height="44" rx="22" fill="#fff" stroke="${C.line}" stroke-width="2"/><text x="${x + widths[i] / 2}" y="621" font-family="${FONT}" font-size="20" font-weight="600" fill="${C.red}" text-anchor="middle">${t}</text>`
  })
  .join('')}
</svg>`)

// phone: dark rounded body with the real mobile home screen inside
const phoneBody = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${phone.w + 80}" height="${phone.h + 80}">
<defs><filter id="s" x="-30%" y="-20%" width="160%" height="140%"><feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#5a2a00" flood-opacity="0.22"/></filter></defs>
<rect x="40" y="30" width="${phone.w}" height="${phone.h}" rx="34" fill="#2b1a12" filter="url(#s)"/>
</svg>`)
const PAD = 9
const phoneScreen = await rounded('design-exports/cookpad-cover-frame.png', phone.w - PAD * 2, phone.h - PAD * 2, 26, { left: 1424, top: 386, width: 272, height: 585 })

// cookpad logo mark, cut from the real home page
const logo = await rounded('design-exports/cookpad-main.png', 92, 92, 46, { left: 502, top: 309, width: 178, height: 178 })

const out = await sharp(bg)
  .composite([
    { input: logo, left: 110, top: 200 },
    { input: Buffer.from(windowSvg(WIN_W, WIN_H, BAR)), left: listWin.x - 40, top: listWin.y - 30 },
    { input: await screen('design-exports/cookpad-list.png'), left: listWin.x, top: listWin.y + BAR },
    { input: Buffer.from(windowSvg(WIN_W, WIN_H, BAR)), left: recipeWin.x - 40, top: recipeWin.y - 30 },
    { input: await screen('design-exports/cookpad-recipe.png'), left: recipeWin.x, top: recipeWin.y + BAR },
    { input: phoneBody, left: phone.x - 40, top: phone.y - 30 },
    { input: phoneScreen, left: phone.x + PAD, top: phone.y + PAD },
  ])
  .webp({ quality: 88 })
  .toFile('public/images/projects/cookpad-cover.webp')
console.log('cookpad-cover', out.width, out.height)
