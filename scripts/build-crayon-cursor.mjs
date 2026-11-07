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

// Magnifying glass cursors for zoomable images, in the same crayon look: a yellow rim and a blue
// wax handle with a + or - inside. The hotspot is the middle of the lens, at (13, 13) in CSS pixels.
const magnifier = (mark) => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <g stroke-linecap="round" stroke-linejoin="round">
    <g fill="none" stroke="#fff">
      <circle cx="26" cy="26" r="20" fill="#fff" stroke-width="9"/>
      <path d="M41.5 41.5 L56 56" stroke-width="16"/>
    </g>
    <path d="M41.5 41.5 L56 56" fill="none" stroke="${INK}" stroke-width="12.5"/>
    <path d="M41.5 41.5 L56 56" fill="none" stroke="#6F9BD8" stroke-width="6.5"/>
    <circle cx="26" cy="26" r="20" fill="#FFFDF6" stroke="${INK}" stroke-width="9"/>
    <circle cx="26" cy="26" r="20" fill="none" stroke="#FFD04D" stroke-width="4"/>
    <path d="${mark}" fill="none" stroke="${INK}" stroke-width="4.5"/>
    <path d="M14.5 23 Q16 16.5 22 14.5" fill="none" stroke="#6F9BD8" stroke-opacity="0.55" stroke-width="2.6"/>
  </g>
</svg>`

for (const [name, mark] of [
  ['magnifier-in', 'M17.5 26 H34.5 M26 17.5 V34.5'],
  ['magnifier-out', 'M17.5 26 H34.5'],
]) {
  const big = await sharp(Buffer.from(magnifier(mark))).png().toBuffer()
  await sharp(big).toFile(`${out}/${name}@2x.png`)
  await sharp(big).resize(32, 32).png().toFile(`${out}/${name}.png`)
}
console.log('done')
