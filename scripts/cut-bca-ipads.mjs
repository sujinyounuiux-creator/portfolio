// The iPad frames export on a white canvas. This makes the white around the iPad transparent,
// turns the light blue frame black
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
  // the frame's light blue body and buttons become black: only bluish pixels near the outside of
  // the iPad are touched (the screen starts well inside), each mapped to a dark grey of similar
  // relative lightness, so the frame keeps its subtle shading
  let x0 = w, y0 = h, x1 = 0, y1 = 0
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
  const EDGE = 60 // px at 1.5x: the body ring is 12 px and the buttons stick out 12 px; the screen starts 84 px in
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      // the drop shadow pushes the bottom of the image further out, so the bottom gets more room
      if (Math.min(x - x0, x1 - x, y - y0, (y1 - y) / 2.5) > EDGE) continue
      const i = (y * w + x) * 4
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      if (!data[i + 3] || !(b > r + 6 && b >= g)) continue
      const l = (r + g + b) / 3 // about 115 to 220 on the blue frame, higher on its soft edge
      if (l > 215) {
        // the soft, nearly white rim where the frame met the white canvas: dark and see-through
        data[i + 3] = Math.round(Math.min(1, (255 - l) / 40) * data[i + 3])
        data[i] = data[i + 1] = 30
        data[i + 2] = 33
        continue
      }
      const v = Math.round(22 + Math.max(0, Math.min(1, (l - 110) / 120)) * 52)
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v + 3
    }
  }
  const out = await sharp(data, { raw: info }).trim().resize({ width: 1100 }).webp({ quality: 86, alphaQuality: 100 }).toFile(`public/images/projects/bca-ipad-${name}.webp`)
  console.log(name, out.width, out.height)
}
