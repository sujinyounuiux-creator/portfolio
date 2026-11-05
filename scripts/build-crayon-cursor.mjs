// Draws the site's crayon cursors. The tip is the hotspot, at (3, 3) in CSS pixels.
// Output: public/cursors/crayon[-link].png (32px, the largest size browsers allow right up to
// the window edge) and crayon[-link]@2x.png (64px, for sharp screens).
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const INK = '#1F2430'

const crayon = (wax, dark) => {
  // drawn pointing up with the tip at (0, 0), then turned so the tip is top left
  const shape = `
    <path d="M-2 0 H2 L7.5 13 V60 Q0 63 -7.5 60 V13 Z"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <g transform="translate(6 6) rotate(-45)" stroke-linejoin="round" stroke-linecap="round">
    <g fill="#fff" stroke="#fff" stroke-width="8">${shape}</g>
    <g fill="${wax}" stroke="${INK}" stroke-width="3.4">${shape}</g>
    <path d="M-5.8 21 Q0 24 5.8 21 V52 Q0 55 -5.8 52 Z" fill="${dark}"/>
    <path d="M-5.8 21 Q0 24 5.8 21 M-5.8 52 Q0 55 5.8 52" fill="none" stroke="${INK}" stroke-width="2.2"/>
    <path d="M-2.4 31 V43" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="2.6"/>
  </g>
</svg>`
}

const out = 'public/cursors'
mkdirSync(out, { recursive: true })
for (const [name, wax, dark] of [
  ['crayon', '#6F9BD8', '#4C78B8'],
  ['crayon-link', '#FFD04D', '#F2AE1C'],
]) {
  const big = await sharp(Buffer.from(crayon(wax, dark))).png().toBuffer()
  await sharp(big).toFile(`${out}/${name}@2x.png`)
  await sharp(big).resize(32, 32).png().toFile(`${out}/${name}.png`)
}
console.log('done')
