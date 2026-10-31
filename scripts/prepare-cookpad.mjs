// Cuts the Cookpad icon set (two rows in the Portfolio file's "Design" frame) into
// individual transparent-free PNG tiles, and prepares the clean UI exports used in
// the Cookpad case study (wireframes, search bar + filter panel, comments, devices).
// Source: design-exports/cookpad/* → public/images/cookpad/*
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const SRC = 'design-exports/cookpad'
const OUT = 'public/images/cookpad'
mkdirSync(OUT, { recursive: true })

// x position of each icon inside its row (from Figma). Each icon is cut over the full row
// height, trimmed to its own ink, then centred at its
// native size on one shared square tile, so no icon is clipped and stroke weights match.
const rows = {
  'icons-row1.svg': [0, 109, 226, 343, 460, 577],
  'icons-row2.svg': [0, 117, 234, 351, 468, 585],
}
const SCALE = 4
const TILE = 52 * SCALE
let n = 1
for (const [file, xs] of Object.entries(rows)) {
  const row = await sharp(`${SRC}/${file}`, { density: 72 * SCALE }).flatten({ background: '#ffffff' }).png().toBuffer()
  const { width: rw, height: rh } = await sharp(row).metadata()
  for (const [i, x] of xs.entries()) {
    // cut halfway into the gaps: some icons are drawn a little past their Figma box
    const left = i > 0 ? (x - 20) * SCALE : 0
    const right = i < xs.length - 1 ? (xs[i + 1] - 20) * SCALE : rw
    const cell = await sharp(row).extract({ left, top: 0, width: right - left, height: rh }).png().toBuffer()
    // bounding box of the icon's ink (anything clearly darker than white)
    const { data, info } = await sharp(cell).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1
    for (let yy = 0; yy < info.height; yy++)
      for (let xx = 0; xx < info.width; xx++) {
        const k = (yy * info.width + xx) * 3
        if (Math.min(data[k], data[k + 1], data[k + 2]) < 235) {
          x0 = Math.min(x0, xx); y0 = Math.min(y0, yy); x1 = Math.max(x1, xx); y1 = Math.max(y1, yy)
        }
      }
    const icon = await sharp(cell).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toBuffer({ resolveWithObject: true })
    await sharp({ create: { width: TILE, height: TILE, channels: 3, background: '#ffffff' } })
      .composite([{ input: icon.data, left: Math.round((TILE - icon.info.width) / 2), top: Math.round((TILE - icon.info.height) / 2) }])
      .png()
      .toFile(`${OUT}/icon-${n}.png`)
    n++
  }
}

// pad: white margin (px) added around a tight crop, so the panel doesn't touch the image edge
const webp = (src, out, width, pad = 0) =>
  sharp(`${SRC}/${src}`)
    .resize({ width: width - pad * 2, withoutEnlargement: true })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#ffffff' })
    .webp({ quality: 88 })
    .toFile(`${OUT}/${out}.webp`)
for (const [src, out, w, pad] of [
  ['wireframes.png', 'wireframes', 1600],
  ['filter-panel.png', 'filter-panel', 1600, 56],
  ['search-bar.png', 'search-bar', 1600],
  ['comments.png', 'comments', 1400, 56],
  ['devices.png', 'devices', 1600],
]) {
  const i = await webp(src, out, w, pad)
  console.log(out, i.width, i.height)
}

// search bar: make the white area around the bar transparent (flood fill from the edges),
// so it sits straight on the page; the white inside the input box stays
{
  const { data, info } = await sharp(`${SRC}/search-bar.png`).resize({ width: 1600, withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const light = (k) => Math.min(data[k], data[k + 1], data[k + 2]) >= 236
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
  while (stack.length) {
    const p = stack.pop()
    if (seen[p] || !light(p * 4)) continue
    seen[p] = 1
    const x = p % w
    if (x > 0) stack.push(p - 1)
    if (x < w - 1) stack.push(p + 1)
    if (p >= w) stack.push(p - w)
    if (p < w * (h - 1)) stack.push(p + w)
  }
  for (let p = 0; p < w * h; p++) {
    if (!seen[p]) continue
    // fully white goes clear; near-white anti-aliased edges keep a little opacity
    const m = Math.min(data[p * 4], data[p * 4 + 1], data[p * 4 + 2])
    data[p * 4 + 3] = Math.round(((255 - m) / 19) * 255) > 255 ? 255 : Math.round(((255 - m) / 19) * 255)
  }
  const i = await sharp(data, { raw: info }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/search-bar.webp`)
  console.log('search-bar (transparent)', i.width, i.height)
}
