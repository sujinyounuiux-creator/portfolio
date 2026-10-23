// The PROFITKEY page exports include the frame's grey drop shadow around the edges,
// which made the page look inset inside the laptop mockup. This finds the white page
// area (scanning in from each edge until the pixel is pure white) and crops to it.
// Source: design-exports/screens/profitkey-web-*.png → public/images/screens/profitkey-web-*.webp
import sharp from 'sharp'

for (const name of ['profitkey-web-home', 'profitkey-web-detail']) {
  const src = `design-exports/screens/${name}.png`
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const white = (x, y) => {
    const i = (y * info.width + x) * 3
    return data[i] >= 254 && data[i + 1] >= 254 && data[i + 2] >= 254
  }
  const midY = Math.round(info.height / 3)
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
    .webp({ quality: 86 })
    .toFile(`public/images/screens/${name}.webp`)
  console.log(name, { left, top, right, bottom }, '->', out.width, out.height)
}
