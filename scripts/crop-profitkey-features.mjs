// Crops the three key PROFITKEY features out of the real page screens, so the case
// study can show each one beside its explanation (instead of a presentation slide).
// Each crop gets a white margin, so the panel doesn't touch the image edge.
// Source: public/images/screens/profitkey-web-*.webp (made by trim-profitkey-screens.mjs)
import sharp from 'sharp'

const crops = [
  // [output, source screen, left, top, width, height] in the 1400 px wide screens
  ['profitkey-crop-ai-comment', 'profitkey-web-detail', 90, 700, 1220, 290],
  ['profitkey-crop-glossary', 'profitkey-web-detail', 90, 320, 600, 340],
]

for (const [out, src, left, top, width, height] of crops) {
  const info = await sharp(`public/images/screens/${src}.webp`)
    .extract({ left, top, width, height })
    .extend({ top: 32, bottom: 32, left: 32, right: 32, background: '#ffffff' })
    .webp({ quality: 90 })
    .toFile(`public/images/screens/${out}.webp`)
  console.log(out, info.width, info.height)
}
