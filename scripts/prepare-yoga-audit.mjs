// The seven pages of the original opendooryoga.bc.ca site that we audited, exported from
// the "Heuristic Evaluation" section of the Open Door Yoga Figma file (html.to.design captures).
// Each becomes one full-page image; the case study shows the top of each as a card.
// Source: design-exports/yoga-audit/*.jpg → public/images/yoga-audit/*.webp
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

mkdirSync('public/images/yoga-audit', { recursive: true })

// Teacher Training's capture has the team's review notes beside the page; keep only the page
// (the page is 2120 of the section's 2835 px width in Figma).
const pageOnly = { training: 2120 / 2835 }

for (const name of ['home', 'about', 'schedule', 'training', 'passes', 'workshops', 'contact']) {
  const src = `design-exports/yoga-audit/${name}.jpg`
  let img = sharp(src)
  if (pageOnly[name]) {
    const { width, height } = await img.metadata()
    img = sharp(src).extract({ left: 0, top: 0, width: Math.round(width * pageOnly[name]), height })
  }
  // the exports include the board's dark grey (#444) margin around each page: trim it
  const page = await img.png().toBuffer()
  const trimmed = await sharp(page).trim({ background: '#444444', threshold: 18 }).png().toBuffer()
  const info = await sharp(trimmed).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/images/yoga-audit/${name}.webp`)
  console.log(name, info.width, info.height, `${Math.round(info.size / 1024)}KB`)
}
