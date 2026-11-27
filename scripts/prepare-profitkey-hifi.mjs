// PROFITKEY screens in high resolution, from the hi-fi frames in the Portfolio Figma file.
// Each frame was exported about 2,600 px wide (a temporary scaled copy, deleted after) to
// design-exports/profitkey-hifi/<name>.png:
//   web-home        PROFITKEY Home (hi-fi stock cards)  575:3119
//   web-detail      PROFITKEY Stock detail (hi-fi)      584:3138
//   en-watchlist    PROFITKEY Watchlist (hi-fi)         585:3157
//   en-community 355:2936, en-my-comments 355:3368, en-edit-profile 355:3168, en-notice 355:2813,
//   en-faq 355:2846, en-news 355:3247, en-notice-list 565:3393, en-login 489:3049
// The export carries the frame's grey drop shadow, so each side is scanned in to the white page
// and cropped there; the page is then saved 2400 px wide.
// Output: public/images/screens/profitkey-<name>.webp
// (This replaces update-profitkey-detail, fix-profitkey-table, place-profitkey-detail-parts and
// prepare-profitkey-english for these screens; run crop-profitkey-features after it.)
import sharp from 'sharp'

sharp.cache(false)
const WIDTH = 2400
const names = ['web-home', 'web-detail', 'en-watchlist', 'en-community', 'en-my-comments', 'en-edit-profile', 'en-notice', 'en-faq', 'en-news', 'en-notice-list', 'en-login']

for (const name of names) {
  const src = `design-exports/profitkey-hifi/${name}.png`
  const { data, info } = await sharp(src).flatten({ background: '#808080' }).raw().toBuffer({ resolveWithObject: true })
  const C = info.channels
  const white = (x, y) => {
    const i = (y * info.width + x) * C
    return data[i] >= 248 && data[i + 1] >= 248 && data[i + 2] >= 248
  }
  const midY = Math.round(info.height / 3)
  const midX = Math.round(info.width / 2)
  let left = 0
  while (left < info.width / 4 && !white(left, midY)) left++
  let right = info.width - 1
  while (right > info.width * 0.75 && !white(right, midY)) right--
  let top = 0
  while (top < info.height / 4 && !white(midX, top)) top++
  let bottom = info.height - 1
  while (bottom > info.height * 0.75 && !white(midX, bottom)) bottom--
  const out = await sharp(src)
    .flatten({ background: '#ffffff' })
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .resize({ width: WIDTH })
    .webp({ quality: 88 })
    .toFile(`public/images/screens/profitkey-${name}.webp`)
  console.log(name, out.width, out.height, { left, top, right, bottom })
}
