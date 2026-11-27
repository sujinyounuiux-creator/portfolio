// Puts the hi-fi price chart and Financial Indicators table on the PROFITKEY stock detail screen.
// Sources (Portfolio Figma file, exported at 4x with the card's shadow margin around it):
//   design-exports/profitkey-figma/price-chart.png      PROFITKEY Price chart (hi-fi), 579:3138
//   design-exports/profitkey-figma/financial-table.png  PROFITKEY Financial indicators (hi-fi), 579:3183
// Each card is cut out of its shadow margin, its rounded corners are cleaned up (the export carries
// canvas grey there), and it replaces the old chart / table in the same place on the 1400 px screen.
// Run after update-profitkey-detail and fix-profitkey-table, before crop-profitkey-features.
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const SCREEN = 'public/images/screens/profitkey-web-detail.webp'
// the shadow (4 px blur, 1 px down at 1x) adds 16 px on each side at 4x, shifted 4 px down
const SIDE = 16
const TOP = 12
const BOTTOM = 20
const RADIUS = 24 // 6 px corner radius at 4x

const card = async (file, box) => {
  const meta = await sharp(file).metadata()
  const w = meta.width - 2 * SIDE
  const h = meta.height - TOP - BOTTOM
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${RADIUS}" fill="#fff"/></svg>`)
  const cut = await sharp(file).extract({ left: SIDE, top: TOP, width: w, height: h }).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
  const input = await sharp(cut).flatten({ background: '#ffffff' }).resize(box.width, box.height, { fit: 'fill' }).png().toBuffer()
  return { input, left: box.left, top: box.top }
}

// where the old parts sat, measured on the 1400 px screen: the chart between the key
// indicators and the right edge, and the table under its "Financial Indicators" title
const parts = [
  await card('design-exports/profitkey-figma/price-chart.png', { left: 711, top: 300, width: 585, height: 361 }),
  await card('design-exports/profitkey-figma/financial-table.png', { left: 103, top: 1080, width: 1193, height: 622 }),
]
// clear the old chart and table first, so nothing shows around the new cards
const white = (width, height) => sharp({ create: { width, height, channels: 3, background: '#fff' } }).png().toBuffer()
const out = await sharp(SCREEN)
  .composite([
    { input: await white(600, 375), left: 700, top: 290 },
    { input: await white(1210, 632), left: 96, top: 1076 },
    ...parts,
  ])
  .webp({ quality: 90 })
  .toBuffer()
writeFileSync(SCREEN, out)
console.log('chart and financial table placed')
