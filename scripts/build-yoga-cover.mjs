// Open Door Yoga cover in an app landing page style, in the studio's own style guide colours
// (Violet light #F0EDF1, Violet #6A4E77, Violet darker #251B2A, Green #B2C95D and its dark
// #869746). Left: the case study's title, tagline and summary. Right: three redesigned pages
// (About, Home, Pricing) as browser windows stacked one behind the other, with the Pricing
// page's real "Best Deal" 12 Month Pass card floating in front, over a violet wave.
// Sources: design-exports/yoga-{home,pricing,about}.png (Figma, credits masked),
// public/images/logos/open-door-yoga.png
// Output: public/images/projects/yoga-cover.webp (1600 x 900)
import sharp from 'sharp'

sharp.cache(false)
const W = 1600
const H = 900
const VIOLET = '#6A4E77'
const DARK = '#251B2A'
const LIGHT = '#F0EDF1'
const GREEN_DARK = '#869746'
const FONT = 'Segoe UI, Arial, sans-serif'
const SERIF = 'Georgia, serif'

// a page as a browser window: a light bar with three dots, then the top of the page
async function browser(src, width) {
  const meta = await sharp(src).metadata()
  const shotH = Math.round(width * 0.62)
  const shot = await sharp(src).extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.width * 0.62) }).resize(width, shotH).png().toBuffer()
  const bar = 30
  const h = bar + shotH
  const m = 50 // room for the shadow
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width + m * 2}" height="${h + m * 2}">
    <defs>
      <filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="${DARK}" flood-opacity="0.22"/></filter>
      <clipPath id="c"><rect x="${m}" y="${m}" width="${width}" height="${h}" rx="14"/></clipPath>
    </defs>
    <rect x="${m}" y="${m}" width="${width}" height="${h}" rx="14" fill="#ffffff" filter="url(#s)"/>
    <g clip-path="url(#c)"><rect x="${m}" y="${m}" width="${width}" height="${bar}" fill="#F6F3F7"/></g>
    <circle cx="${m + 20}" cy="${m + 15}" r="5" fill="#D9CFDD"/><circle cx="${m + 36}" cy="${m + 15}" r="5" fill="#D9CFDD"/><circle cx="${m + 52}" cy="${m + 15}" r="5" fill="#D9CFDD"/>
  </svg>`
  // round the bottom corners of the screenshot to match the window
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${shotH}"><path d="M0 0 H${width} V${shotH - 14} Q${width} ${shotH} ${width - 14} ${shotH} H14 Q0 ${shotH} 0 ${shotH - 14} Z" fill="#fff"/></svg>`)
  const rounded = await sharp(shot).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
  const buf = await sharp(Buffer.from(svg)).composite([{ input: rounded, left: m, top: m + bar }]).png().toBuffer()
  return { buf, m }
}

// the real "Best Deal" 12 Month Pass card from the Pricing page, on a soft shadow
async function passCard() {
  const card = await sharp('design-exports/yoga-pricing.png').extract({ left: 690, top: 1016, width: 320, height: 300 }).resize({ width: 250 }).png().toBuffer()
  const meta = await sharp(card).metadata()
  const m = 40
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width + m * 2}" height="${meta.height + m * 2}"><defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="${DARK}" flood-opacity="0.25"/></filter></defs><rect x="${m}" y="${m}" width="${meta.width}" height="${meta.height}" rx="18" fill="#ffffff" filter="url(#s)"/></svg>`
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}"><rect width="${meta.width}" height="${meta.height}" rx="18" fill="#fff"/></svg>`)
  const rounded = await sharp(card).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
  return { buf: await sharp(Buffer.from(svg)).composite([{ input: rounded, left: m, top: m }]).png().toBuffer(), m }
}

const chip = (x, y, label) => {
  const w = label.length * 10.6 + 36
  return { svg: `<rect x="${x}" y="${y}" width="${w}" height="40" rx="20" fill="#ffffff" stroke="${VIOLET}" stroke-opacity="0.35" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" font-family="${FONT}" font-size="17" font-weight="600" fill="${VIOLET}">${label.replace(/&/g, '&amp;')}</text>`, w }
}
let cx = 110
const chips = ['Heuristic review', 'Style guide', 'Pricing & About'].map((l) => {
  const c = chip(cx, 690, l)
  cx += c.w + 12
  return c.svg
}).join('')

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${LIGHT}"/></linearGradient>
    <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="${DARK}"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- the violet wave along the bottom, rising behind the pages -->
  <path d="M0 790 C300 760 520 820 820 760 C1120 700 1300 560 1600 520 V${H} H0 Z" fill="url(#wave)"/>
  <path d="M0 830 C340 800 600 860 900 800 C1180 744 1360 640 1600 610" fill="none" stroke="#B2C95D" stroke-opacity="0.55" stroke-width="3"/>

  <text x="110" y="222" font-family="${FONT}" font-size="16" font-weight="700" letter-spacing="3" fill="${GREEN_DARK}">WEBSITE REDESIGN</text>
  <text x="106" y="306" font-family="${SERIF}" font-size="74" font-weight="700" fill="${DARK}">Open Door</text>
  <text x="106" y="390" font-family="${SERIF}" font-size="74" font-weight="700" fill="${VIOLET}">Yoga</text>
  <text x="110" y="452" font-family="${FONT}" font-size="27" font-weight="600" fill="${DARK}">Redesigning the Open Door Yoga Website</text>
  <text x="110" y="500" font-family="${FONT}" font-size="21" fill="#4a4050">A team redesign of the studio’s website:</text>
  <text x="110" y="530" font-family="${FONT}" font-size="21" fill="#4a4050">class styles, teacher training and pass pricing.</text>
  <rect x="110" y="580" width="230" height="58" rx="29" fill="${VIOLET}"/>
  <text x="140" y="616" font-family="${FONT}" font-size="20" font-weight="700" fill="#ffffff">View case study</text>
  <path d="M302 609 h16 m-7 -7 l7 7 -7 7" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  ${chips}
</svg>`

const logo = await sharp('public/images/logos/open-door-yoga.png').resize({ height: 34 }).png().toBuffer()
const about = await browser('design-exports/yoga-about.png', 470)
const home = await browser('design-exports/yoga-home.png', 560)
const pricing = await browser('design-exports/yoga-pricing.png', 640)
const pass = await passCard()

const flat = await sharp(Buffer.from(background))
  .composite([
    { input: logo, left: 110, top: 96 },
    { input: about.buf, left: 1070 - about.m, top: 90 - about.m },
    { input: home.buf, left: 930 - home.m, top: 170 - home.m },
    { input: pricing.buf, left: 760 - pricing.m, top: 300 - pricing.m },
    { input: pass.buf, left: 1310 - pass.m, top: 520 - pass.m },
  ])
  .png()
  .toBuffer()
const out = await sharp(flat).webp({ quality: 90 }).toFile('public/images/projects/yoga-cover.webp')
console.log('yoga-cover', out.width, out.height)
