// Crops the three key PROFITKEY features out of the real page screens, so the case
// study can show each one beside its explanation (instead of a presentation slide).
// Each crop gets a white margin, so the panel doesn't touch the image edge.
// Source: public/images/screens/profitkey-web-detail.webp (2400 px wide, made by prepare-profitkey-hifi.mjs).
// The boxes are the AI Comment block (Frame 361) and the Key indicators card of the hi-fi Stock detail
// frame (584:3138, 442 px wide, so 1 Figma px = 2400 / 442 screen px).
import sharp from 'sharp'

const crops = [
  // [output, source screen, left, top, width, height] in the 2400 px wide screen
  ['profitkey-crop-ai-comment', 'profitkey-web-detail', 206, 1362, 1987, 566],
  ['profitkey-crop-glossary', 'profitkey-web-detail', 206, 658, 968, 517],
  // the AI Recommended Stocks card on Home (575:3119 is 572 px wide, so 1 Figma px = 2400 / 572)
  ['profitkey-ai-pick', 'profitkey-web-home', 1246, 362, 817, 897],
]

for (const [out, src, left, top, width, height] of crops) {
  const info = await sharp(`public/images/screens/${src}.webp`)
    .extract({ left, top, width, height })
    .extend({ top: 32, bottom: 32, left: 32, right: 32, background: '#ffffff' })
    .webp({ quality: 90 })
    .toFile(`public/images/screens/${out}.webp`)
  console.log(out, info.width, info.height)
}
