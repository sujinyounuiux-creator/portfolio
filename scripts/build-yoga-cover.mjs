// Open Door Yoga cover in an app landing page style, in the studio's own style guide colours
// (Violet light #F0EDF1, Violet #6A4E77, Violet darker #251B2A, Green #B2C95D and its dark
// #869746). Left: the case study's title and tagline. Right: three redesigned pages
// (About, Pricing and, in front, Home) as frosted glass windows stacked one behind the other:
// each frame blurs and tints whatever is behind it, and the pages further back are partly
// see-through. A violet wave runs along the bottom.
// 'node scripts/build-yoga-cover.mjs' builds the light cover; add 'dark' for the dark version.
// Sources: design-exports/yoga-{home,pricing,about}.png (Figma, credits masked),
// public/images/logos/open-door-yoga.png
// Output: public/images/projects/yoga-cover.webp, or yoga-cover-dark.webp
import sharp from 'sharp'

sharp.cache(false)
const W = 1600
const H = 900
const DARK_MODE = process.argv[2] === 'dark'
const VIOLET = '#6A4E77'
const DARK = '#251B2A'
const LIGHT = '#F0EDF1'
const GREEN = '#B2C95D'
const GREEN_DARK = '#869746'
const FONT = 'Segoe UI, Arial, sans-serif'
const SERIF = 'Georgia, serif'

// colours for each version
const T = DARK_MODE
  ? { bg0: '#2b2031', bg1: '#140e17', wave0: '#4b3655', wave1: VIOLET, title: LIGHT, accent: '#C9B2D4', tagline: LIGHT, eyebrow: GREEN, button: LIGHT, buttonText: DARK, chip: '#ffffff', chipFill: 0.06, glass: '#ffffff', glassA: 0.12, edge: 0.28 }
  : { bg0: '#ffffff', bg1: LIGHT, wave0: VIOLET, wave1: DARK, title: DARK, accent: VIOLET, tagline: DARK, eyebrow: GREEN_DARK, button: VIOLET, buttonText: '#ffffff', chip: VIOLET, chipFill: 1, glass: '#ffffff', glassA: 0.42, edge: 0.75 }

const chip = (x, y, label) => {
  const w = label.length * 10.6 + 36
  const fill = DARK_MODE ? `fill="#ffffff" fill-opacity="${T.chipFill}"` : 'fill="#ffffff"'
  return { svg: `<rect x="${x}" y="${y}" width="${w}" height="40" rx="20" ${fill} stroke="${T.chip}" stroke-opacity="0.35" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" font-family="${FONT}" font-size="17" font-weight="600" fill="${T.chip}">${label.replace(/&/g, '&amp;')}</text>`, w }
}
let cx = 110
const chips = ['Heuristic review', 'Style guide', 'Pricing & About'].map((l) => {
  const c = chip(cx, 610, l)
  cx += c.w + 12
  return c.svg
}).join('')

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${T.bg0}"/><stop offset="1" stop-color="${T.bg1}"/></linearGradient>
    <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${T.wave0}"/><stop offset="1" stop-color="${T.wave1}"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- the violet wave along the bottom, rising behind the pages -->
  <path d="M0 790 C300 760 520 820 820 760 C1120 700 1300 560 1600 520 V${H} H0 Z" fill="url(#wave)"/>
  <path d="M0 830 C340 800 600 860 900 800 C1180 744 1360 640 1600 610" fill="none" stroke="${GREEN}" stroke-opacity="0.55" stroke-width="3"/>
  <!-- soft colour behind the glass, so the frosting has something to show -->
  <ellipse cx="1180" cy="330" rx="330" ry="210" fill="${DARK_MODE ? VIOLET : '#C9B2D4'}" fill-opacity="${DARK_MODE ? 0.55 : 0.45}"/>
  <ellipse cx="1420" cy="560" rx="200" ry="150" fill="${GREEN}" fill-opacity="${DARK_MODE ? 0.25 : 0.3}"/>

  <text x="110" y="222" font-family="${FONT}" font-size="16" font-weight="700" letter-spacing="3" fill="${T.eyebrow}">WEBSITE REDESIGN</text>
  <text x="106" y="306" font-family="${SERIF}" font-size="74" font-weight="700" fill="${T.title}">Open Door</text>
  <text x="106" y="390" font-family="${SERIF}" font-size="74" font-weight="700" fill="${T.accent}">Yoga</text>
  <text x="110" y="452" font-family="${FONT}" font-size="27" font-weight="600" fill="${T.tagline}">Redesigning the Open Door Yoga Website</text>
  <rect x="110" y="510" width="230" height="58" rx="29" fill="${T.button}"/>
  <text x="140" y="546" font-family="${FONT}" font-size="20" font-weight="700" fill="${T.buttonText}">View case study</text>
  <path d="M302 539 h16 m-7 -7 l7 7 -7 7" fill="none" stroke="${T.buttonText}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  ${chips}
</svg>`

// the logo: violet on the light cover, white on the dark one
async function logo(height) {
  const { data, info } = await sharp('public/images/logos/open-door-yoga.png').resize({ height }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  if (DARK_MODE) for (let i = 0; i < data.length; i += 4) data[i] = data[i + 1] = data[i + 2] = 245
  return sharp(data, { raw: info }).png().toBuffer()
}

const rounded = (w, h, r) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`)

// one frosted glass window over the canvas so far: the glass blurs and tints what's behind
// it, holds three dots in its top bar, and the page sits inside at the given opacity
async function glassWindow(canvas, src, x, y, width, pageOpacity) {
  const pad = 12, bar = 30, r = 20
  const meta = await sharp(src).metadata()
  const pageW = width - pad * 2
  const pageH = Math.round(pageW * 0.6)
  const w = width
  const h = bar + pageH + pad
  // frosted glass: blurred backdrop + white tint + a bright edge, cut to a rounded window
  const behind = await sharp(canvas).extract({ left: x, top: y, width: w, height: h }).blur(22).png().toBuffer()
  const tint = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" rx="${r}" fill="${T.glass}" fill-opacity="${T.glassA}"/>
    <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="${r}" fill="none" stroke="#ffffff" stroke-opacity="${T.edge}" stroke-width="1.5"/>
    <circle cx="${pad + 10}" cy="${bar / 2 + 2}" r="5" fill="#ffffff" fill-opacity="0.8"/><circle cx="${pad + 26}" cy="${bar / 2 + 2}" r="5" fill="#ffffff" fill-opacity="0.8"/><circle cx="${pad + 42}" cy="${bar / 2 + 2}" r="5" fill="#ffffff" fill-opacity="0.8"/>
  </svg>`)
  const glass = await sharp(behind).composite([{ input: tint }, { input: rounded(w, h, r), blend: 'dest-in' }]).png().toBuffer()
  // the page, rounded, at its opacity
  const page = await sharp(src).extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.width * 0.6) }).resize(pageW, pageH).ensureAlpha().png().toBuffer()
  const pageRounded = await sharp(page).composite([{ input: rounded(pageW, pageH, 10), blend: 'dest-in' }]).raw().toBuffer({ resolveWithObject: true })
  for (let i = 3; i < pageRounded.data.length; i += 4) pageRounded.data[i] = Math.round(pageRounded.data[i] * pageOpacity)
  const pagePng = await sharp(pageRounded.data, { raw: pageRounded.info }).png().toBuffer()
  // a soft shadow under the window
  const m = 50
  const shadow = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w + m * 2}" height="${h + m * 2}"><rect x="${m}" y="${m + 18}" width="${w}" height="${h}" rx="${r}" fill="${DARK}" fill-opacity="${DARK_MODE ? 0.45 : 0.16}"/></svg>`)).blur(22).png().toBuffer()
  return sharp(canvas)
    .composite([
      { input: shadow, left: x - m, top: y - m },
      { input: glass, left: x, top: y },
      { input: pagePng, left: x + pad, top: y + bar },
    ])
    .png()
    .toBuffer()
}

let canvas = await sharp(Buffer.from(background)).composite([{ input: await logo(34), left: 110, top: 96 }]).png().toBuffer()
// back to front: About, Pricing, then the Home page
canvas = await glassWindow(canvas, 'design-exports/yoga-about.png', 1080, 80, 470, 0.72)
canvas = await glassWindow(canvas, 'design-exports/yoga-pricing.png', 930, 165, 560, 0.86)
canvas = await glassWindow(canvas, 'design-exports/yoga-home.png', 760, 290, 660, 1)
const name = DARK_MODE ? 'yoga-cover-dark' : 'yoga-cover'
const out = await sharp(canvas).webp({ quality: 90 }).toFile(`public/images/projects/${name}.webp`)
console.log(name, out.width, out.height)
