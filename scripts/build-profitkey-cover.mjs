// PROFITKEY cover in a fintech landing page style, kept to PROFITKEY's own design: white
// background, the key yellow (#FFB400), the logo, and the home page's headline and intro.
// On the right, the home page's AI Recommended Stocks card is redrawn more cleanly with
// its own figures (Apple, +20%, $28, highest $61, lowest $32, PER 3.10) and the shape of
// its price line, with the real AI Comment panel below it.
// Sources: public/images/logos/profitkey.png, public/images/screens/profitkey-ai-pick.webp
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

// the stock card, drawn at (CX, CY)
const CX = 860
const CY = 120
const CW = 620
const chartX = CX + 36
const chartY = CY + 120
const chartW = CW - 72
const chartH = 170
const xs = LINE.map(([x]) => x)
const ys = LINE.map(([, y]) => y)
const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
const pts = LINE.map(([x, y]) => [chartX + ((x - x0) / (x1 - x0)) * chartW, chartY + 14 + ((y - y0) / (y1 - y0)) * (chartH - 40)])
// a smooth curve through the points (Catmull-Rom to Bezier)
let d = `M${pts[0][0]} ${pts[0][1]}`
for (let i = 0; i < pts.length - 1; i++) {
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
  const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
  const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
  d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
}
const last = pts[pts.length - 1]
const area = `${d} L${last[0]} ${chartY + chartH} L${pts[0][0]} ${chartY + chartH} Z`

const tile = (x, label, value) => `
  <rect x="${x}" y="${CY + 340}" width="174" height="84" rx="16" fill="#FFF8E6"/>
  <text x="${x + 18}" y="${CY + 372}" font-family="${FONT}" font-size="17" fill="#7a6a45">${label}</text>
  <text x="${x + 18}" y="${CY + 404}" font-family="${FONT}" font-size="24" font-weight="700" fill="${INK}">${value}</text>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${RED}" stop-opacity="0.18"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF6DC"/><stop offset="1" stop-color="#FFE9A8"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#5a4300" flood-opacity="0.14"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <!-- a soft warm panel behind the card, curving off the right edge -->
  <path d="M760 0 H${W} V${H} H980 C820 ${H} 760 760 760 620 Z" fill="url(#warm)"/>

  <!-- left: eyebrow, headline, intro, button and three features -->
  <text x="110" y="250" font-family="${FONT}" font-size="17" font-weight="700" letter-spacing="3" fill="#B98000">AI STOCK RECOMMENDATIONS FOR BEGINNERS</text>
  <text x="106" y="340" font-family="${FONT}" font-size="76" font-weight="700" fill="${INK}">Finding the key</text>
  <text x="106" y="428" font-family="${FONT}" font-size="76" font-weight="700" fill="${INK}">to <tspan fill="${YELLOW}">success</tspan></text>
  <text x="110" y="496" font-family="${FONT}" font-size="25" fill="#5b5b5b">Easily view domestic and international stock</text>
  <text x="110" y="530" font-family="${FONT}" font-size="25" fill="#5b5b5b">and financial news at a glance!</text>
  <rect x="110" y="580" width="340" height="62" rx="31" fill="${YELLOW}"/>
  <text x="140" y="619" font-family="${FONT}" font-size="21" font-weight="700" fill="${INK}">AI Recommended Stocks</text>
  <path d="M406 611 h18 m-8 -8 l8 8 -8 8" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <g font-family="${FONT}" font-size="19" fill="#4a4a4a">
    <rect x="110" y="700" width="10" height="10" rx="3" fill="${YELLOW}"/><text x="130" y="711">AI Comment</text>
    <rect x="270" y="700" width="10" height="10" rx="3" fill="${YELLOW}"/><text x="290" y="711">Glossary tooltips</text>
    <rect x="470" y="700" width="10" height="10" rx="3" fill="${YELLOW}"/><text x="490" y="711">Stock community</text>
  </g>

  <!-- right: the AI Recommended Stocks card, redrawn -->
  <g filter="url(#shadow)">
    <rect x="${CX}" y="${CY}" width="${CW}" height="684" rx="28" fill="#ffffff"/>
  </g>
  <text x="${CX + 36}" y="${CY + 58}" font-family="${FONT}" font-size="22" font-weight="700" fill="${INK}">AI Recommended Stocks</text>
  <text x="${CX + 36}" y="${CY + 100}" font-family="${FONT}" font-size="20" font-weight="600" fill="#555555">Apple</text>
  <rect x="${CX + 112}" y="${CY + 78}" width="76" height="32" rx="9" fill="#FDE3E6"/>
  <text x="${CX + 150}" y="${CY + 101}" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="700" fill="${RED}">+20%</text>
  <text x="${CX + CW - 36}" y="${CY + 102}" text-anchor="end" font-family="${FONT}" font-size="30" font-weight="700" fill="${INK}">$28 usd</text>
  <path d="${area}" fill="url(#fill)"/>
  <path d="${d}" fill="none" stroke="${RED}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${last[0]}" cy="${last[1]}" r="7" fill="#ffffff" stroke="${RED}" stroke-width="3.5"/>
  ${tile(CX + 36, 'Highest price', '$61')}
  ${tile(CX + 223, 'Lowest price', '$32')}
  ${tile(CX + 410, 'PER', '3.10 times')}
</svg>`

// the real AI Comment panel from the same card, placed at the bottom of the redrawn card
const comment = await sharp('public/images/screens/profitkey-ai-pick.webp').extract({ left: 20, top: 398, width: 528, height: 194 }).resize({ width: CW - 72 }).png().toBuffer()
const logo = await sharp('public/images/logos/profitkey.png').resize({ height: 54 }).png().toBuffer()
const flat = await sharp(Buffer.from(svg))
  .composite([
    { input: comment, left: CX + 36, top: CY + 448 },
    { input: logo, left: 110, top: 96 },
  ])
  .png()
  .toBuffer()
const out = await sharp(flat).webp({ quality: 90 }).toFile('public/images/projects/profitkey-cover.webp')
console.log('profitkey-cover', out.width, out.height)
