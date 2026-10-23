// Rebuilds the Open Door Yoga "Molecules" component sheet with readable contrast.
//
// The Figma section has a dark #444 fill, so components with dark text (accordion,
// navigation, footer links) were nearly invisible on it. Each component is exported
// from Figma as SVG; this script strips the section's background layers, the dashed
// component-set outlines and the team credit line, then places every component back
// at its original position on the project's own light background (Violet light
// #F0EDF1). Components designed with light text (teacher cards, light header,
// mobile header) sit on a Violet darker (#251B2A) panel instead.
//
// Source: design-exports/molecules/*.svg → public/images/projects/yoga-components.webp
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const SRC = 'design-exports/molecules'
const OUT = 'public/images/projects/yoga-components.webp'
const W = 3587
const H = 2105
const LIGHT = '#F0EDF1'
const DARK = '#251B2A'

// [file, x, y, width, height] of each node in section coordinates (from Figma)
const parts = [
  ['training-info', 61, 183, 562, 128],
  ['training-process', 61, 410, 779, 406],
  ['gift', 61, 1002, 541, 369],
  ['yoga-styles', 61, 1537, 1384, 500],
  ['price', 899, 88, 354, 317],
  ['good-price', 899, 488, 354, 333],
  ['drop-in', 899, 889, 354, 317],
  ['teachers', 1559, 200, 309, 1134],
  ['header-light', 2033, 220, 1440, 153],
  ['header-dark', 2033, 373, 1440, 153],
  ['header-mobile', 2119, 567, 430, 97],
  ['header-list', 2051, 903, 803, 308],
  ['footer', 2031, 1382, 1482, 830],
]

// Rounded dark panels behind the light-text components: [x, y, w, h]
const panels = [
  [1559, 200, 309, 1134], // teacher cards
  [2013, 204, 1480, 166], // light header
  [2099, 553, 470, 125], // mobile header (white menu icon)
]

// Class style card titles were Violet light on a fade into Violet light; use the
// palette's heading colour (Violet darker) so they read on the light page.
const recolour = (name, svg) =>
  name === 'yoga-styles'
    ? svg.replace(/(<path id="Hatha Yoga[^"]*" d="[^"]*" )fill="#F0EDF1"/g, '$1fill="#251B2A"')
    : svg

const strip = (svg) =>
  svg
    // export background + the Molecules section's fill and outline
    .replace(/<rect width="\d+" height="\d+" fill="#2C2C2C"\/>/, '')
    .replace(/<path d="M-[^"]*" fill="#444444"\/>/, '')
    .replace(/<path d="M-[^"]*" fill="white" fill-opacity="0\.1"\/>/, '')
    // Figma's dashed component-set outline
    .replace(/<rect [^>]*stroke-dasharray="10 5"\/>/g, '')
    // team credit line in the footer (names stay out of public content)
    .replace(/<path id="2026, Designed by[^"]*" d="[^"]*"[^>]*\/>/g, '')

const layers = []
for (const [x, y, w, h] of panels) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="24" fill="${DARK}"/></svg>`
  layers.push({ input: Buffer.from(svg), left: x, top: y })
}
for (const [name, x, y, w, h] of parts) {
  const svg = recolour(name, strip(readFileSync(`${SRC}/${name}.svg`, 'utf8')))
  const img = sharp(Buffer.from(svg), { unlimited: true })
  const { width, height } = await img.metadata()
  // exports include drop-shadow bounds; centre them on the node's box
  layers.push({
    input: await img.png().toBuffer(),
    left: Math.round(x - (width - w) / 2),
    top: Math.round(y - (height - h) / 2),
  })
}

// sharp resizes before compositing, so flatten the sheet first
const sheet = await sharp({ create: { width: W, height: H, channels: 3, background: LIGHT } })
  .composite(layers)
  .png()
  .toBuffer()
await sharp(sheet).resize({ width: 1600 }).webp({ quality: 88 }).toFile(OUT)
console.log('wrote', OUT)
