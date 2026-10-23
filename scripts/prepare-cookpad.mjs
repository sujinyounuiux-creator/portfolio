// Cuts the Cookpad icon set (two rows in the Portfolio file's "Design" frame) into
// individual transparent-free PNG tiles, and prepares the clean UI exports used in
// the Cookpad case study (wireframes, search bar + filter panel, comments, devices).
// Source: design-exports/cookpad/* → public/images/cookpad/*
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const SRC = 'design-exports/cookpad'
const OUT = 'public/images/cookpad'
mkdirSync(OUT, { recursive: true })

// [x, y, w, h] of each icon inside its 42 px tall row (from Figma)
const rows = {
  'icons-row1.svg': [[0, 0, 34, 42], [109, 0, 42, 42], [226, 5, 42, 31], [343, 0, 42, 42], [460, 0, 42, 42], [577, 0, 42, 42]],
  'icons-row2.svg': [[0, 0, 42, 42], [117, 0, 42, 42], [234, 0, 42, 42], [351, 0, 42, 42], [468, 0, 42, 42], [585, 0, 31, 42]],
}
const SCALE = 4
let n = 1
for (const [file, cells] of Object.entries(rows)) {
  const row = await sharp(`${SRC}/${file}`, { density: 72 * SCALE }).png().toBuffer()
  for (const [x, y, w, h] of cells) {
    // centre each icon on a square tile so they line up in the grid
    const icon = await sharp(row).extract({ left: x * SCALE, top: y * SCALE, width: w * SCALE, height: h * SCALE }).png().toBuffer()
    await sharp({ create: { width: 42 * SCALE, height: 42 * SCALE, channels: 3, background: '#ffffff' } })
      .composite([{ input: icon, left: Math.round(((42 - w) / 2) * SCALE), top: Math.round(((42 - h) / 2) * SCALE) }])
      .png()
      .toFile(`${OUT}/icon-${n}.png`)
    n++
  }
}

const webp = (src, out, width) => sharp(`${SRC}/${src}`).resize({ width, withoutEnlargement: true }).webp({ quality: 88 }).toFile(`${OUT}/${out}.webp`)
for (const [src, out, w] of [
  ['wireframes.png', 'wireframes', 1600],
  ['filter-panel.png', 'filter-panel', 1600],
  ['search-bar.png', 'search-bar', 1600],
  ['comments.png', 'comments', 1400],
  ['devices.png', 'devices', 1600],
]) {
  const i = await webp(src, out, w)
  console.log(out, i.width, i.height)
}
