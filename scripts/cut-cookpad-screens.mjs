// Cuts the bare screen out of each old device mockup in the Cookpad "Overall UI" export
// (public/images/cookpad/device-*.webp, made by scripts/split-cookpad-devices.mjs), so the
// screens can sit in current device frames drawn in CSS (components/DeviceFrame.tsx).
// The screen is the white area around the middle of each device; the phone's notch,
// which reaches into it, is painted white.
// Output: public/images/cookpad/screen-<device>.webp
import sharp from 'sharp'

sharp.cache(false)

for (const name of ['phone', 'tablet', 'laptop', 'desktop']) {
  const src = `public/images/cookpad/device-${name}.webp`
  const { data, info } = await sharp(src).flatten({ background: '#000000' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const white = (x, y) => {
    const i = (y * w + x) * 3
    return data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235
  }
  // grow white areas from a few seeds across the device; the biggest one is the screen
  // (a single seed can land on a small white shape, like the chef's hat in the logo)
  const seen = new Uint8Array(w * h)
  let best = null
  for (const [fx, fy] of [[0.5, 0.25], [0.2, 0.35], [0.8, 0.35], [0.3, 0.6], [0.7, 0.6], [0.5, 0.5]]) {
    const sx = Math.round(w * fx)
    const sy = Math.round(h * fy)
    if (!white(sx, sy) || seen[sy * w + sx]) continue
    const stack = [[sx, sy]]
    let x0 = w, y0 = h, x1 = 0, y1 = 0, n = 0
    while (stack.length) {
      const [x, y] = stack.pop()
      if (x < 0 || y < 0 || x >= w || y >= h || seen[y * w + x] || !white(x, y)) continue
      seen[y * w + x] = 1
      n++
      if (x < x0) x0 = x
      if (y < y0) y0 = y
      if (x > x1) x1 = x
      if (y > y1) y1 = y
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }
    if (!best || n > best.n) best = { n, x0, y0, x1, y1 }
  }
  const { x0, y0, x1, y1 } = best
  const box = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }
  let img = sharp(src).flatten({ background: '#ffffff' }).extract(box)
  if (name === 'phone') {
    // paint over the old notch at the top centre (the new frame draws a Dynamic Island)
    // and the old frame's rounded corners and side button shadow along the edges
    const e = Math.round(box.width * 0.05)
    const notch = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}"><g fill="#fff"><rect x="${box.width * 0.2}" y="0" width="${box.width * 0.6}" height="${box.height * 0.045}"/><rect x="0" y="0" width="${e}" height="${box.height}"/><rect x="${box.width - e}" y="0" width="${e}" height="${box.height}"/><rect x="0" y="0" width="${box.width}" height="${e}"/><rect x="0" y="${box.height - e}" width="${box.width}" height="${e}"/></g></svg>`)
    img = sharp(await img.png().toBuffer()).composite([{ input: notch }])
  }
  const out = await img.webp({ quality: 92 }).toFile(`public/images/cookpad/screen-${name}.webp`)
  console.log(name, out.width, out.height, (out.width / out.height).toFixed(3))
}
