// Project logos for the previous / next cards at the end of each case study.
// Sources in design-exports/logos/ (exported from the Figma files at 2x):
//   profitkey.png  Portfolio file, PROFITKEY cover logo (group 1:2520)
//   lastcow.png    LastCow file, onboarding logo (1688:3397)
//   yoga.png       Open Door Yoga file, Logo component (112:278)
//   cookpad.png    cut from the Cookpad home page export (design-exports/cookpad-main.png)
// The background around each logo is made transparent by flood filling from the edges
// (so white parts inside a logo, like the chef's hat, stay white), then trimmed. The Yoga
// logo is one colour on dark grey, grey that also fills its letters, so it is lifted off
// the grey instead: each pixel becomes the logo purple at the strength it differs from grey.
// Output: public/images/logos/<slug>.png, 160 px tall
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
mkdirSync('public/images/logos', { recursive: true })

const logos = { profitkey: 'profitkey', lastcow: 'lastcow', 'open-door-yoga': 'yoga', cookpad: 'cookpad' }
const TOL = 40 // how far a pixel may differ from the background colour and still count as background

const ONE_COLOUR = { yoga: [0x6a, 0x4e, 0x77] } // logo colour (Violet in the Yoga style guide)

for (const [slug, file] of Object.entries(logos)) {
  const { data, info } = await sharp(`design-exports/logos/${file}.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  if (ONE_COLOUR[file]) {
    const ink = ONE_COLOUR[file]
    const bg = [data[0], data[1], data[2]]
    const full = Math.hypot(ink[0] - bg[0], ink[1] - bg[1], ink[2] - bg[2])
    for (let i = 0; i < data.length; i += 4) {
      const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2])
      data[i] = ink[0]
      data[i + 1] = ink[1]
      data[i + 2] = ink[2]
      data[i + 3] = Math.round(Math.min(1, d / full) * (data[i + 3] / 255) * 255)
    }
    const out = await sharp(data, { raw: info }).trim().resize({ height: 160 }).png().toFile(`public/images/logos/${slug}.png`)
    console.log(slug, out.width, out.height)
    continue
  }
  const at = (x, y) => (y * w + x) * 4
  const bg = data.slice(0, 4) // top left corner
  const isBg = (i) => data[i + 3] < 10 || Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) < TOL
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1])
  for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y])
  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= w || y >= h || seen[y * w + x]) continue
    seen[y * w + x] = 1
    const i = at(x, y)
    if (!isBg(i)) continue
    data[i + 3] = 0
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
  const out = await sharp(data, { raw: info }).trim().resize({ height: 160 }).png().toFile(`public/images/logos/${slug}.png`)
  console.log(slug, out.width, out.height)
}
