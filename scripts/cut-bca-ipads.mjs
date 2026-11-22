// The iPad frames export on a white canvas. This makes the white around the iPad transparent
// (flood fill from the edges, so white inside the screen stays), trims it and saves the webp.
// Input: design-exports/bca/ipad-<name>.png (Figma 1392:11105, 1392:13857, 1392:14940 at 1.5x)
// Output: public/images/projects/bca-ipad-<name>.webp, 1100 px wide
import sharp from 'sharp'

for (const name of ['home', 'events-month', 'business']) {
  const { data, info } = await sharp(`design-exports/bca/ipad-${name}.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const isBg = (i) => data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push(x, 0, x, h - 1)
  for (let y = 0; y < h; y++) stack.push(0, y, w - 1, y)
  while (stack.length) {
    const y = stack.pop()
    const x = stack.pop()
    if (x < 0 || y < 0 || x >= w || y >= h || seen[y * w + x]) continue
    seen[y * w + x] = 1
    const i = (y * w + x) * 4
    if (!isBg(i)) continue
    data[i + 3] = 0
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1)
  }
  const out = await sharp(data, { raw: info }).trim().resize({ width: 1100 }).webp({ quality: 86, alphaQuality: 100 }).toFile(`public/images/projects/bca-ipad-${name}.webp`)
  console.log(name, out.width, out.height)
}
