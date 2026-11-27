// Puts the realigned key indicator table on the PROFITKEY stock detail screen. The table is
// hi-fi Key indicators card (576:3138; the first version was Frame 357, 164:3078) in the
// Portfolio Figma file, exported at 4x to
// design-exports/profitkey-figma/indicator-table.png; it replaces the same area of the screen.
// Run this after prepare-screens / trim-profitkey-screens, and before crop-profitkey-features.
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const SCREEN = 'public/images/screens/profitkey-web-detail.webp'
const BOX = { left: 103, top: 339, width: 574, height: 306 } // where the table sits on the 1400 px screen
// the hi-fi card (576:3138, exported at 4x) has rounded corners: cut them so the canvas grey
// the export carries in the corners doesn't show on the white page
const src = sharp('design-exports/profitkey-figma/indicator-table.png')
const { width: tw, height: th } = await src.metadata()
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${th}"><rect width="${tw}" height="${th}" rx="24" fill="#fff"/></svg>`)
const table = await sharp(await src.ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer())
  .flatten({ background: '#ffffff' })
  .resize(BOX.width, BOX.height, { fit: 'fill' })
  .png()
  .toBuffer()
const out = await sharp(SCREEN).composite([{ input: table, left: BOX.left, top: BOX.top }]).webp({ quality: 90 }).toBuffer()
writeFileSync(SCREEN, out)
console.log('table placed')
