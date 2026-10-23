// Straightens the PROFITKEY website screens from the Portfolio file's "Outview" slide.
// In Figma the screens sit in columns rotated 15°, so each export (scale 4) comes out
// tilted inside a larger box. Rotating back by 15° puts the screen upright at the centre;
// it is then cropped to the frame's own size (442 px wide × its height, at scale 4).
// Source: design-exports/profitkey-outview/*.png → public/images/screens/profitkey-ov-*.webp
import sharp from 'sharp'

const SCALE = 4
const INSET = 3 // trim anti-aliased edge pixels
// frame heights in Figma (all frames are 442 px wide)
const screens = {
  home: 641,
  'stock-detail': 828,
  community: 512,
  news: 430,
  notice: 246,
  faq: 339,
  watchlist: 297,
  'my-comments': 361,
  'edit-profile': 239,
}

for (const [name, h] of Object.entries(screens)) {
  const upright = await sharp(`design-exports/profitkey-outview/${name}.png`)
    .rotate(15, { background: '#ffffff' })
    .png()
    .toBuffer({ resolveWithObject: true })
  const w = 442 * SCALE - INSET * 2
  const height = h * SCALE - INSET * 2
  const info = await sharp(upright.data)
    .extract({
      left: Math.round((upright.info.width - w) / 2),
      top: Math.round((upright.info.height - height) / 2),
      width: w,
      height,
    })
    .resize({ width: 1400 })
    .webp({ quality: 86 })
    .toFile(`public/images/screens/profitkey-ov-${name}.webp`)
  console.log(name, info.width, info.height)
}
