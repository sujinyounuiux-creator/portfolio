// Prepares real Figma screen exports for device mockups and before/after sliders.
// Source: design-exports/screens/*.png   Output: public/images/screens/*.webp
//
// • Device screens are only resized (never cropped or stretched).
// • Before/after pairs are cropped to the same top-of-page viewport so the two
//   versions line up: both pages are scaled to the same width, then the same
//   height is taken from the top.
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const src = 'design-exports/screens'
const out = 'public/images/screens'
await mkdir(out, { recursive: true })

// name -> max output width
const screens = {
  'lastcow-phone-home': 600,
  'lastcow-phone-event': 600,
  'profitkey-web-home': 1400,
  'profitkey-web-detail': 1400,
}
for (const [name, w] of Object.entries(screens)) {
  const i = await sharp(`${src}/${name}.png`).resize({ width: w, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`${out}/${name}.webp`)
  console.log(`${name}.webp  ${i.width}x${i.height}`)
}

// before/after: same width, same top crop (16:10 viewport)
const W = 1600
const H = 1000
for (const page of ['pricing', 'about']) {
  for (const side of ['before', 'after']) {
    const i = await sharp(`${src}/yoga-${side}-${page}.png`)
      .resize({ width: W })
      .extract({ left: 0, top: 0, width: W, height: H })
      .webp({ quality: 84 })
      .toFile(`${out}/yoga-${page}-${side}.webp`)
    console.log(`yoga-${page}-${side}.webp  ${i.width}x${i.height}`)
  }
}
