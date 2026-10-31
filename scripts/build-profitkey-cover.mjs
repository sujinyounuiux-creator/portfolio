// PROFITKEY cover in a fintech landing page style, kept to PROFITKEY's own design: white
// background, the key yellow (#FFB400), the logo, and the home page's headline and intro.
// On the right: the real home page in a laptop, the AI Recommended Stocks card redrawn
// with its own figures (Apple, +20%, $28, highest $61, lowest $32, PER 3.10) and the shape
// of its price line floating in front, plus two real pieces of the site around it (a "PER ?"
// glossary row and a PROFITKEY News card), over a faint yellow grid.
// Sources: public/images/logos/profitkey.png, public/images/screens/profitkey-web-home.webp,
// profitkey-crop-glossary.webp
// Output: public/images/projects/profitkey-cover.webp (1600 x 900)
import sharp from 'sharp'

sharp.cache(false)
const W = 1600
const H = 900
const YELLOW = '#FFB400'
const INK = '#333333'
const RED = '#D9001B' // PROFITKEY's colour for a price rise
const FONT = 'Segoe UI, Arial, sans-serif'

// the price line traced from the home page card (566 px wide), as [x, y] in that card
const LINE = [
  [18, 140], [48, 95], [78, 145], [107, 190], [136, 138], [165, 113], [194, 120], [224, 135], [254, 144],
  [284, 153], [313, 91], [343, 115], [372, 97], [401, 145], [430, 101], [460, 87], [489, 133], [518, 143], [548, 137],
]
// a smooth curve through points (Catmull-Rom to Bezier)
const smooth = (pts) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}
// the price line scaled into a box
const fit = (x, y, w, h) => {
  const xs = LINE.map(([a]) => a), ys = LINE.map(([, b]) => b)
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  return LINE.map(([a, b]) => [x + ((a - x0) / (x1 - x0)) * w, y + ((b - y0) / (y1 - y0)) * h])
}

// laptop (drawn: dark bezel, silver deck); the real home page goes on its screen
const L = { x: 770, y: 120, w: 740 }
const screen = { x: L.x + 18, y: L.y + 18, w: L.w - 36, h: Math.round(((L.w - 36) * 10) / 16) }
const lidH = screen.h + 40
const deckY = L.y + lidH
const bgLine = smooth(fit(700, 640, 900, 170)) // faint, wide, behind everything

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF7E0"/><stop offset="1" stop-color="#FFE7A0"/>
    </linearGradient>
    <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a2b2f"/><stop offset="0.12" stop-color="#c9ccd2"/><stop offset="0.5" stop-color="#eceef1"/><stop offset="1" stop-color="#b9bcc2"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0 H0 V40" fill="none" stroke="${YELLOW}" stroke-opacity="0.16" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#5a4300" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <path d="M700 0 H${W} V${H} H930 C780 ${H} 700 760 700 620 Z" fill="url(#warm)"/>
  <path d="M700 0 H${W} V${H} H930 C780 ${H} 700 760 700 620 Z" fill="url(#grid)"/>
  <path d="${bgLine}" fill="none" stroke="${YELLOW}" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>

  <text x="110" y="246" font-family="${FONT}" font-size="17" font-weight="700" letter-spacing="3" fill="#B98000">AI STOCK RECOMMENDATIONS FOR BEGINNERS</text>
  <text x="104" y="342" font-family="${FONT}" font-size="76" font-weight="700" fill="${INK}">Finding the key</text>
  <text x="104" y="438" font-family="${FONT}" font-size="76" font-weight="700" fill="${INK}">to <tspan fill="${YELLOW}">success</tspan></text>
  <path d="M196 460 C270 451 350 449 446 455" fill="none" stroke="${YELLOW}" stroke-width="7" stroke-linecap="round"/>
  <text x="110" y="518" font-family="${FONT}" font-size="25" fill="#5b5b5b">Easily view domestic and international stock</text>
  <text x="110" y="552" font-family="${FONT}" font-size="25" fill="#5b5b5b">and financial news at a glance!</text>
  <rect x="110" y="600" width="340" height="62" rx="31" fill="${YELLOW}"/>
  <text x="140" y="639" font-family="${FONT}" font-size="21" font-weight="700" fill="${INK}">AI Recommended Stocks</text>
  <path d="M406 631 h18 m-8 -8 l8 8 -8 8" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <g font-family="${FONT}" font-size="19" fill="#4a4a4a">
    <rect x="110" y="716" width="10" height="10" rx="3" fill="${YELLOW}"/><text x="130" y="727">AI Comment</text>
    <rect x="270" y="716" width="10" height="10" rx="3" fill="${YELLOW}"/><text x="290" y="727">Glossary tooltips</text>
    <rect x="470" y="716" width="10" height="10" rx="3" fill="${YELLOW}"/><text x="490" y="727">Stock community</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="${L.x}" y="${L.y}" width="${L.w}" height="${lidH}" rx="22" fill="#151517"/>
    <path d="M${L.x - 46} ${deckY} H${L.x + L.w + 46} L${L.x + L.w + 66} ${deckY + 22} Q${L.x + L.w / 2} ${deckY + 34} ${L.x - 66} ${deckY + 22} Z" fill="url(#deck)"/>
  </g>
  <rect x="${L.x + 1.5}" y="${L.y + 1.5}" width="${L.w - 3}" height="${lidH - 3}" rx="21" fill="none" stroke="#3a3a3f" stroke-width="2"/>
  <circle cx="${L.x + L.w / 2}" cy="${L.y + 9}" r="3" fill="#2f3a48"/>
  <rect x="${L.x + L.w / 2 - 50}" y="${deckY}" width="100" height="7" rx="3" fill="#a9acb2"/>
</svg>`

// the stock card, redrawn smaller, as its own layer (it floats over the laptop)
const C = { w: 400, h: 312, m: 40 } // m: room for the shadow
const chart = fit(C.m + 26, C.m + 98, C.w - 52, 92)
const chartD = smooth(chart)
const lastPt = chart[chart.length - 1]
const tile = (i, label, value) => {
  const tw = (C.w - 52 - 16) / 3
  const x = C.m + 26 + i * (tw + 8)
  return `<rect x="${x}" y="${C.m + 222}" width="${tw}" height="64" rx="12" fill="#FFF8E6"/>
  <text x="${x + 12}" y="${C.m + 246}" font-family="${FONT}" font-size="13" fill="#7a6a45">${label}</text>
  <text x="${x + 12}" y="${C.m + 273}" font-family="${FONT}" font-size="19" font-weight="700" fill="${INK}">${value}</text>`
}
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${C.w + C.m * 2}" height="${C.h + C.m * 2}">
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${RED}" stop-opacity="0.18"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#5a4300" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect x="${C.m}" y="${C.m}" width="${C.w}" height="${C.h}" rx="22" fill="#ffffff" filter="url(#shadow)"/>
  <text x="${C.m + 26}" y="${C.m + 40}" font-family="${FONT}" font-size="17" font-weight="700" fill="${INK}">AI Recommended Stocks</text>
  <text x="${C.m + 26}" y="${C.m + 74}" font-family="${FONT}" font-size="16" font-weight="600" fill="#555555">Apple</text>
  <rect x="${C.m + 82}" y="${C.m + 56}" width="60" height="26" rx="7" fill="#FDE3E6"/>
  <text x="${C.m + 112}" y="${C.m + 75}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="700" fill="${RED}">+20%</text>
  <text x="${C.m + C.w - 26}" y="${C.m + 76}" text-anchor="end" font-family="${FONT}" font-size="24" font-weight="700" fill="${INK}">$28 usd</text>
  <path d="${chartD} L${lastPt[0]} ${C.m + 206} L${chart[0][0]} ${C.m + 206} Z" fill="url(#fill)"/>
  <path d="${chartD}" fill="none" stroke="${RED}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="5.5" fill="#ffffff" stroke="${RED}" stroke-width="3"/>
  ${tile(0, 'Highest price', '$61')}
  ${tile(1, 'Lowest price', '$32')}
  ${tile(2, 'PER', '3.10 times')}
</svg>`

// a real piece of the site on a small white floating card
async function floatCard(piece, pad) {
  const m = await sharp(piece).metadata()
  const w = m.width + pad * 2
  const h = m.height + pad * 2
  const box = `<svg xmlns="http://www.w3.org/2000/svg" width="${w + 80}" height="${h + 80}"><defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#5a4300" flood-opacity="0.18"/></filter></defs><rect x="40" y="40" width="${w}" height="${h}" rx="16" fill="#ffffff" filter="url(#s)"/></svg>`
  return sharp(Buffer.from(box)).composite([{ input: piece, left: 40 + pad, top: 40 + pad }]).png().toBuffer()
}

const home = await sharp('public/images/screens/profitkey-web-home.webp').extract({ left: 0, top: 0, width: 1400, height: 875 }).resize(screen.w, screen.h).png().toBuffer()
const glossary = await sharp('public/images/screens/profitkey-crop-glossary.webp').extract({ left: 44, top: 110, width: 262, height: 52 }).resize({ width: 300 }).png().toBuffer()
const news = await sharp('public/images/screens/profitkey-web-home.webp').extract({ left: 116, top: 1680, width: 282, height: 286 }).resize({ width: 220 }).png().toBuffer()
const logo = await sharp('public/images/logos/profitkey.png').resize({ height: 54 }).png().toBuffer()
const cardImg = await sharp(Buffer.from(card)).png().toBuffer()

const flat = await sharp(Buffer.from(background))
  .composite([
    { input: home, left: screen.x, top: screen.y },
    { input: logo, left: 110, top: 96 },
    { input: await floatCard(glossary, 14), left: 1240 - 40, top: 70 - 40 },
    { input: await floatCard(news, 12), left: 1330 - 40, top: 470 - 40 },
    { input: cardImg, left: 690 - C.m, top: 480 - C.m },
  ])
  .png()
  .toBuffer()
const out = await sharp(flat).webp({ quality: 90 }).toFile('public/images/projects/profitkey-cover.webp')
console.log('profitkey-cover', out.width, out.height)
