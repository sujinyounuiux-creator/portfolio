// BCA (Brazilian Community Association of BC) website redesign: turns the Figma exports in
// design-exports/bca/ into the images the case study uses.
// Sources (BCA-redesign Figma file unless noted):
//   web-*.png      desktop pages, 1440 frames (Home, Events, Event detail, Businesses, List your
//                  business, Get involved, Guides & news 855:2433, About 855:2176)
//   m-*.png        iPhone frames 1392:2664 (Home), 1392:4190 (Events), 1392:6540 (Businesses),
//                  1392:8682 (Get involved), 1392:11082 (Menu), exported at 2x. The Screen child
//                  sits at (19.87, 16.73), 390 x 845.87, so it is cut out here and shown in the
//                  site's own phone mockup.
//   wf-*.png       low fi wireframes 206:3375, 170:3803, 99:1669, 98:1361
//   persona.png    proto-persona 86:2; sitemap.png 1168:70752; competitive.png 1374:912;
//   usability.png  UXtweak summary slide 1374:927; logo.png 90:113
// Output: public/images/projects/bca-*.webp and design-exports/logos/bca.png
import { copyFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
const D = 'design-exports/bca/'
const OUT = 'public/images/projects/'
mkdirSync('design-exports/logos', { recursive: true })

const save = async (input, name, opts = {}) => {
  const out = await (opts.pipe ? opts.pipe(sharp(input)) : sharp(input)).webp({ quality: opts.q ?? 82 }).toFile(`${OUT}bca-${name}.webp`)
  console.log(name, out.width, out.height)
}

// the desktop pages are built sharp, at 2x, by scripts/stitch-bca-pages.mjs

// phone screens cut out of the iPhone frames
for (const f of ['home', 'events', 'event-detail', 'business', 'business-detail', 'menu', 'events-month', 'list-business', 'involved', 'guides', 'pt-home', 'pt-events', 'pt-involved']) {
  await save(`${D}m-${f}.png`, `m-${f}`, { pipe: (s) => s.extract({ left: 40, top: 34, width: 780, height: 1690 }) })
}

// the iPads (white canvas cut away) are made by scripts/cut-bca-ipads.mjs

// the wireframes are built sharp, at 2x, by scripts/stitch-bca-wireframes.mjs

await save(`${D}persona.png`, 'persona', { pipe: (s) => s.resize({ width: 1400 }) })

// the round logo on transparent: everything outside its circle is cut away
const L = await sharp(`${D}logo.png`).trim({ threshold: 10 }).png().toBuffer()
const lm = await sharp(L).metadata()
const r = Math.min(lm.width, lm.height) / 2
const circle = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${lm.width}" height="${lm.height}"><circle cx="${lm.width / 2}" cy="${lm.height / 2}" r="${r - 1}" fill="#fff"/></svg>`)
await sharp(L).ensureAlpha().composite([{ input: circle, blend: 'dest-in' }]).png().toFile('design-exports/logos/bca.png')
copyFileSync('design-exports/logos/bca.png', `${D}logo-round.png`)
console.log('logo', lm.width, lm.height)

// the logo for the previous / next project cards, 160 px tall like the others
await sharp('design-exports/logos/bca.png').resize({ height: 160 }).png().toFile('public/images/logos/bca.png')
