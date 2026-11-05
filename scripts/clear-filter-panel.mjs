// Removes the white background baked into the Cookpad filter panel: crops to the panel's own
// outline and turns white into transparency, so the panel sits straight on the page.
// public/images/cookpad/filter-panel.webp, safe to run again (it flattens on white first).
import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const path = 'public/images/cookpad/filter-panel.webp'
sharp.cache(false)
const { data, info } = await sharp(readFileSync(path))
  .flatten({ background: '#fff' })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

// the box around everything that is clearly not white
let left = info.width
let right = 0
let top = info.height
let bottom = 0
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3
    if (Math.min(data[i], data[i + 1], data[i + 2]) < 200) {
      left = Math.min(left, x)
      right = Math.max(right, x)
      top = Math.min(top, y)
      bottom = Math.max(bottom, y)
    }
  }
}

// white to transparent: each pixel keeps its colour, with white taken out as alpha
const w = right - left + 1
const h = bottom - top + 1
const rgba = Buffer.alloc(w * h * 4)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = ((y + top) * info.width + x + left) * 3
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
    const a = 255 - Math.min(r, g, b)
    const o = (y * w + x) * 4
    if (a > 0) {
      rgba[o] = Math.round((r - (255 - a)) * (255 / a))
      rgba[o + 1] = Math.round((g - (255 - a)) * (255 / a))
      rgba[o + 2] = Math.round((b - (255 - a)) * (255 / a))
    }
    rgba[o + 3] = a
  }
}
const out = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toBuffer()
writeFileSync(path, out)
console.log(`${w} x ${h}`)
