// PROFITKEY stock detail screen, which exists only as an image on the site (the editable English
// frame is Stock Detail, 505:3075, in the Portfolio Figma file):
// - the header is the standard one, taken from the Community screen, with the member's photo
// - the Stock Analysis / Community tabs sit above the stock name, placed as on the Community page
// The rest of the page stays put, so the crops taken from it (crop-profitkey-features) line up.
// Also puts the unified header on the Home screen (exported from Figma, 165:3569).
// Sources: design-exports/profitkey-figma/web-detail-before.webp, web-home-before.webp, home-header.png
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

// ---- home
const homeBefore = await sharp(`${dir}/web-home-before.webp`).flatten({ background: '#fff' }).png().toBuffer()
const band = await sharp(`${dir}/home-header.png`).flatten({ background: '#fff' }).resize({ width: WIDTH }).png().toBuffer()
const bandHeight = (await sharp(band).metadata()).height
const home = await sharp(homeBefore)
  .composite([
    { input: await white(WIDTH, bandHeight + 2), left: 0, top: 0 },
    { input: band, left: 0, top: 0 },
  ])
  .png()
  .toBuffer()
writeFileSync(`${screens}/profitkey-web-home.webp`, await sharp(home).webp({ quality: 90 }).toBuffer())
console.log('done, home header', bandHeight)
