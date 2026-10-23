// Converts personal photos for the About Me collage.
// Keeps each photo's full frame (no cropping), only resizes and compresses.
// Usage: node scripts/import-about-photos.mjs <sourceDir>
//   Files are processed in name order and saved as public/images/about/photo-1.webp, photo-2.webp, …
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const src = path.resolve(process.argv[2] ?? 'design-exports/about-photos')
const out = path.resolve('public/images/about')
await mkdir(out, { recursive: true })

const files = (await readdir(src)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

for (const [i, file] of files.entries()) {
  const info = await sharp(path.join(src, file))
    .rotate() // respect camera orientation
    .resize({ width: 900, height: 900, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(out, `photo-${i + 1}.webp`))
  console.log(`${file} -> photo-${i + 1}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`)
}
