// Full length phone and iPad pages for the zoom view, so a click on a phone or iPad screen opens
// the whole page and you can scroll it. In Figma these pages sit inside a "Scroll" frame that clips
// everything below the first screen, so the page frames were copied to a temporary page (since
// deleted), and their sections exported one by one at 1.5x into
// design-exports/bca/full-parts/<name>/<x>_<y>_<w>_<h>.png (position and size in the page frame).
// The page's navigation header goes on top: for phones it is cut from the 2x iPhone frame export,
// for iPads it is the exported Fixed header (full-parts/<name>-header.png).
// Sources: iPhone 1392:5436 (events month), 1392:7637 (list your business), 1392:8682 (get involved),
// 1392:10122 (guides); iPad 1392:11105 (home), 1392:13857 (events month), 1392:14940 (business)
// Output: public/images/projects/bca-full-<name>.webp (phones 585 wide, iPads 1100 wide)
import { readdirSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const S = 1.5
const GREEN = '#00261c'
const PAGES = {
  'm-events-month': { w: 390, h: 4981, bg: GREEN, phone: 'm-events-month' },
  'm-list-business': { w: 390, h: 5676, bg: '#ffffff', phone: 'm-list-business' },
  'm-involved': { w: 390, h: 4328, bg: GREEN, phone: 'm-involved' },
  'm-guides': { w: 390, h: 3573, bg: GREEN, phone: 'm-guides' },
  'ipad-home': { w: 834, h: 11241, bg: GREEN },
  'ipad-events-month': { w: 834, h: 4503, bg: GREEN },
  'ipad-business': { w: 834, h: 4703, bg: GREEN },
}

for (const [name, p] of Object.entries(PAGES)) {
  const W = Math.round(p.w * S)
  // header: phones keep the nav bar from the frame export (2x: screen at 40,34; nav at 108..222)
  const header = p.phone
    ? await sharp(`design-exports/bca/${p.phone}.png`).extract({ left: 40, top: 34 + 108, width: 780, height: 114 }).resize(W).png().toBuffer()
    : await sharp({ create: { width: W, height: Math.round(65 * S), channels: 4, background: GREEN } })
        .composite([{ input: `design-exports/bca/full-parts/${name.replace('ipad-', 'ipad-')}-header.png`, left: 0, top: 0 }])
        .png()
        .toBuffer()
  const hh = (await sharp(header).metadata()).height
  const dir = `design-exports/bca/full-parts/${name.replace(/^m-/, '')}`
  const parts = [{ input: header, left: 0, top: 0 }]
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
    const [x, y] = file.replace('.png', '').split('_').map(Number)
    parts.push({ input: `${dir}/${file}`, left: Math.round(x * S), top: hh + Math.round(y * S) })
  }
  const H = hh + Math.round(p.h * S)
  const full = await sharp({ create: { width: W, height: H, channels: 3, background: p.bg } })
    .composite(parts)
    .png()
    .toBuffer()
  // iPads are saved at 1100 wide (the iPad home page is otherwise too tall for WebP)
  const out = await sharp(full, { limitInputPixels: false })
    .resize({ width: p.phone ? W : 1100 })
    .webp({ quality: 84 })
    .toFile(`public/images/projects/bca-full-${name}.webp`)
  console.log(name, parts.length - 1, 'parts ->', out.width, out.height, Math.round(out.size / 1024) + ' KB')
}
