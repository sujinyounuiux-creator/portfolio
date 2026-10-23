// LastCow: real component sheets (Atoms, Molecules) from the design file's Components
// page, trimmed of empty space, and the persona slide cropped to just the persona card.
// Sources: design-exports/lastcow-atoms.png, lastcow-molecules.png, lastcow-persona-v2.png
import sharp from 'sharp'

const jobs = [
  // [source, output, crop as fractions: left, top, right, bottom]
  ['lastcow-atoms.png', 'lastcow-atoms', [0.03, 0.02, 0.97, 0.6]],
  ['lastcow-molecules.png', 'lastcow-molecules', [0.02, 0.03, 0.98, 0.86]],
  // the persona card sits on a purple slide under a "Persona" title
  ['lastcow-persona-v2.png', 'lastcow-persona', [0.056, 0.243, 0.944, 0.879]],
]

for (const [src, out, [l, t, r, b]] of jobs) {
  const { width, height } = await sharp(`design-exports/${src}`).metadata()
  const left = Math.round(width * l)
  const top = Math.round(height * t)
  const info = await sharp(`design-exports/${src}`)
    .extract({ left, top, width: Math.round(width * r) - left, height: Math.round(height * b) - top })
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(`public/images/projects/${out}.webp`)
  console.log(out, info.width, info.height)
}
