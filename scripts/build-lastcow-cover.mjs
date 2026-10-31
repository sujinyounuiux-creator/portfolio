// LastCow cover, in the style of an app landing page: a plain brand purple band with the
// cow logo in its own purple on a white tile, the name and tagline in white, and three real hi fi screens (Home, Event details, Ticket calendar)
// in the iPhone frame, the middle one raised, overlapping the band's lower edge. Two UI
// cards cut from the same screens (an event with its 24 hour price change, and the Get
// Tickets bar) float beside the phones, and faint ticket outlines like the logo's sit
// in the band.
// Sources: design-exports/logos/lastcow.png (Figma 1688:3397), design-exports/logos/lastcow-icon.png
// (the cow icon on white, from Sujin), public/images/screens/
// lastcow-*-hifi.webp, public/images/mockups/iphone(.webp|-mask.png) and src/data/mockups.json
// Output: public/images/projects/lastcow-cover.webp (1600 x 900)
// The cover uses a white top and a purple bottom; 'node scripts/build-lastcow-cover.mjs dark'
// builds the earlier purple-top version as lastcow-cover-dark.webp instead.
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const W = 1600
const H = 900
const PURPLE = '#3103b1'
const BAND = 455 // where the band ends
const LIGHT = process.argv[2] !== 'dark' // white top, purple bottom (the default)
const mock = JSON.parse(readFileSync('src/data/mockups.json', 'utf8')).iphone

// the wordmark in white (the logo's right part, after the icon): each pixel's strength =
// how far it is from the logo's lavender background
async function wordmark(height, colour = [255, 255, 255]) {
  const { data, info } = await sharp('design-exports/logos/lastcow.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const bg = [data[0], data[1], data[2]]
  const ink = [0x31, 0x03, 0xb1]
  const full = Math.hypot(ink[0] - bg[0], ink[1] - bg[1], ink[2] - bg[2])
  for (let i = 0; i < data.length; i += 4) {
    const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2])
    data[i + 3] = Math.round(Math.min(1, d / full) * 255)
    data[i] = colour[0]
    data[i + 1] = colour[1]
    data[i + 2] = colour[2]
  }
  const word = await sharp(data, { raw: info }).extract({ left: 440, top: 0, width: info.width - 440, height: info.height }).png().toBuffer()
  return sharp(word).trim().resize({ height }).png().toBuffer()
}

// the cow icon in its own colours on a white rounded tile
async function iconTile(size, edge = false) {
  const icon = await sharp('design-exports/logos/lastcow-icon.png').flatten({ background: '#ffffff' }).trim({ background: '#ffffff', threshold: 20 }).resize({ width: Math.round(size * 0.86), height: Math.round(size * 0.86), fit: 'inside' }).png().toBuffer()
  const m = await sharp(icon).metadata()
  const tile = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect x="1.5" y="1.5" width="${size - 3}" height="${size - 3}" rx="${size * 0.24}" fill="#ffffff"${edge ? ' stroke="#d9d0fa" stroke-width="3"' : ''}/></svg>`)
  return sharp(tile).composite([{ input: icon, left: Math.round((size - m.width) / 2), top: Math.round((size - m.height) / 2) }]).png().toBuffer()
}

// one phone: the screen masked to the display's shape, the frame on top
async function phone(screen, height) {
  const w = Math.round((height * mock.width) / mock.height)
  const frame = await sharp('public/images/mockups/iphone.webp').resize(w, height).png().toBuffer()
  const mask = await sharp('public/images/mockups/iphone-mask.png').resize(w, height).extractChannel(3).raw().toBuffer()
  const s = mock.screen
  const box = {
    left: Math.round(((s.left - 0.4) / 100) * w),
    top: Math.round(((s.top - 0.4) / 100) * height),
    width: Math.round(((s.width + 0.8) / 100) * w),
    height: Math.round(((s.height + 0.8) / 100) * height),
  }
  const shot = await sharp(`public/images/screens/${screen}.webp`).resize(box.width, box.height, { fit: 'cover', position: 'top' }).png().toBuffer()
  // screen on dark glass, then cut to the display's shape with the mask (step by step:
  // sharp can't composite and swap the alpha channel in one pipeline)
  const { data: flat, info } = await sharp({ create: { width: w, height, channels: 3, background: '#0c0c0d' } })
    .composite([{ input: shot, left: box.left, top: box.top }])
    .raw()
    .toBuffer({ resolveWithObject: true })
  const c = info.channels // 3 or 4, depending on the composited input
  const rgba = Buffer.alloc(w * height * 4)
  for (let i = 0; i < w * height; i++) {
    rgba[i * 4] = flat[i * c]
    rgba[i * 4 + 1] = flat[i * c + 1]
    rgba[i * 4 + 2] = flat[i * c + 2]
    rgba[i * 4 + 3] = mask[i]
  }
  const layer = await sharp(rgba, { raw: { width: w, height, channels: 4 } }).png().toBuffer()
  return { buf: await sharp(layer).composite([{ input: frame }]).png().toBuffer(), w, h: height }
}

// a real piece of a screen on a white floating card
async function uiCard(screen, crop, width) {
  const piece = await sharp(`public/images/screens/${screen}.webp`).extract(crop).resize({ width: width - 36 }).png().toBuffer()
  const m = await sharp(piece).metadata()
  const h = m.height + 36
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}"><rect width="${width}" height="${h}" rx="18" fill="#ffffff"/></svg>`
  const card = await sharp(Buffer.from(svg)).composite([{ input: piece, left: 18, top: 18 }]).png().toBuffer()
  return { buf: card, w: width, h }
}

// a soft shadow shaped like the phone, below and a little to the right
async function shadow(w, h, radius = w * 0.14) {
  const pad = 60
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w + pad * 2}" height="${h + pad * 2}"><rect x="${pad + 6}" y="${pad + 22}" width="${w - 12}" height="${h - 10}" rx="${radius}" fill="#1b1036" fill-opacity="0.32"/></svg>`
  return { buf: await sharp(Buffer.from(svg)).blur(26).png().toBuffer(), pad }
}

// a ticket outline like the one in the logo: notched sides and a dashed tear line
const ticket = (x, y, w, h, rot, colour = '#ffffff', opacity = 0.14, width = 3) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})" fill="none" stroke="${colour}" stroke-opacity="${opacity}" stroke-width="${width}">
  <path d="M${x + 18} ${y} H${x + w - 18} Q${x + w} ${y} ${x + w} ${y + 18} V${y + h / 2 - 22} A22 22 0 0 0 ${x + w} ${y + h / 2 + 22} V${y + h - 18} Q${x + w} ${y + h} ${x + w - 18} ${y + h} H${x + 18} Q${x} ${y + h} ${x} ${y + h - 18} V${y + h / 2 + 22} A22 22 0 0 0 ${x} ${y + h / 2 - 22} V${y + 18} Q${x} ${y} ${x + 18} ${y} Z"/>
  <path d="M${x + w * 0.28} ${y + 14} V${y + h - 14}" stroke-dasharray="10 10"/>
</g>`

// background: the purple band with a soft light sweep and faint tickets, light lavender below
const darkBg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3d10c4"/><stop offset="1" stop-color="${PURPLE}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#f7f5fd"/>
  <rect width="${W}" height="${BAND}" fill="url(#band)"/>
  <path d="M0 0 H620 L240 ${BAND} H0 Z" fill="#ffffff" fill-opacity="0.05"/>
  <path d="M1180 0 H1600 V${BAND} H900 Z" fill="#ffffff" fill-opacity="0.04"/>
  ${ticket(70, 120, 250, 140, -12)}
  ${ticket(1290, 70, 230, 130, 10)}
  <text x="${W / 2}" y="222" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="#ffffff">Last tickets. Best prices.</text>
  <text x="${W / 2}" y="264" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#ffffff" fill-opacity="0.78">Last minute deals on live events</text>
</svg>`

// the reverse: white top with the logo, tagline and faint purple tickets; purple below
const lightBg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3d10c4"/><stop offset="1" stop-color="${PURPLE}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect y="${BAND}" width="${W}" height="${H - BAND}" fill="url(#band)"/>
  <path d="M0 ${BAND} H520 L300 ${H} H0 Z" fill="#ffffff" fill-opacity="0.05"/>
  <path d="M1220 ${BAND} H1600 V${H} H1000 Z" fill="#ffffff" fill-opacity="0.04"/>
  ${ticket(70, 120, 250, 140, -12, PURPLE, 0.28, 3.5)}
  ${ticket(1290, 70, 230, 130, 10, PURPLE, 0.28, 3.5)}
  <text x="${W / 2}" y="222" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="${PURPLE}">Last tickets. Best prices.</text>
  <text x="${W / 2}" y="264" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#2a2340" fill-opacity="0.72">Last minute deals on live events</text>
</svg>`
const bg = Buffer.from(LIGHT ? lightBg : darkBg)

const TILE = 112
// on white the tile would vanish, so there it gets a soft purple edge
const tile = await iconTile(TILE, LIGHT)
const word = await wordmark(62, LIGHT ? [0x31, 0x03, 0xb1] : [255, 255, 255])
const wordMeta = await sharp(word).metadata()
const GAP = 26
const logoW = TILE + GAP + wordMeta.width
const logoX = Math.round(W / 2 - logoW / 2)
const center = await phone('lastcow-home-hifi', 580)
const left = await phone('lastcow-event-hifi', 490)
const right = await phone('lastcow-calendar-hifi', 490)
const cx = W / 2
const layers = [
  { input: tile, left: logoX, top: 46 },
  { input: word, left: logoX + TILE + GAP, top: 46 + Math.round((TILE - wordMeta.height) / 2) },
]
for (const [p, x, y] of [
  [left, cx - 330 - left.w / 2, 330],
  [right, cx + 330 - right.w / 2, 330],
  [center, cx - center.w / 2, 290],
]) {
  const sh = await shadow(p.w, p.h)
  layers.push({ input: sh.buf, left: Math.round(x - sh.pad), top: Math.round(y - sh.pad) })
  layers.push({ input: p.buf, left: Math.round(x), top: Math.round(y) })
}
// floating UI cards, cut from the real screens
const priceCard = await uiCard('lastcow-home-hifi', { left: 40, top: 528, width: 520, height: 120 }, 330)
const ticketsCard = await uiCard('lastcow-event-hifi', { left: 20, top: 1172, width: 560, height: 92 }, 330)
for (const [c, x, y] of [
  [priceCard, 150, 600],
  [ticketsCard, 1120, 640],
]) {
  const sh = await shadow(c.w, c.h, 18)
  layers.push({ input: sh.buf, left: Math.round(x - sh.pad), top: Math.round(y - sh.pad) })
  layers.push({ input: c.buf, left: x, top: y })
}
const flat = await sharp(bg).composite(layers).png().toBuffer()
const out = await sharp(flat).extract({ left: 0, top: 0, width: W, height: H }).webp({ quality: 90 }).toFile(`public/images/projects/lastcow-cover${LIGHT ? '' : '-dark'}.webp`)
console.log('lastcow-cover', out.width, out.height)
