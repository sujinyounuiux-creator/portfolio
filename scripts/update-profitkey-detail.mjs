// PROFITKEY stock detail screen, which exists only as an image on the site (the editable English
// frame is Stock Detail, 505:3075, in the Portfolio Figma file):
// - the header is the standard one, taken from the Community screen, with the member's photo
// - the Stock Analysis / Community tabs sit above the stock name, placed as on the Community page
// The rest of the page stays put, so the crops taken from it (crop-profitkey-features) line up.
// Also prepares the Home screen.
// Sources: design-exports/profitkey-figma/web-detail-before.webp, web-home.png
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const dir = 'design-exports/profitkey-figma'
const screens = 'public/images/screens'
const WIDTH = 1400
const HEADER = 84 // the standard header's height, with its line
const white = (width, height) => sharp({ create: { width, height, channels: 3, background: '#fff' } }).png().toBuffer()

// ---- stock detail
const before = await sharp(`${dir}/web-detail-before.webp`).flatten({ background: '#fff' }).png().toBuffer()
const cut = (top, height, left = 0, width = WIDTH) => sharp(before).extract({ left, top, width, height }).png().toBuffer()
const header = await sharp(`${screens}/profitkey-en-community.webp`).flatten({ background: '#fff' }).extract({ left: 0, top: 0, width: WIDTH, height: HEADER }).png().toBuffer()

const detail = await sharp(before)
  .composite([
    { input: await white(WIDTH, 335), left: 0, top: 0 },
    { input: header, left: 0, top: 0 },
    { input: await cut(270, 48), left: 0, top: 123 }, // the tabs: text at 128, line down to 166
    // the Community label sat 4px lower than Stock Analysis: line them up
    { input: await white(200, 30), left: 920, top: 126 },
    { input: await cut(275, 28, 920, 200), left: 920, top: 124 },
    { input: await cut(140, 108), left: 0, top: 198 }, // the KOSPI label and stock name
  ])
  .png()
  .toBuffer()
writeFileSync(`${dir}/web-detail-after.png`, detail)
writeFileSync(`${screens}/profitkey-web-detail.webp`, await sharp(detail).webp({ quality: 90 }).toBuffer())

// ---- home: exported whole from Figma (165:3148), cropped in from its drop shadow to the white page
const { data, info } = await sharp(`${dir}/web-home.png`).flatten({ background: '#808080' }).raw().toBuffer({ resolveWithObject: true })
const isWhite = (x, y) => {
  const i = (y * info.width + x) * info.channels
  return data[i] >= 254 && data[i + 1] >= 254 && data[i + 2] >= 254
}
const midY = 20 // beside the header, where the page is white
const midX = Math.round(info.width * 0.1)
let left = 0
while (!isWhite(left, midY)) left++
let right = info.width - 1
while (!isWhite(right, midY)) right--
let top = 0
while (!isWhite(midX, top)) top++
let bottom = info.height - 1
while (!isWhite(midX, bottom)) bottom--
const homeOut = await sharp(`${dir}/web-home.png`)
  .flatten({ background: '#fff' })
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .resize({ width: WIDTH })
  .webp({ quality: 90 })
  .toFile(`${screens}/profitkey-web-home.webp`)
console.log('home', homeOut.width, homeOut.height, { left, top, right, bottom }, info.width, info.height)

// ---- error pages: exist only as images, so they take the standard header from the Home screen
const errorHeader = await sharp(`${screens}/profitkey-web-home.webp`).flatten({ background: '#fff' }).extract({ left: 0, top: 0, width: WIDTH, height: HEADER }).resize({ width: 944 }).png().toBuffer()
const errorHeaderHeight = (await sharp(errorHeader).metadata()).height
for (const name of ['404', '500']) {
  const page = await sharp(`${dir}/error-${name}-before.webp`)
    .flatten({ background: '#fff' })
    .composite([
      { input: await white(944, errorHeaderHeight + 3), left: 0, top: 0 },
      { input: errorHeader, left: 0, top: 0 },
    ])
    .png()
    .toBuffer()
  writeFileSync(`${screens}/profitkey-${name}.webp`, await sharp(page).webp({ quality: 90 }).toBuffer())
}

// ---- stock detail: the quarterly table's headers had 2025.02 twice. Make the last two read
// 2025.03 and 2025.04 by swapping their final digit, using glyphs from the table itself.
{
  const file = `${screens}/profitkey-web-detail.webp`
  const page = await sharp(file).removeAlpha().png().toBuffer()
  const glyph = (left) => sharp(page).extract({ left, top: 1100, width: 11, height: 28 }).png().toBuffer()
  const three = await glyph(1256) // the "3" of 2025.03, on white
  const four = await sharp(await glyph(409)).linear(255 / 243, 0).png().toBuffer() // the "4" of 2024.09, grey lifted to white
  const fill = (rgb) => sharp({ create: { width: 11, height: 28, channels: 3, background: rgb } }).png().toBuffer()
  const fixed = await sharp(page)
    .composite([
      { input: await fill({ r: 243, g: 243, b: 243 }), left: 1146, top: 1100 },
      { input: three, left: 1146, top: 1100, blend: 'multiply' },
      { input: await fill({ r: 255, g: 255, b: 255 }), left: 1256, top: 1100 },
      { input: four, left: 1256, top: 1100 },
    ])
    .webp({ quality: 90 })
    .toBuffer()
  writeFileSync(file, fixed)
}

// ---- stock detail: the Fiscal Year End row now follows the months above it (Dec year end):
// 2024.12 under the 2024 months and 2025.12 under the 2025 months. Glyphs come from the row itself.
{
  const file = `${screens}/profitkey-web-detail.webp`
  const page = await sharp(file).removeAlpha().png().toBuffer()
  const TOP = 1164
  const H = 30
  const five = await sharp(page).extract({ left: 409, top: TOP, width: 11, height: H }).png().toBuffer() // the "5" of 2025.01
  const cell2024 = await sharp(page).extract({ left: 494, top: TOP, width: 72, height: H }).png().toBuffer() // "2024.12"
  const white = (w) => sharp({ create: { width: w, height: H, channels: 3, background: '#fff' } }).png().toBuffer()
  const layers = [
    { input: await white(76), left: 374, top: TOP },
    { input: cell2024, left: 376, top: TOP },
  ]
  for (const [left, up] of [[885, 0], [1003, 0], [1119, 0], [1230, 6]]) {
    layers.push({ input: await white(11), left, top: TOP - up }, { input: five, left, top: TOP - up }) // the last column sits 6px higher
  }
  writeFileSync(file, await sharp(page).composite(layers).webp({ quality: 90 }).toBuffer())
}

// ---- stock detail: the last column of the quarterly table now matches the others: a grey header
// like its neighbours, and its values moved 6px down onto the same lines.
{
  const file = `${screens}/profitkey-web-detail.webp`
  const page = await sharp(file).removeAlpha().png().toBuffer()
  const X = 1173
  const WIDTH_COL = 126
  const header = await sharp(page).extract({ left: X, top: 1088, width: WIDTH_COL, height: 60 }).png().toBuffer()
  const values = await sharp(page).extract({ left: X, top: 1150, width: WIDTH_COL, height: 546 }).png().toBuffer()
  const fill = (h, v) => sharp({ create: { width: WIDTH_COL, height: h, channels: 3, background: { r: v, g: v, b: v } } }).png().toBuffer()
  const fixed = await sharp(page)
    .composite([
      { input: await fill(60, 243), left: X, top: 1088 },
      { input: header, left: X, top: 1088, blend: 'multiply' },
      { input: await fill(552, 255), left: X, top: 1150 },
      { input: values, left: X, top: 1156 },
    ])
    .webp({ quality: 90 })
    .toBuffer()
  writeFileSync(file, fixed)
}

// ---- stock detail: Apple is listed on NASDAQ, not KOSPI. The label is exported from the
// Stock Detail frame in Figma (505:3099) at the screen's scale and placed over the old one.
{
  const file = `${screens}/profitkey-web-detail.webp`
  const page = await sharp(file).removeAlpha().png().toBuffer()
  const label = await sharp(`${dir}/label-nasdaq.png`).png().toBuffer()
  const clear = await sharp({ create: { width: 130, height: 36, channels: 3, background: '#fff' } }).png().toBuffer()
  const fixed = await sharp(page)
    .composite([
      { input: clear, left: 100, top: 203 },
      { input: label, left: 104, top: 207 },
    ])
    .webp({ quality: 90 })
    .toBuffer()
  writeFileSync(file, fixed)
}
