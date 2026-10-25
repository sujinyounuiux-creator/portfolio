// Lightens the character's skin a little (Sujin's request), leaving hair, hoodie, blush,
// outlines and doodles alone. Instead of a hard on/off skin mask (which leaves blotches in the
// crayon texture), each pixel gets a lightening weight that fades smoothly by how close its
// hue, saturation and brightness are to the peach skin, then is blended toward a soft ivory.
// Source: design-exports/character-before-skin.webp → public/images/character.webp
import sharp from 'sharp'

const src = 'design-exports/character-before-skin.webp'
const AMOUNT = 0.42 // how far skin moves toward ivory (0 = unchanged)
const IVORY = [255, 239, 224]

const hsv = (r, g, b) => {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, max ? d / max : 0, max / 255]
}
// 1 inside [a, b], fading to 0 over `soft` outside it
const band = (v, a, b, soft) => (v < a ? Math.max(0, 1 - (a - v) / soft) : v > b ? Math.max(0, 1 - (v - b) / soft) : 1)

const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true })
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] === 0) continue
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
  const [h, s, v] = hsv(r, g, b)
  // skin hue is orange (about 20 to 32 degrees); the blush is redder (about 10 to 16)
  const w = band(h, 20, 32, 4) * band(s, 0.18, 0.55, 0.08) * band(v, 0.9, 1, 0.08) * AMOUNT
  if (!w) continue
  data[i] = Math.round(r + (IVORY[0] - r) * w)
  data[i + 1] = Math.round(g + (IVORY[1] - g) * w)
  data[i + 2] = Math.round(b + (IVORY[2] - b) * w)
}
const out = await sharp(data, { raw: info }).webp({ quality: 88, alphaQuality: 90 }).toFile('public/images/character.webp')
console.log(`${out.width}x${out.height}`)
