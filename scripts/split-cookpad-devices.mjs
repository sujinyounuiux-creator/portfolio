// Cuts the Cookpad "Overall UI" export (phone, tablet, laptop and desktop side by side)
// into one image per device, trimmed to the device, so the case study can show them
// one at a time. Source: design-exports/cookpad/devices.png → public/images/cookpad/device-*.webp
import sharp from 'sharp'

sharp.cache(false)
const src = 'design-exports/cookpad/devices.png'
const { width, height } = await sharp(src).metadata()
const raw = await sharp(src).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer()

// columns that hold any ink (clearly darker than white)
const inked = []
for (let x = 0; x < width; x++) {
  let ink = false
  for (let y = 0; y < height && !ink; y += 2) {
    const i = (y * width + x) * 3
    if (raw[i] + raw[i + 1] + raw[i + 2] < 720) ink = true
  }
  inked.push(ink)
}
// group inked columns into devices, split on gaps wider than 30 px
const spans = []
let start = -1
let gap = 0
for (let x = 0; x <= width; x++) {
  if (x < width && inked[x]) {
    if (start < 0) start = x
    gap = 0
  } else if (start >= 0 && ++gap > 30) {
    spans.push([start, x - gap])
    start = -1
  }
}
if (start >= 0) spans.push([start, width - 1 - gap])
const names = ['phone', 'tablet', 'laptop', 'desktop']
if (spans.length !== names.length) throw new Error(`expected 4 devices, found ${spans.length}`)
for (const [i, [l, r]] of spans.entries()) {
  // cut first, then trim (sharp can't do both in one pipeline)
  const cut = await sharp(src)
    .flatten({ background: '#ffffff' })
    .extract({ left: Math.max(0, l - 8), top: 0, width: Math.min(width, r + 9) - Math.max(0, l - 8), height })
    .png()
    .toBuffer()
  const out = await sharp(cut)
    .trim({ background: '#ffffff', threshold: 8 })
    .webp({ quality: 90 })
    .toFile(`public/images/cookpad/device-${names[i]}.webp`)
  console.log(names[i], out.width, out.height)
}
