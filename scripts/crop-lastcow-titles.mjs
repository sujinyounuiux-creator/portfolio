// Crops the slide headings off LastCow images whose section on the site already has
// the same title ("Style guide & accessibility", "From wireframes to hi-fi screens", "UI Kits").
// Crop boxes are fractions of the 16:9 slide, so they work at any export size.
import sharp from 'sharp'

const crops = {
  'lastcow-styleguide': [0.25, 0.835],
  'lastcow-wireframes': [0.225, 0.975],
  'lastcow-uikit': [0.265, 0.8],
}

for (const [name, [top, bottom]] of Object.entries(crops)) {
  const src = `design-exports/${name}.png`
  const { width, height } = await sharp(src).metadata()
  const y = Math.round(height * top)
  const info = await sharp(src)
    .extract({ left: 0, top: y, width, height: Math.round(height * bottom) - y })
    .resize({ width: 1600 })
    .webp({ quality: 85 })
    .toFile(`public/images/projects/${name}.webp`)
  console.log(name, info.width, info.height)
}
