// PROFITKEY screens translated into English by Sujin (Portfolio Figma file, frames 355:*).
// Exports include the frame's grey drop shadow; scan in from each edge to the white page and crop.
// Source: design-exports/profitkey-english/*.png → public/images/screens/profitkey-en-*.webp
import sharp from 'sharp'

for (const name of ['notice', 'faq', 'news', 'community', 'my-comments', 'watchlist', 'edit-profile']) {
  const src = `design-exports/profitkey-english/${name}.png`
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const white = (x, y) => {
    const i = (y * info.width + x) * 3
    return data[i] >= 250 && data[i + 1] >= 250 && data[i + 2] >= 250
  }
  const midY = Math.round(info.height / 2)
  const midX = Math.round(info.width / 2)
  let left = 0
  while (!white(left, midY)) left++
  let right = info.width - 1
  while (!white(right, midY)) right--
  let top = 0
  while (!white(midX, top)) top++
  let bottom = info.height - 1
  while (!white(midX, bottom)) bottom--

  const out = await sharp(src)
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .resize({ width: 1400 })
    .webp({ quality: 88 })
    .toFile(`public/images/screens/profitkey-en-${name}.webp`)
  console.log(name, out.width, out.height)
}
