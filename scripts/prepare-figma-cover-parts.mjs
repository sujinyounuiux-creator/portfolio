// Parts for rebuilding the PROFITKEY and LastCow covers as editable layers in the Portfolio
// Figma file: screenshots, logos and the phone frame as PNGs, and the background, laptop,
// graph, underline and ticket outlines as SVGs (Figma imports SVGs as editable vectors).
// Text, cards, buttons and tiles are made natively in Figma, so they stay editable.
// Output: design-exports/figma-covers/
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const OUT = 'design-exports/figma-covers'
mkdirSync(OUT, { recursive: true })
const YELLOW = '#FFB400'
const RED = '#D9001B'
const PURPLE = '#3103b1'

// ── PROFITKEY ──
const LINE = [
  [18, 140], [48, 95], [78, 145], [107, 190], [136, 138], [165, 113], [194, 120], [224, 135], [254, 144],
  [284, 153], [313, 91], [343, 115], [372, 97], [401, 145], [430, 101], [460, 87], [489, 133], [518, 143], [548, 137],
]
const smooth = (pts) => {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}
const fit = (x, y, w, h) => {
  const xs = LINE.map(([a]) => a), ys = LINE.map(([, b]) => b)
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  return LINE.map(([a, b]) => [x + ((a - x0) / (x1 - x0)) * w, y + ((b - y0) / (y1 - y0)) * h])
}

// background: the warm panel, its grid and the faint price line (1600 x 900)
const panel = 'M700 0 H1600 V900 H930 C780 900 700 760 700 620 Z'
let grid = ''
for (let x = 720; x <= 1600; x += 40) grid += `<path d="M${x} 0 V900" stroke="${YELLOW}" stroke-opacity="0.16" stroke-width="1"/>`
for (let y = 0; y <= 900; y += 40) grid += `<path d="M700 ${y} H1600" stroke="${YELLOW}" stroke-opacity="0.16" stroke-width="1"/>`
writeFileSync(`${OUT}/pk-background.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF7E0"/><stop offset="1" stop-color="#FFE7A0"/></linearGradient>
    <clipPath id="panel"><path d="${panel}"/></clipPath>
  </defs>
  <rect width="1600" height="900" fill="#ffffff"/>
  <path d="${panel}" fill="url(#warm)"/>
  <g clip-path="url(#panel)">${grid}</g>
  <path d="${smooth(fit(700, 640, 900, 170))}" fill="none" stroke="${YELLOW}" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>
</svg>`)

// laptop shell: dark lid and silver deck (box 872 x 512; the screen sits at 84,18 size 704x440)
const LW = 740, lidH = 480, ox = 66
writeFileSync(`${OUT}/pk-laptop.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="872" height="516" viewBox="0 0 872 516">
  <defs><linearGradient id="deck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2b2f"/><stop offset="0.12" stop-color="#c9ccd2"/><stop offset="0.5" stop-color="#eceef1"/><stop offset="1" stop-color="#b9bcc2"/></linearGradient></defs>
  <rect x="${ox}" y="0" width="${LW}" height="${lidH}" rx="22" fill="#151517" stroke="#3a3a3f" stroke-width="2"/>
  <circle cx="${ox + LW / 2}" cy="9" r="3" fill="#2f3a48"/>
  <path d="M${ox - 46} ${lidH} H${ox + LW + 46} L${ox + LW + 66} ${lidH + 22} Q${ox + LW / 2} ${lidH + 34} ${ox - 66} ${lidH + 22} Z" fill="url(#deck)"/>
  <rect x="${ox + LW / 2 - 50}" y="${lidH}" width="100" height="7" rx="3" fill="#a9acb2"/>
</svg>`)

// the stock card's graph (348 x 108)
const chart = fit(2, 6, 344, 92)
const cd = smooth(chart)
const last = chart[chart.length - 1]
writeFileSync(`${OUT}/pk-graph.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="348" height="112" viewBox="0 0 348 112">
  <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${RED}" stop-opacity="0.18"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></linearGradient></defs>
  <path d="${cd} L${last[0].toFixed(1)} 112 L${chart[0][0].toFixed(1)} 112 Z" fill="url(#fill)"/>
  <path d="${cd}" fill="none" stroke="${RED}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="5.5" fill="#ffffff" stroke="${RED}" stroke-width="3"/>
</svg>`)

writeFileSync(`${OUT}/pk-underline.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="22" viewBox="0 0 260 22"><path d="M4 15 C78 6 158 4 254 10" fill="none" stroke="${YELLOW}" stroke-width="7" stroke-linecap="round"/></svg>`)

const png = (src, out, opts = {}) => {
  let s = sharp(src)
  if (opts.extract) s = s.extract(opts.extract)
  if (opts.width) s = s.resize({ width: opts.width })
  return s.png().toFile(`${OUT}/${out}.png`)
}
await png('public/images/logos/profitkey.png', 'pk-logo')
await png('public/images/screens/profitkey-web-home.webp', 'pk-home-page', { extract: { left: 0, top: 0, width: 1400, height: 875 } })
await png('public/images/screens/profitkey-crop-glossary.webp', 'pk-glossary-row', { extract: { left: 44, top: 110, width: 262, height: 52 } })
await png('public/images/screens/profitkey-web-home.webp', 'pk-news-card', { extract: { left: 116, top: 1680, width: 282, height: 286 } })

// ── LastCow ──
const ticket = (x, y, w, h, rot) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})" fill="none" stroke="${PURPLE}" stroke-opacity="0.28" stroke-width="3.5">
  <path d="M${x + 18} ${y} H${x + w - 18} Q${x + w} ${y} ${x + w} ${y + 18} V${y + h / 2 - 22} A22 22 0 0 0 ${x + w} ${y + h / 2 + 22} V${y + h - 18} Q${x + w} ${y + h} ${x + w - 18} ${y + h} H${x + 18} Q${x} ${y + h} ${x} ${y + h - 18} V${y + h / 2 + 22} A22 22 0 0 0 ${x} ${y + h / 2 - 22} V${y + 18} Q${x} ${y} ${x + 18} ${y} Z"/>
  <path d="M${x + w * 0.28} ${y + 14} V${y + h - 14}" stroke-dasharray="10 10"/>
</g>`
const BAND = 455
writeFileSync(`${OUT}/lc-background.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs><linearGradient id="band" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3d10c4"/><stop offset="1" stop-color="${PURPLE}"/></linearGradient></defs>
  <rect width="1600" height="900" fill="#ffffff"/>
  <rect y="${BAND}" width="1600" height="${900 - BAND}" fill="url(#band)"/>
  <path d="M0 ${BAND} H520 L300 900 H0 Z" fill="#ffffff" fill-opacity="0.05"/>
  <path d="M1220 ${BAND} H1600 V900 H1000 Z" fill="#ffffff" fill-opacity="0.04"/>
  ${ticket(70, 120, 250, 140, -12)}
  ${ticket(1290, 70, 230, 130, 10)}
</svg>`)

// cow icon (trimmed) and the purple wordmark on transparent
await sharp('design-exports/logos/lastcow-icon.png').flatten({ background: '#ffffff' }).trim({ background: '#ffffff', threshold: 20 }).png().toFile(`${OUT}/lc-cow-icon.png`)
{
  const { data, info } = await sharp('design-exports/logos/lastcow.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const bg = [data[0], data[1], data[2]]
  const ink = [0x31, 0x03, 0xb1]
  const full = Math.hypot(ink[0] - bg[0], ink[1] - bg[1], ink[2] - bg[2])
  for (let i = 0; i < data.length; i += 4) {
    const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2])
    data[i + 3] = Math.round(Math.min(1, d / full) * 255)
    data[i] = ink[0]
    data[i + 1] = ink[1]
    data[i + 2] = ink[2]
  }
  const word = await sharp(data, { raw: info }).extract({ left: 440, top: 0, width: info.width - 440, height: info.height }).png().toBuffer()
  await sharp(word).trim().png().toFile(`${OUT}/lc-wordmark.png`)
}
for (const s of ['home', 'event', 'calendar']) await png(`public/images/screens/lastcow-${s}-hifi.webp`, `lc-screen-${s}`)
await png('public/images/mockups/iphone.webp', 'iphone-frame')
await png('public/images/screens/lastcow-home-hifi.webp', 'lc-price-card', { extract: { left: 40, top: 528, width: 520, height: 120 } })
await png('public/images/screens/lastcow-event-hifi.webp', 'lc-tickets-bar', { extract: { left: 20, top: 1172, width: 560, height: 92 } })

console.log(readFileSync('src/data/mockups.json', 'utf8'))
console.log('parts ready')
