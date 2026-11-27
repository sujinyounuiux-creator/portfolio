// BCA "What we changed after feedback": before and after pairs for the drag sliders.
// Sources (BCA-redesign Figma file, exported at 2x to design-exports/bca/iteration/):
//   before: page "old) Final UI · Desktop"   Donate 1121:554, Events map view 1102:554
//   after:  page "05 Final UI · Refined"     Donate 1284:9020, Events map view 1284:2457
// Each pair is cut from the same box, so the slider lines up.
// Output: public/images/projects/bca-iter-<name>-before.webp / -after.webp
import sharp from 'sharp'

sharp.cache(false)
const D = 'design-exports/bca/iteration/'
const OUT = 'public/images/projects/'
const pairs = {
  // the donation form, where "Other" now opens a field to type your own amount
  donate: { left: 200, top: 1060, width: 1440, height: 1300 },
  // the event calendar map, whose pop up now shows the full street address
  map: { left: 240, top: 1800, width: 1420, height: 1080 },
}
for (const [name, box] of Object.entries(pairs)) {
  for (const when of ['before', 'after']) {
    const out = await sharp(`${D}${name}-${when}.png`).extract(box).webp({ quality: 88 }).toFile(`${OUT}bca-iter-${name}-${when}.webp`)
    console.log(name, when, out.width, out.height)
  }
}
