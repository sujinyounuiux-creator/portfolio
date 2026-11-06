// PROFITKEY stock detail screen: moves the Stock Analysis / Community tabs above the stock name
// block, as on the Community page, and swaps the grey default icon for the member's photo
// (the same one used in the Portfolio Figma file, node 355:2951). The rest of the page stays put,
// so the crops taken from it (crop-profitkey-features) still line up.
// Source: design-exports/profitkey-figma/web-detail-before.webp, mia-avatar.jpg
// Output: public/images/screens/profitkey-web-detail.webp, plus a PNG for Figma beside the source.
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const dir = 'design-exports/profitkey-figma'
const WIDTH = 1400
const before = await sharp(`${dir}/web-detail-before.webp`).flatten({ background: '#fff' }).png().toBuffer()
const cut = (top, height) => sharp(before).extract({ left: 0, top, width: WIDTH, height }).png().toBuffer()

const AVATAR = { left: 1245, top: 13, size: 44 } // where the default icon sits
const RING = 4 // pixels of white cleared around it, for the icon's soft edge
const circle = (d) => Buffer.from(`<svg width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="#fff"/></svg>`)
const photo = await sharp(`${dir}/mia-avatar.jpg`)
  .resize(AVATAR.size, AVATAR.size)
  .composite([{ input: circle(AVATAR.size), blend: 'dest-in' }])
  .png()
  .toBuffer()

const clear = await sharp({ create: { width: WIDTH, height: 235, channels: 3, background: '#fff' } }).png().toBuffer()
const clearIcon = await sharp({ create: { width: AVATAR.size + RING * 2, height: AVATAR.size + RING * 2, channels: 3, background: '#fff' } }).png().toBuffer()

const out = await sharp(before)
  .composite([
    { input: clear, left: 0, top: 100 },
    { input: await cut(270, 48), left: 0, top: 115 }, // the tabs: text at 120, line down to 158
    { input: await cut(140, 108), left: 0, top: 195 }, // the KOSPI label and stock name
    { input: clearIcon, left: AVATAR.left - RING, top: AVATAR.top - RING },
    { input: photo, left: AVATAR.left, top: AVATAR.top },
  ])
  .png()
  .toBuffer()

writeFileSync(`${dir}/web-detail-after.png`, out)
writeFileSync('public/images/screens/profitkey-web-detail.webp', await sharp(out).webp({ quality: 90 }).toBuffer())
console.log('done')
