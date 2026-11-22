// Draws the site's crayon cursors, in a realistic crayon look: a worn wax tip, a paper wrapper
// with printed stripes, round shading and a little wax grain, with a dark outline and a white
// halo so they show on any background.
// Output (public/cursors/): 44 px images (*.png) and 88 px ones for sharp screens (*@2x.png).
//   crayon         blue, everywhere            hotspot: the tip, at (4, 4) in CSS pixels
//   crayon-link    yellow, on anything clickable
//   crayon-press   yellow with a little scribble at the tip, while a link or button is pressed
//   magnifier-in / magnifier-out   zoomable images        hotspot: lens centre (17, 17)
//   drag-x / drag-move / drag-move-held   sliders, moving a zoomed photo   hotspot: centre (22, 22)
// Note: browsers fall back to the plain system cursor when a cursor this size would hang over
// the window edge; the fallbacks are set in src/styles/base.css.
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const INK = '#1F2430'
const S = 88 // drawing size = the @2x image
const out = 'public/cursors'
mkdirSync(out, { recursive: true })

const BLUE = { wax: '#6F9BD8', dark: '#3F68A8', light: '#A9C6EE' }
const YELLOW = { wax: '#FFD04D', dark: '#E39B12', light: '#FFE89A' }

// shared filters: wax grain inside a shape, and a slightly rough, waxy edge
const defs = (c, id) => `
  <defs>
    <filter id="grain${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.2 1.25"/>
      <feComposite operator="in" in2="SourceGraphic"/>
    </filter>
    <filter id="rough${id}" filterUnits="userSpaceOnUse" x="-200" y="-200" width="400" height="400">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <linearGradient id="round${id}" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${c.dark}"/>
      <stop offset="0.32" stop-color="${c.light}"/>
      <stop offset="0.55" stop-color="${c.wax}"/>
      <stop offset="1" stop-color="${c.dark}"/>
    </linearGradient>
    <linearGradient id="paper${id}" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${c.dark}"/>
      <stop offset="0.3" stop-color="${c.wax}"/>
      <stop offset="0.45" stop-color="${c.light}"/>
      <stop offset="1" stop-color="${c.dark}"/>
    </linearGradient>
  </defs>`

// one crayon pointing up, the tip at (0, 0), 92 long and 20 wide
const W = 10 // half width
const outline = `M-2.6 1.2 Q0 -0.8 2.6 1.2 L${W} 22 V91 Q0 93.5 -${W} 91 V22 Z`
const crayonBody = (c, id) => `
    <g filter="url(#rough${id})">
      <path d="${outline}" fill="#fff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>
      <path d="${outline}" fill="${INK}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
    </g>
    <!-- wax tip and the bare wax collar, with round shading and grain -->
    <path d="M-2.6 1.2 Q0 -0.8 2.6 1.2 L${W} 22 V28 H-${W} V22 Z" fill="url(#round${id})"/>
    <path d="M-2.6 1.2 Q0 -0.8 2.6 1.2 L${W} 22 V28 H-${W} V22 Z" fill="#000" filter="url(#grain${id})" opacity="0.35"/>
    <!-- worn, rubbed flat facet on the tip -->
    <path d="M-1.6 2 Q0.6 1 2.2 2.4 L5.2 11 Q1 13 -1.4 9 Z" fill="#fff" opacity="0.28"/>
    <!-- paper wrapper -->
    <path d="M-${W} 28 H${W} V91 Q0 93.5 -${W} 91 Z" fill="url(#paper${id})"/>
    <path d="M-${W} 28 H${W} V91 Q0 93.5 -${W} 91 Z" fill="#000" filter="url(#grain${id})" opacity="0.18"/>
    <!-- printed zigzag stripes near both ends, and a dark label band with two thin lines -->
    <path d="M-${W} 33 l3.33 -2.6 l3.33 2.6 l3.33 -2.6 l3.33 2.6 l3.33 -2.6 l3.33 2.6" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M-${W} 86 l3.33 -2.6 l3.33 2.6 l3.33 -2.6 l3.33 2.6 l3.33 -2.6 l3.33 2.6" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    <rect x="-${W}" y="44" width="${2 * W}" height="26" fill="${INK}" opacity="0.82"/>
    <path d="M-${W} 47.5 H${W} M-${W} 66.5 H${W}" stroke="${c.light}" stroke-width="1.1" opacity="0.9"/>
    <path d="M-4.5 53 H3 M-4.5 57.5 H1 M-4.5 62 H4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>
    <!-- seam lines where the wrapper starts and ends -->
    <path d="M-${W} 28 H${W}" stroke="${INK}" stroke-width="1.6"/>
    <!-- soft highlight running down the barrel -->
    <path d="M-4.4 30 V42 M-4.4 72 V88" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="0.45"/>`

// the tip sits at (8, 8) of the 88 px image (4, 4 in CSS px), pointing to the top left
const crayon = (c, id, scribble = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${defs(c, id)}
  ${
    scribble
      ? `<path d="M2 22 q6 -5 6 1 q0 6 6 1 q5 -4 5 2" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  <path d="M2 22 q6 -5 6 1 q0 6 6 1 q5 -4 5 2" fill="none" stroke="${c.dark}" stroke-width="3.6" stroke-linecap="round" filter="url(#rough${id})"/>`
      : ''
  }
  <g transform="translate(8 8) rotate(-45)">${crayonBody(c, id)}
  </g>
</svg>`

const save = async (name, svg) => {
  const big = await sharp(Buffer.from(svg)).png().toBuffer()
  await sharp(big).toFile(`${out}/${name}@2x.png`)
  await sharp(big).resize(S / 2, S / 2).png().toFile(`${out}/${name}.png`)
}

await save('crayon', crayon(BLUE, 'b'))
await save('crayon-link', crayon(YELLOW, 'y'))
await save('crayon-press', crayon(YELLOW, 'p', true))

// Magnifying glass: a yellow wax rim and a short crayon (blue wrapper) as the handle.
// The lens centre is at (34, 34) of the 88 px image (17, 17 in CSS px).
const magnifier = (mark) => `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${defs(BLUE, 'h')}${defs(YELLOW, 'r')}
  <!-- handle: the paper end of a blue crayon, running from the rim to the bottom right -->
  <clipPath id="cut"><rect x="-20" y="45" width="40" height="60"/></clipPath>
  <g transform="translate(34 34) rotate(-45) translate(0 -20)" clip-path="url(#cut)">${crayonBody(BLUE, 'h')}</g>
  <g filter="url(#roughr)">
    <circle cx="34" cy="34" r="24" fill="#fff" stroke="#fff" stroke-width="12"/>
    <circle cx="34" cy="34" r="24" fill="#FFFDF6" stroke="${INK}" stroke-width="11"/>
  </g>
  <circle cx="34" cy="34" r="24" fill="none" stroke="url(#roundr)" stroke-width="6.5"/>
  <circle cx="34" cy="34" r="24" fill="none" stroke="#000" stroke-width="6.5" filter="url(#grainr)" opacity="0.3"/>
  <path d="M19 29 Q21 20 29.5 18" fill="none" stroke="${BLUE.wax}" stroke-opacity="0.5" stroke-width="3.2" stroke-linecap="round"/>
  <path d="${mark}" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round" filter="url(#roughr)"/>
</svg>`

await save('magnifier-in', magnifier('M23.5 34 H44.5 M34 23.5 V44.5'))
await save('magnifier-out', magnifier('M23.5 34 H44.5'))

// Drag arrows in yellow wax (blue while held), with shading and grain. Centre (44, 44) = (22, 22) CSS px.
const dragX = 'M8 44 L26 26 V36 H62 V26 L80 44 L62 62 V52 H26 V62 Z'
const dragMove =
  'M44 7 L58 21 H49.5 V38.5 H67 V30 L81 44 L67 58 V49.5 H49.5 V67 H58 L44 81 L30 67 H38.5 V49.5 H21 V58 L7 44 L21 30 V38.5 H38.5 V21 H30 Z'
const drag = (shape, c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${defs(c, id).replace('x1="0" x2="1" y1="0" y2="0"', 'x1="0" x2="1" y1="0" y2="1"')}
  <g stroke-linejoin="round" stroke-linecap="round" filter="url(#rough${id})">
    <path d="${shape}" fill="#fff" stroke="#fff" stroke-width="10"/>
    <path d="${shape}" fill="url(#round${id})" stroke="${INK}" stroke-width="4"/>
  </g>
  <path d="${shape}" fill="#000" filter="url(#grain${id})" opacity="0.3"/>
</svg>`

await save('drag-x', drag(dragX, YELLOW, 'x'))
await save('drag-move', drag(dragMove, YELLOW, 'm'))
await save('drag-move-held', drag(dragMove, BLUE, 'g'))
console.log('done')
