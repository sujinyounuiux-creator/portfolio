// The seven pages of the original opendooryoga.bc.ca site that we audited
// (Home, About, Schedule, Teacher Training, Passes, Workshops, Contact).
// Full-page 2x screenshots of the live site at 1440 px wide, taken with puppeteer-core + Edge,
// are saved in design-exports/yoga-live/*.png; this makes the web versions.
// Output: public/images/yoga-audit/*.webp (1600 px wide, sharp enough to zoom into)
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

mkdirSync('public/images/yoga-audit', { recursive: true })

for (const name of ['home', 'about', 'schedule', 'training', 'passes', 'workshops', 'contact']) {
  const info = await sharp(`design-exports/yoga-live/${name}.png`)
    .resize({ width: 1600 })
    .webp({ quality: 80 })
    .toFile(`public/images/yoga-audit/${name}.webp`)
  console.log(name, info.width, info.height, `${Math.round(info.size / 1024)}KB`)
}
