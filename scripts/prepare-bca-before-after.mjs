// Before / after for the BCA case study: the first screen (1440 x 900) of BCA's current home page
// (bca-bc.ca, captured 2026-11-23 at 2x into design-exports/bca/old-home-2x.png) next to the same
// first screen of the redesign (public/images/projects/bca-web-home.webp, built from Figma 839:210).
// Output: public/images/projects/bca-before-home.webp and bca-after-home.webp, 2400 x 1500
import sharp from 'sharp'

const W = 2400
const H = 1500 // 1440 x 900 at the same 16:10 shape
await sharp('design-exports/bca/old-home-2x.png').resize(W, H).webp({ quality: 84 }).toFile('public/images/projects/bca-before-home.webp')
// the redesign is 2400 wide already: its first 900 CSS px are the top 1500 px
await sharp('public/images/projects/bca-web-home.webp').extract({ left: 0, top: 0, width: W, height: H }).webp({ quality: 84 }).toFile('public/images/projects/bca-after-home.webp')
console.log('done')
