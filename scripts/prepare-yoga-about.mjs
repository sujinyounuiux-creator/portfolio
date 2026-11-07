// The Yoga About page in Final pages, from the Figma Mockup frame "about" (612:1168). The teammate
// credit in the footer is covered with the footer colour, and the edges are trimmed by a pixel so
// no stray line from the export shows beside the page.
// Source: design-exports/yoga-about-full.png → public/images/projects/yoga-about.webp
import sharp from 'sharp'

sharp.cache(false)
const src = 'design-exports/yoga-about-full.png'
const { width, height } = await sharp(src).metadata()
const scale = width / 1440
const box = { left: Math.round(30 * scale), top: Math.round(3272 * scale), width: Math.round(380 * scale), height: height - Math.round(3272 * scale) }
const { data } = await sharp(src).removeAlpha().extract({ left: box.left, top: box.top - 6, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true })
const cover = await sharp({ create: { width: box.width, height: box.height, channels: 3, background: { r: data[0], g: data[1], b: data[2] } } }).png().toBuffer()
const flat = await sharp(src).flatten({ background: '#fff' }).composite([{ input: cover, left: box.left, top: box.top }]).png().toBuffer()
const o = await sharp(flat).extract({ left: 1, top: 0, width: width - 3, height }).resize({ width: 1400 }).webp({ quality: 88 }).toFile('public/images/projects/yoga-about.webp')
console.log('source', width, height, 'output', o.width, o.height)
