// Prepares the Open Door Yoga wireframes for the case study.
// Source: frames on the Wireframe page of the Open Door Yoga Figma file, exported at 1x to
// design-exports/: Home Page (119:479, 1440x2933), Price (111:179, 1440x3079, Sujin's page)
// and Training 1 (238:639, 1440x4462).
// Run scripts/mask-credits.mjs first: it covers the footer line that names the teammates.
// Output: public/images/projects/yoga-wireframe-*.webp (1122 px wide, so they keep one scale)
import sharp from 'sharp'

sharp.cache(false)

for (const name of ['home', 'pricing', 'training']) {
  const out = await sharp(`design-exports/yoga-wireframe-${name}.png`)
    .resize({ width: 1122 })
    .webp({ quality: 88 })
    .toFile(`public/images/projects/yoga-wireframe-${name}.webp`)
  console.log(`yoga-wireframe-${name}`, out.width, out.height)
}
