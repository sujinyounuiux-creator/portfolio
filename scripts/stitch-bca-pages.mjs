// Rebuilds the BCA desktop pages sharp. Each page is too tall to export at 2x in one go (Figma
// caps an export at 4096 px), so its sections were exported one by one at 2x into
// design-exports/bca/web-parts/<name>/<x>_<y>_<w>_<h>.png (position and size in the 1440 frame).
// The old 1x export of the whole page, scaled up, goes underneath so any gap between sections
// keeps the page's own background; the sharp sections are placed on top.
// Frames (BCA-redesign Figma file, page 06): home 839:210, events 845:210, event-detail 845:666,
// businesses 848:588, list-business 848:1297, get-involved 852:1501, guides 855:2433, about 855:2176
// Output: public/images/projects/bca-web-<name>.webp, 2400 px wide
import { readdirSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const FRAMES = { home: 9183, events: 4372, 'event-detail': 4037, businesses: 4529, 'list-business': 4369, 'get-involved': 3813, guides: 3428, about: 4693 }
const S = 2
const W = 1440 * S
const OUT_W = 2400

for (const [name, fh] of Object.entries(FRAMES)) {
  const dir = `design-exports/bca/web-parts/${name}`
  const base = await sharp(`design-exports/bca/web-${name}.png`).resize(W, fh * S, { fit: 'fill' }).png().toBuffer()
  const parts = []
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
    const [x, y, w, h] = file.replace('.png', '').split('_').map(Number)
    const m = await sharp(`${dir}/${file}`).metadata()
    const left = Math.round(x * S - (m.width - w * S) / 2)
    const top = Math.round(y * S - (m.height - h * S) / 2)
    parts.push({ input: `${dir}/${file}`, left: Math.max(0, left), top: Math.max(0, top) })
  }
  const full = await sharp(base).composite(parts).png().toBuffer()
  const out = await sharp(full, { limitInputPixels: false }).resize({ width: OUT_W }).webp({ quality: 80 }).toFile(`public/images/projects/bca-web-${name}.webp`)
  console.log(name, parts.length, 'parts ->', out.width, out.height, Math.round(out.size / 1024) + ' KB')
}
