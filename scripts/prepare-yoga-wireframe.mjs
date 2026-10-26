// Prepares Sujin's Pricing page wireframe for the Open Door Yoga case study.
// Source: the "Price" frame (111:179) on the Wireframe page of the Open Door Yoga
// Figma file, exported at 1x to design-exports/yoga-wireframe-pricing.png (1440x3079).
// Run scripts/mask-credits.mjs first: it covers the footer line that names the teammates.
// Output: public/images/projects/yoga-wireframe-pricing.webp (2400 px tall)
import sharp from 'sharp'

const out = await sharp('design-exports/yoga-wireframe-pricing.png')
  .resize({ height: 2400 })
  .webp({ quality: 88 })
  .toFile('public/images/projects/yoga-wireframe-pricing.webp')
console.log('yoga-wireframe-pricing', out.width, out.height)
