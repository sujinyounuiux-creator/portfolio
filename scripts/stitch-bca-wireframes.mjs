// Rebuilds the BCA wireframes sharp. Each wireframe frame is too tall to export at 2x in one go
// (Figma caps an export at 4096 px), so its top-level sections were exported one by one at 2x into
// design-exports/bca/wf-parts/<name>/<x>_<y>_<w>_<h>.png (position and size in the frame, at 1x),
// and are placed back on the frame's white background here.
// Frames (BCA-redesign Figma file): home 206:3375, events 170:3803, business 99:1669, involved 98:1361
// Output: public/images/projects/bca-wf-<name>.webp, 2160 px wide (1.5x)
import { readdirSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const FRAMES = { home: [1440, 3728], events: [1440, 3497], business: [1440, 2208], involved: [1440, 3458] }
const SCALE = 2

for (const [name, [fw, fh]] of Object.entries(FRAMES)) {
  const dir = `design-exports/bca/wf-parts/${name}`
  const parts = []
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
    const [x, y, w, h] = file.replace('.png', '').split('_').map(Number)
    const m = await sharp(`${dir}/${file}`).metadata()
    // an export with a shadow is a little bigger than the node: keep it centred on the node
    const left = Math.round(x * SCALE - (m.width - w * SCALE) / 2)
    const top = Math.round(y * SCALE - (m.height - h * SCALE) / 2)
    parts.push({ input: `${dir}/${file}`, left: Math.max(0, left), top: Math.max(0, top) })
  }
  const full = await sharp({ create: { width: fw * SCALE, height: fh * SCALE, channels: 3, background: '#ffffff' } })
    .composite(parts)
    .png()
    .toBuffer()
  const out = await sharp(full).resize({ width: 2160 }).webp({ quality: 88 }).toFile(`public/images/projects/bca-wf-${name}.webp`)
  console.log(name, parts.length, 'parts ->', out.width, out.height)
}
