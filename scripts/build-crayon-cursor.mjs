// Draws the site's cursors in the portfolio's own simple style: flat shapes in the portfolio blues
// with the same dark ink outline as the doodles, and a beige halo (the site background) so they
// show on any background.
// Output (public/cursors/): 44 px images (*.png) and 88 px ones for sharp screens (*@2x.png).
//   crayon         main blue crayon, everywhere          hotspot: the tip, at (4, 4) in CSS pixels
//   crayon-link    deep blue crayon with a click burst at the tip, on anything clickable (hotspot 14, 14)
//   crayon-press   the same with a bigger burst, while a link or button is pressed
//   magnifier-in / magnifier-out   zoomable images, 36 px   hotspot: lens centre (14, 14)
//   drag-x / drag-move / drag-move-held   sliders, moving a zoomed photo, 36 px   hotspot: centre (18, 18)
// Note: browsers fall back to the plain system cursor when a cursor this size would hang over
// the window edge; the fallbacks are set in src/styles/base.css.
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const S = 88 // drawing size = the @2x image
const out = 'public/cursors'
mkdirSync(out, { recursive: true })

// the portfolio's own colours (src/styles/tokens.css)
const INK = '#1F2430' // --c-ink
const MAIN = { body: '#789BC4', tip: '#9DB7D6', band: '#5F86B8' } // --c-accent
const DEEP = { body: '#3D628F', tip: '#6F93BD', band: '#2E4D73' } // --c-accent-ink
const PAPER = '#FFFDF9' // --c-surface
// the outline that keeps each cursor visible on any background: the site's own beige (--c-bg)
const HALO = '#FFF8F1'

// size: the cursor's size in CSS px. The crayon is 44; the magnifier and arrows are drawn larger
// inside the same canvas, so they are saved at 36 to look the same size as the crayon.
const save = async (name, svg, size = 44) => {
  const big = await sharp(Buffer.from(svg)).png().toBuffer()
  await sharp(big).resize(size * 2, size * 2).png().toFile(`${out}/${name}@2x.png`)
  await sharp(big).resize(size, size).png().toFile(`${out}/${name}.png`)
}
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <g stroke-linejoin="round" stroke-linecap="round">${inner}</g>
</svg>`

// A crayon pointing up with the tip at (0, 0): a rounded cone, a plain body and one paper band.
// Short and a little plump, so it reads as a crayon at 44 px without extra detail.
const W = 12 // half width
const L = 54 // length
const outline = `M-3.4 2.2 Q0 -1.2 3.4 2.2 L${W} 17 V${L - 5} Q${W} ${L} ${W - 5} ${L} H-${W - 5} Q-${W} ${L} -${W} ${L - 5} V17 Z`
// On anything clickable the crayon gets a "click" burst: three bold ink lines fanning out above
// and to the left of its tip, where nothing covers them, so links are easy to tell apart. The
// crayon moves down a little to make room: its tip is at (28, 28), so the hotspot is (14, 14).
// Pressed, the lines grow longer.
const TIP = 28
const burst = (long) => {
  const [a, b] = long ? [5, 22] : [7, 18] // where each line starts and ends, away from the tip
  const lines = [
    [0, -1], // up
    [-1, 0], // left
    [-0.72, -0.72], // up and left
  ].map(([dx, dy]) => `M${TIP + dx * a} ${TIP + dy * a} L${(TIP + dx * b).toFixed(1)} ${(TIP + dy * b).toFixed(1)}`)
  const d = lines.join(' ')
  return `<path d="${d}" fill="none" stroke="${HALO}" stroke-width="${long ? 9 : 8}"/>
  <path d="${d}" fill="none" stroke="${INK}" stroke-width="${long ? 4.4 : 3.8}"/>`
}
const crayon = (c, mode = 'plain') =>
  svg(`
  ${mode === 'plain' ? '' : burst(mode === 'press')}
  <g transform="translate(${mode === 'plain' ? 9 : TIP} ${mode === 'plain' ? 9 : TIP}) rotate(-45) scale(${mode === 'plain' ? 1.2 : 1.05})">
    <path d="${outline}" fill="${HALO}" stroke="${HALO}" stroke-width="6.5"/>
    <path d="${outline}" fill="${c.body}"/>
    <path d="M-3.4 2.2 Q0 -1.2 3.4 2.2 L${W} 17 H-${W} Z" fill="${c.tip}"/>
    <rect x="-${W}" y="27" width="${2 * W}" height="15" fill="${c.band}"/>
    <path d="M-${W} 17 H${W}" stroke="${INK}" stroke-width="2"/>
    <path d="M-6.5 21 V24 M-6.5 45.5 V48" stroke="#fff" stroke-width="2.4" opacity="0.55"/>
    <path d="${outline}" fill="none" stroke="${INK}" stroke-width="2.6"/>
  </g>`)

await save('crayon', crayon(MAIN))
await save('crayon-link', crayon(DEEP, 'link'))
await save('crayon-press', crayon(DEEP, 'press'))

// Magnifying glass: a paper lens with a main blue rim, and a deep blue handle.
// The lens centre is at (34, 34) of the 88 px image (17, 17 in CSS px).
const magnifier = (mark) =>
  svg(`
  <path d="M52 52 L74 74" stroke="${HALO}" stroke-width="19"/>
  <path d="M52 52 L74 74" stroke="${INK}" stroke-width="14"/>
  <path d="M52 52 L74 74" stroke="${DEEP.body}" stroke-width="8.8"/>
  <circle cx="34" cy="34" r="22" fill="${HALO}" stroke="${HALO}" stroke-width="15"/>
  <circle cx="34" cy="34" r="22" fill="${PAPER}" stroke="${INK}" stroke-width="10"/>
  <circle cx="34" cy="34" r="22" fill="none" stroke="${MAIN.body}" stroke-width="5"/>
  <path d="M21 30 Q23 22 30 20.5" fill="none" stroke="${MAIN.tip}" stroke-width="3"/>
  <path d="${mark}" fill="none" stroke="${INK}" stroke-width="5"/>`)

await save('magnifier-in', magnifier('M25 34 H43 M34 25 V43'), 36)
await save('magnifier-out', magnifier('M25 34 H43'), 36)

// Drag arrows: flat main blue (deep blue while a photo is held), with the ink outline.
// The centre is at (44, 44) of the 88 px image (22, 22 in CSS px).
const dragX = 'M10 44 L27 27 V37 H61 V27 L78 44 L61 61 V51 H27 V61 Z'
const dragMove =
  'M44 9 L57 22 H49.5 V38.5 H66 V31 L79 44 L66 57 V49.5 H49.5 V66 H57 L44 79 L31 66 H38.5 V49.5 H22 V57 L9 44 L22 31 V38.5 H38.5 V22 H31 Z'
const drag = (shape, c) =>
  svg(`
  <path d="${shape}" fill="${HALO}" stroke="${HALO}" stroke-width="10"/>
  <path d="${shape}" fill="${c.body}" stroke="${INK}" stroke-width="3.6"/>`)

await save('drag-x', drag(dragX, MAIN), 36)
await save('drag-move', drag(dragMove, MAIN), 36)
await save('drag-move-held', drag(dragMove, DEEP), 36)
console.log('done')
