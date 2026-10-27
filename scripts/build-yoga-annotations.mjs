// Marks the problem areas on the original Open Door Yoga pages for the heuristic evaluation.
// Each panel is a crop of a full page capture (public/images/yoga-audit/*.webp, 1600 wide,
// made by scripts/prepare-yoga-audit.mjs) with dashed boxes and numbered badges, coloured by
// the heuristic they break. The findings come from the team's evaluation slides in Figma.
// Output: public/images/projects/yoga-issues-*.webp (1200 wide)
import sharp from 'sharp'

sharp.cache(false)

const COLOURS = {
  visibility: '#7c4dbd', // Visibility of system status
  recognition: '#d64545', // Recognition rather than recall
  consistency: '#e0921c', // Consistency and standards
}

// boxes are [x1, y1, x2, y2] in page coordinates; `n` is the note number shown in the badge
const panels = [
  {
    out: 'yoga-issues-home-top',
    src: 'home',
    crop: [0, 640],
    boxes: [{ n: 1, type: 'visibility', box: [290, 120, 1300, 180] }],
  },
  {
    out: 'yoga-issues-home-passes',
    src: 'home',
    crop: [2180, 3860],
    boxes: [
      { n: 2, type: 'recognition', box: [155, 2405, 1000, 3142] },
      { n: 3, type: 'recognition', box: [1039, 2405, 1444, 2830] },
      { n: 4, type: 'consistency', box: [486, 2650, 675, 2689] },
      { n: 4, type: 'consistency', box: [486, 3042, 675, 3080], badge: false },
      { n: 4, type: 'consistency', box: [1161, 2708, 1319, 2747], badge: false },
      { n: 4, type: 'consistency', box: [1083, 3739, 1339, 3794], badge: false },
    ],
  },
  {
    out: 'yoga-issues-schedule',
    src: 'schedule',
    crop: [410, 1560],
    boxes: [
      { n: 5, type: 'recognition', box: [175, 462, 1470, 800] },
      { n: 6, type: 'recognition', box: [178, 1016, 1027, 1511] },
    ],
  },
  {
    out: 'yoga-issues-training',
    src: 'training',
    crop: [2740, 4430],
    boxes: [
      { n: 7, type: 'visibility', box: [150, 2798, 1450, 3150] },
      { n: 8, type: 'recognition', box: [150, 4090, 1450, 4408] },
    ],
  },
]

const PAD = 8 // space between the content and the dashed line
const R = 22 // badge radius

for (const p of panels) {
  const [top, bottom] = p.crop
  const src = `public/images/yoga-audit/${p.src}.webp`
  const { width } = await sharp(src).metadata()
  const h = bottom - top
  const crop = await sharp(src).extract({ left: 0, top, width, height: h }).png().toBuffer()

  let svg = ''
  for (const b of p.boxes) {
    const c = COLOURS[b.type]
    const x = Math.max(4, b.box[0] - PAD)
    const y = Math.max(4, b.box[1] - top - PAD)
    const w = Math.min(width - 4, b.box[2] + PAD) - x
    const bh = Math.min(h - 4, b.box[3] - top + PAD) - y
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${bh}" rx="10" fill="${c}" fill-opacity="0.07" stroke="${c}" stroke-width="5" stroke-dasharray="16 10"/>`
    if (b.badge !== false) {
      const cx = Math.max(R + 4, x)
      const cy = Math.max(R + 4, y)
      svg += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${c}" stroke="#fff" stroke-width="4"/>`
      svg += `<text x="${cx}" y="${cy + 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#fff">${b.n}</text>`
    }
  }
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}">${svg}</svg>`)
  // composite at full size first, then scale down (sharp resizes before compositing otherwise)
  const marked = await sharp(crop).composite([{ input: overlay }]).png().toBuffer()
  const out = await sharp(marked).resize({ width: 1200 }).webp({ quality: 86 }).toFile(`public/images/projects/${p.out}.webp`)
  console.log(p.out, out.width, out.height)
}
