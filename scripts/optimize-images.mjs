// Converts raw Figma exports (PNG) into optimized WebP files for the site.
// Usage: node scripts/optimize-images.mjs [sourceDir]
// Default source: design-exports/ (original Figma PNG exports) -> output: public/images/projects/
// Note: yoga-thumb.webp is a hand-made crop of yoga-home and is not regenerated here.
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const src = path.resolve(process.argv[2] ?? 'design-exports')
const out = path.resolve('public/images/projects')
await mkdir(out, { recursive: true })

for (const file of await readdir(src)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue
  const name = file.replace(/\.(png|jpe?g)$/i, '')
  const img = sharp(path.join(src, file))
  const { width, height } = await img.metadata()
  const tall = height > width * 1.4
  const target = Math.min(width, tall ? 1200 : 1600)
  const info = await img
    .resize({ width: target, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(out, `${name}.webp`))
  console.log(`${name}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`)
}
