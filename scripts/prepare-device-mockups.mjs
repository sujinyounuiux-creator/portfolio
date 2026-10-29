// Realistic device frames for the mockups: an iPhone and a desktop monitor, rendered with
// Figma AI in the Portfolio file (nodes 390:3063 and 391:3063) with the display filled in
// flat magenta and a white background.
// Here the magenta display becomes a see-through window (its soft edge against the black
// bezel becomes partly see-through black), the white background around the device is
// removed by flood filling from the edges, and the image is trimmed. The screen's position
// is saved as percentages so DeviceFrame can place real screens exactly behind the window.
// Source: design-exports/mockups/<name>-raw.png
// A mask the shape of the display (grown by a few pixels so it tucks under the bezel) is
// saved too, so the screen behind the frame never shows past the rounded corners.
// Output: public/images/mockups/<name>.webp, <name>-mask.png and src/data/mockups.json
import { mkdirSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

sharp.cache(false)
mkdirSync('public/images/mockups', { recursive: true })

const result = {}
for (const name of ['iphone', 'monitor']) {
  const { data, info } = await sharp(`design-exports/mockups/${name}-raw.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const display = new Uint8Array(w * h) // 1 where the magenta display is
  // display: magenta, or magenta blended into the black bezel
  let x0 = w, y0 = h, x1 = 0, y1 = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      if (g > 90 || r < g + 40 || b < g + 40) continue
      const k = Math.min(r, b) / 255 // how much magenta is in it
      if (k > 0.1) display[y * w + x] = 1
      if (k > 0.85) {
        if (x < x0) x0 = x
        if (y < y0) y0 = y
        if (x > x1) x1 = x
        if (y > y1) y1 = y
      }
      data[i] = data[i + 1] = data[i + 2] = 0
      data[i + 3] = Math.round(data[i + 3] * (1 - Math.min(1, k * 1.15)))
    }
  }
  // white background around the device
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1])
  for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y])
  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= w || y >= h || seen[y * w + x]) continue
    seen[y * w + x] = 1
    const i = (y * w + x) * 4
    if (data[i] < 238 || data[i + 1] < 238 || data[i + 2] < 238) continue
    data[i + 3] = 0
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
  // display mask, grown by 3 px so it reaches under the bezel edge
  const mask = Buffer.alloc(w * h)
  const R = 3
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!display[y * w + x]) continue
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const xx = x + dx, yy = y + dy
        if (xx >= 0 && yy >= 0 && xx < w && yy < h) mask[yy * w + xx] = 255
      }
    }
  }
  // trim to the device
  const { data: td, info: ti } = await sharp(data, { raw: info }).trim({ threshold: 1 }).raw().toBuffer({ resolveWithObject: true })
  const meta = await sharp(data, { raw: info }).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true })
  const ox = -(meta.info.trimOffsetLeft ?? 0) // trim offsets are negative: how far the box moved
  const oy = -(meta.info.trimOffsetTop ?? 0)
  const out = await sharp(td, { raw: ti }).webp({ quality: 90, alphaQuality: 100 }).toFile(`public/images/mockups/${name}.webp`)
  // the mask, cut to the same box as the trimmed frame: opaque over the display,
  // transparent elsewhere (CSS masks use the alpha channel)
  const rgba = Buffer.alloc(w * h * 4, 255)
  for (let i = 0; i < w * h; i++) rgba[i * 4 + 3] = mask[i]
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: ox, top: oy, width: out.width, height: out.height })
    .png()
    .toFile(`public/images/mockups/${name}-mask.png`)
  const pct = (v, total) => Math.round((v / total) * 10000) / 100
  result[name] = {
    width: out.width,
    height: out.height,
    screen: { left: pct(x0 - ox, out.width), top: pct(y0 - oy, out.height), width: pct(x1 - x0 + 1, out.width), height: pct(y1 - y0 + 1, out.height) },
  }
  console.log(name, JSON.stringify(result[name]))
}
writeFileSync('src/data/mockups.json', JSON.stringify(result, null, 2) + '\n')
