// Draws the site's crayon cursors: short, chubby crayons in the portfolio blues, with a round wax
// tip, a paper wrapper with zigzags and a heart label, round shading and a little wax grain, a dark
// outline and a white halo so they show on any background.
// Output (public/cursors/): 44 px images (*.png) and 88 px ones for sharp screens (*@2x.png).
//   crayon         main blue, everywhere            hotspot: the tip, at (4, 4) in CSS pixels
//   crayon-link    deep blue, on anything clickable
//   crayon-press   deep blue with a little scribble at the tip, while a link or button is pressed
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

// the portfolio's own blues (src/styles/tokens.css: --c-accent #789bc4, --c-accent-ink #3d628f)
const BLUE = { wax: '#8DADD3', dark: '#6F93BD', light: '#DCE7F4', deep: '#5F86B8' }
const DEEP = { wax: '#4F76A6', dark: '#33557F', light: '#9DB9DD', deep: '#24405F' }

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

// one short, chubby crayon pointing up, the tip at (0, 0): 64 long and 30 wide
const W = 15 // half width
const outline = `M-4 3 Q0 -1.5 4 3 L${W} 19 V57 Q${W} 64 8 64 H-8 Q-${W} 64 -${W} 57 V19 Z`
const wrapper = `M-${W} 24 H${W} V57 Q${W} 64 8 64 H-8 Q-${W} 64 -${W} 57 Z`
const tip = `M-4 3 Q0 -1.5 4 3 L${W} 19 V24 H-${W} V19 Z`
const zigzag = (y) => `M-${W} ${y} l5 -3 l5 3 l5 -3 l5 3 l5 -3 l5 3`
const crayonBody = (c, id) => `
    <g filter="url(#rough${id})">
      <path d="${outline}" fill="#fff" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>
      <path d="${outline}" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    </g>
    <!-- round wax tip and the bare wax collar, with round shading and grain -->
    <path d="${tip}" fill="url(#round${id})"/>
    <path d="${tip}" fill="#000" filter="url(#grain${id})" opacity="0.18"/>
    <path d="M-2.6 3.4 Q0 1.6 2.6 3.4 L5.6 10.5 Q0.5 12.5 -3.2 9 Z" fill="#fff" opacity="0.4"/>
    <!-- paper wrapper with rounded bottom corners -->
    <path d="${wrapper}" fill="url(#paper${id})"/>
    <path d="${wrapper}" fill="#000" filter="url(#grain${id})" opacity="0.1"/>
    <!-- printed zigzags and a deep blue label band with a little heart -->
    <path d="${zigzag(29)} ${zigzag(59.5)}" fill="none" stroke="${c.deep}" stroke-width="1.8" stroke-linejoin="round"/>
    <rect x="-${W}" y="34" width="${2 * W}" height="17" fill="${c.deep}"/>
    <path d="M-${W} 36.6 H${W} M-${W} 48.4 H${W}" stroke="${c.light}" stroke-width="1.1" opacity="0.9"/>
    <path d="M0 46.2 L-3.6 42.6 Q-5.4 40.4 -3.4 39.2 Q-1.4 38.2 0 40.2 Q1.4 38.2 3.4 39.2 Q5.4 40.4 3.6 42.6 Z" fill="#fff" opacity="0.92"/>
    <path d="M-${W} 24 H${W}" stroke="${INK}" stroke-width="1.6"/>
    <!-- soft highlight on the barrel -->
    <path d="M-8 27.5 V31 M-8 53 V57" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>`

// the tip sits at (8, 8) of the 88 px image (4, 4 in CSS px), pointing to the top left
const crayon = (c, id, scribble = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${defs(c, id)}
  ${
    scribble
      ? `<path d="M2 22 q6 -5 6 1 q0 6 6 1 q5 -4 5 2" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  <path d="M2 22 q6 -5 6 1 q0 6 6 1 q5 -4 5 2" fill="none" stroke="${c.dark}" stroke-width="3.6" stroke-linecap="round" filter="url(#rough${id})"/>`
      : ''
  }
  <g transform="translate(9 9) rotate(-45) scale(1.18)">${crayonBody(c, id)}
  </g>
</svg>`

const save = async (name, svg) => {
  const big = await sharp(Buffer.from(svg)).png().toBuffer()
  await sharp(big).toFile(`${out}/${name}@2x.png`)
  await sharp(big).resize(S / 2, S / 2).png().toFile(`${out}/${name}.png`)
}

await save('crayon', crayon(BLUE, 'b'))
await save('crayon-link', crayon(DEEP, 'y'))
await save('crayon-press', crayon(DEEP, 'p', true))

// Magnifying glass: a blue wax rim and the end of a deep blue crayon as the handle.
// The lens centre is at (34, 34) of the 88 px image (17, 17 in CSS px).
const magnifier = (mark) => `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${defs(DEEP, 'h')}${defs(BLUE, 'r')}
  <!-- handle: the paper end of a blue crayon, running from the rim to the bottom right -->
  <clipPath id="cut"><rect x="-30" y="33" width="60" height="40"/></clipPath>
  <g transform="translate(34 34) rotate(-45) scale(0.75) translate(0 0)" clip-path="url(#cut)">${crayonBody(DEEP, 'h')}</g>
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

// Drag arrows in blue wax (deep blue while held), with shading and grain. Centre (44, 44) = (22, 22) CSS px.
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

await save('drag-x', drag(dragX, BLUE, 'x'))
await save('drag-move', drag(dragMove, BLUE, 'm'))
await save('drag-move-held', drag(dragMove, DEEP, 'g'))
console.log('done')
