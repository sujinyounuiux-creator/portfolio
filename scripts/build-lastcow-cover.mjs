// LastCow cover, in the style of an app landing page: a brand purple band with the logo
// and tagline in white, and three real hi fi screens (Home, Event details, Ticket calendar)
// in the iPhone frame, the middle one raised, overlapping the band's lower edge.
// Sources: design-exports/logos/lastcow.png (Figma 1688:3397), public/images/screens/
// lastcow-*-hifi.webp, public/images/mockups/iphone(.webp|-mask.png) and src/data/mockups.json
// Output: public/images/projects/lastcow-cover.webp (1600 x 900)
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const W = 1600
const H = 900
const PURPLE = '#3103b1'
const BAND = 455 // height of the purple band
const mock = JSON.parse(readFileSync('src/data/mockups.json', 'utf8')).iphone

// logo in white: each pixel's strength = how far it is from the logo's lavender background
async function whiteLogo(height) {
  const { data, info } = await sharp('design-exports/logos/lastcow.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const bg = [data[0], data[1], data[2]]
  const ink = [0x31, 0x03, 0xb1]
  const full = Math.hypot(ink[0] - bg[0], ink[1] - bg[1], ink[2] - bg[2])
  for (let i = 0; i < data.length; i += 4) {
    const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2])
    data[i + 3] = Math.round(Math.min(1, d / full) * 255)
    data[i] = data[i + 1] = data[i + 2] = 255
  }
  return sharp(data, { raw: info }).trim().resize({ height }).png().toBuffer()
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

// a soft shadow shaped like the phone, below and a little to the right
async function shadow(w, h) {
  const pad = 60
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w + pad * 2}" height="${h + pad * 2}"><rect x="${pad + 6}" y="${pad + 22}" width="${w - 12}" height="${h - 10}" rx="${w * 0.14}" fill="#1b1036" fill-opacity="0.32"/></svg>`
  return { buf: await sharp(Buffer.from(svg)).blur(26).png().toBuffer(), pad }
}

// background: the purple band with soft decorative rings and dots, white below
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3d10c4"/><stop offset="1" stop-color="${PURPLE}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#f7f5fd"/>
  <rect width="${W}" height="${BAND}" fill="url(#band)"/>
  <circle cx="150" cy="${BAND - 40}" r="120" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2"/>
  <circle cx="1470" cy="80" r="170" fill="#ffffff" fill-opacity="0.05"/>
  <circle cx="1380" cy="${BAND + 190}" r="210" fill="none" stroke="${PURPLE}" stroke-opacity="0.12" stroke-width="2"/>
  <circle cx="230" cy="${BAND + 250}" r="90" fill="${PURPLE}" fill-opacity="0.06"/>
  <circle cx="345" cy="150" r="7" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2.5"/>
  <circle cx="1240" cy="330" r="5" fill="#ffffff" fill-opacity="0.5"/>
  <text x="${W / 2}" y="206" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="#ffffff">Last tickets. Best prices.</text>
  <text x="${W / 2}" y="250" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#ffffff" fill-opacity="0.78">Last minute deals on live events</text>
</svg>`)

const logo = await whiteLogo(78)
const logoMeta = await sharp(logo).metadata()
const center = await phone('lastcow-home-hifi', 580)
const left = await phone('lastcow-event-hifi', 490)
const right = await phone('lastcow-calendar-hifi', 490)
const cx = W / 2
const layers = [{ input: logo, left: Math.round(cx - logoMeta.width / 2), top: 72 }]
for (const [p, x, y] of [
  [left, cx - 330 - left.w / 2, 330],
  [right, cx + 330 - right.w / 2, 330],
  [center, cx - center.w / 2, 290],
]) {
  const sh = await shadow(p.w, p.h)
  layers.push({ input: sh.buf, left: Math.round(x - sh.pad), top: Math.round(y - sh.pad) })
  layers.push({ input: p.buf, left: Math.round(x), top: Math.round(y) })
}
const flat = await sharp(bg).composite(layers).png().toBuffer()
const out = await sharp(flat).extract({ left: 0, top: 0, width: W, height: H }).webp({ quality: 90 }).toFile('public/images/projects/lastcow-cover.webp')
console.log('lastcow-cover', out.width, out.height)
