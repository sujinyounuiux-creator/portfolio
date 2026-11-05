// Removes the white background around the Cookpad filter panel: crops to the panel's own outline
// and makes everything outside it transparent, while the inside of the panel stays white.
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

const darkest = (x, y) => {
  const i = (y * info.width + x) * 3
  return Math.min(data[i], data[i + 1], data[i + 2])
}

// the box around everything that is clearly not white
let left = info.width
let right = 0
let top = info.height
let bottom = 0
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (darkest(x, y) < 200) {
      left = Math.min(left, x)
      right = Math.max(right, x)
      top = Math.min(top, y)
      bottom = Math.max(bottom, y)
    }
  }
}
const w = right - left + 1
const h = bottom - top + 1

// flood in from all four edges: light pixels reachable from outside are outside the outline
const outside = new Uint8Array(w * h)
const stack = []
const visit = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h || outside[y * w + x] || darkest(x + left, y + top) < 200) return
  outside[y * w + x] = 1
  stack.push(x, y)
}
for (let x = 0; x < w; x++) {
  visit(x, 0)
  visit(x, h - 1)
}
for (let y = 0; y < h; y++) {
  visit(0, y)
  visit(w - 1, y)
}
while (stack.length) {
  const y = stack.pop()
  const x = stack.pop()
  visit(x + 1, y)
  visit(x - 1, y)
  visit(x, y + 1)
  visit(x, y - 1)
}

// outside and the outline's outer edge: white becomes transparent. Inside: left as it is, opaque.
const isOutside = (x, y) => x >= 0 && y >= 0 && x < w && y < h && outside[y * w + x] === 1
const rgba = Buffer.alloc(w * h * 4)
let cleared = 0
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = ((y + top) * info.width + x + left) * 3
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
    const o = (y * w + x) * 4
    const edge = isOutside(x, y) || isOutside(x - 1, y) || isOutside(x + 1, y) || isOutside(x, y - 1) || isOutside(x, y + 1)
    if (edge) {
      const a = 255 - Math.min(r, g, b)
      if (a > 0) {
        rgba[o] = Math.round((r - (255 - a)) * (255 / a))
        rgba[o + 1] = Math.round((g - (255 - a)) * (255 / a))
        rgba[o + 2] = Math.round((b - (255 - a)) * (255 / a))
      }
      rgba[o + 3] = a
      cleared++
    } else {
      rgba[o] = r
      rgba[o + 1] = g
      rgba[o + 2] = b
      rgba[o + 3] = 255
    }
  }
}
const out = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toBuffer()
writeFileSync(path, out)
console.log(`${w} x ${h}, cleared ${((100 * cleared) / (w * h)).toFixed(1)}% (should be well under 5%)`)
