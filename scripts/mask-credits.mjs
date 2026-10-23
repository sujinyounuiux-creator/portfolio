// Covers teammate-name credits baked into Figma exports (e.g. a footer line
// "2026, Designed by, …" or "… & …" on a cover) with the surrounding background
// colour, so no teammate names appear on the public site.
// Rects are in Figma frame coordinates and are scaled to each export.
// Usage: node scripts/mask-credits.mjs   (edits files in design-exports/ in place)
import sharp from 'sharp'

const jobs = [
  // file, frame width, y offset of the export (render bounds above the frame), rects [x, y, w, h]
  { file: 'yoga-home.png', frameW: 1440, rects: [[67, 3194, 266, 14]] },
  { file: 'yoga-pricing.png', frameW: 1440, rects: [[68, 3082, 266, 14]] },
  { file: 'yoga-training.png', frameW: 1440, rects: [[71, 4460, 266, 14]] },
  { file: 'yoga-about.png', frameW: 1440, rects: [[68, 3284, 266, 14]] },
  { file: 'yoga-mobile-pricing.png', frameW: 402, yOffset: 14, rects: [[25, 4506, 233, 13]] },
  { file: 'yoga-wireframe-home.png', frameW: 1440, rects: [[46, 2894, 156, 9]] },
  { file: 'yoga-components.png', frameW: 3587, rects: [[2119, 1764, 266, 14], [2119, 2169, 266, 14]] },
  // LastCow cover: team names line under the tagline (stops before the phone mockup)
  { file: 'lastcow-cover.png', frameW: 1920, rects: [[594, 657, 530, 56]] },
]

for (const job of jobs) {
  const path = `design-exports/${job.file}`
  const img = sharp(path)
  const { width, height } = await img.metadata()
  const raw = await img.clone().removeAlpha().raw().toBuffer()
  const s = width / job.frameW
  const overlays = []
  for (const [x, y, w, h] of job.rects) {
    const pad = Math.max(2, Math.round(6 * s))
    const left = Math.max(0, Math.round(x * s) - pad)
    const top = Math.max(0, Math.round((y + (job.yOffset ?? 0)) * s) - pad)
    const rw = Math.min(width - left, Math.round(w * s) + pad * 2)
    const rh = Math.min(height - top, Math.round(h * s) + pad * 2)
    // sample the background just left of the text block
    const sx = Math.max(0, left - 2)
    const sy = Math.min(height - 1, top + Math.round(rh / 2))
    const i = (sy * width + sx) * 3
    const colour = { r: raw[i], g: raw[i + 1], b: raw[i + 2] }
    overlays.push({ input: { create: { width: rw, height: rh, channels: 3, background: colour } }, left, top })
    console.log(`${job.file}: covered ${rw}x${rh} at ${left},${top} with rgb(${colour.r},${colour.g},${colour.b})`)
  }
  const buf = await sharp(path).composite(overlays).png().toBuffer()
  await sharp(buf).toFile(path)
}
