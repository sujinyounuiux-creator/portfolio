// Puts the realigned key indicator table on the PROFITKEY stock detail screen. The table is
// Frame 357 (164:3078) in the Portfolio Figma file, exported at 4x to
// design-exports/profitkey-figma/indicator-table.png; it replaces the same area of the screen.
// Run this after prepare-screens / trim-profitkey-screens, and before crop-profitkey-features.
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const SCREEN = 'public/images/screens/profitkey-web-detail.webp'
const BOX = { left: 103, top: 339, width: 574, height: 306 } // where the table sits on the 1400 px screen
const table = await sharp('design-exports/profitkey-figma/indicator-table.png')
  .flatten({ background: '#ffffff' })
  .resize(BOX.width, BOX.height, { fit: 'fill' })
  .png()
  .toBuffer()
const out = await sharp(SCREEN).composite([{ input: table, left: BOX.left, top: BOX.top }]).webp({ quality: 90 }).toBuffer()
writeFileSync(SCREEN, out)
console.log('table placed')
