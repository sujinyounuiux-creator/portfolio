// Erases the blue star (top left) and heart (right) doodles drawn into the character
// artwork, keeping the character and the small dash marks around her. Visitors add
// their own stars and hearts with the stamps on the Home page instead.
// Each doodle is a separate shape: every opaque shape whose box overlaps one of the
// regions below is cleared, plus a 3 px halo for its soft crayon edge.
// Source: design-exports/character-with-doodles.webp (the art before this step)
// Output: public/images/character.webp (same 900x817 size, so the layout stays put)
import sharp from 'sharp'

const src = process.argv[2] ?? 'design-exports/character-with-doodles.webp'
const out = process.argv[3] ?? 'public/images/character.webp'
// [x0, y0, x1, y1] of the star and the heart in the 900x817 art
const regions = [
  [86, 34, 200, 138],
  [820, 401, 899, 492],
]

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: w, height: h } = info
const solid = (p) => data[p * 4 + 3] >= 40

// label opaque shapes
const lab = new Int32Array(w * h).fill(-1)
const boxes = []
for (let p = 0; p < w * h; p++) {
  if (lab[p] !== -1 || !solid(p)) continue
  const id = boxes.length
  const b = [w, h, 0, 0]
  const stack = [p]
  lab[p] = id
  while (stack.length) {
    const q = stack.pop()
    const x = q % w
    const y = (q / w) | 0
    b[0] = Math.min(b[0], x); b[1] = Math.min(b[1], y); b[2] = Math.max(b[2], x); b[3] = Math.max(b[3], y)
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
        const n = ny * w + nx
        if (lab[n] === -1 && solid(n)) { lab[n] = id; stack.push(n) }
      }
  }
  boxes.push(b)
}

// the doodles are the shapes that sit inside a region (the character itself is far larger)
const inside = (b, r) => b[0] >= r[0] - 4 && b[1] >= r[1] - 4 && b[2] <= r[2] + 4 && b[3] <= r[3] + 4
const doomed = new Set(boxes.map((b, id) => (regions.some((r) => inside(b, r)) ? id : -1)).filter((id) => id >= 0))

const HALO = 3
let cleared = 0
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    const p = y * w + x
    let hit = false
    for (let dy = -HALO; dy <= HALO && !hit; dy++)
      for (let dx = -HALO; dx <= HALO && !hit; dx++) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && doomed.has(lab[ny * w + nx])) hit = true
      }
    // clear the doodle and its faint edge, never pixels of other shapes
    if (hit && (lab[p] === -1 || doomed.has(lab[p]))) {
      data[p * 4 + 3] = 0
      cleared++
    }
  }

const i = await sharp(data, { raw: info }).webp({ quality: 88, alphaQuality: 90 }).toFile(out)
console.log(`erased ${doomed.size} doodles (${cleared} px) -> ${out} ${i.width}x${i.height}`)
