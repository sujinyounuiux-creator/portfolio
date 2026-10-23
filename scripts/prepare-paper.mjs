// Prepares the paper texture used as the site background.
// The photo is made neutral grey and lifted close to white so that, multiplied over
// the cream background (see base.css), it adds grain without greying the page.
// Source: design-exports/paper-texture.webp → public/images/bg-paper.webp
import sharp from 'sharp'

const info = await sharp('design-exports/paper-texture.webp')
  .greyscale()
  .linear(1, 18) // mean ≈ 229 → ≈ 247, grain unchanged
  .webp({ quality: 82 })
  .toFile('public/images/bg-paper.webp')
console.log(`bg-paper.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`)
