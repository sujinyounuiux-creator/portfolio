// Turns the character artwork (drawn on a flat cream background) into a
// transparent WebP so it sits naturally on the site's silk background.
// Usage: node scripts/prepare-character.mjs [source] [output]
import sharp from 'sharp'

const src = process.argv[2] ?? 'design-exports/character-source.webp'
const out = process.argv[3] ?? 'public/images/character.webp'

const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const bg = [data[0], data[1], data[2]] // top-left pixel is the paper colour
const rgba = Buffer.alloc(info.width * info.height * 4)

for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2])
  // soft ramp keeps the crayon edges instead of a hard cut-out
  const a = Math.max(0, Math.min(1, (d - 10) / 28))
  rgba[j] = data[i]
  rgba[j + 1] = data[i + 1]
  rgba[j + 2] = data[i + 2]
  rgba[j + 3] = Math.round(a * 255)
}

const info2 = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim({ threshold: 1 })
  .resize({ width: 900, withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 90 })
  .toFile(out)
console.log(`${out}  ${info2.width}x${info2.height}  ${Math.round(info2.size / 1024)}KB`)
