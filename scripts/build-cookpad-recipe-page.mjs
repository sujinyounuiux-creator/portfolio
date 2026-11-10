// Joins the two Cookpad recipe frames (Portfolio Figma 27:4207 and 27:3685) into one long page.
// Recipe steps sit 90px apart, so page 2 starts where step 3 falls in that rhythm. The sidebar
// is fixed on screen, so only page 1's stays. The + button and its Add Recipe balloon are cut out
// on their own: the + stays still while the page scrolls under it, and hovering it shows the
// balloon (components/FixedAddButton.tsx).
// Source: design-exports/cookpad-recipe/page[12].png
// Output, in public/images/projects:
//   cookpad-recipe-scroll.webp      the page without the button
//   cookpad-add-plus.webp           the + button, with a transparent background
//   cookpad-add-balloon.webp        the Add Recipe balloon, with a transparent background
//   cookpad-sidebar.webp            the side menu, which also stays still while the page scrolls
import sharp from 'sharp'

sharp.cache(false)
const dir = 'design-exports/cookpad-recipe'
const out = 'public/images/projects'
const WIDTH = 1920
const SEAM = 1038 // page 1's step 2 ends above this; page 2's step 3 centre lands 90px after step 2's
const SHIFT = 4 // page 2's content sits 4px right of page 1's, so its steps are moved back to line up
const BUTTON = { left: 1660, top: 805, width: 210, height: 225 } // both parts, in page 2 before the shift
const BALLOON = { left: 1660, top: 805, width: 210, height: 100 }
const SIDEBAR = { left: 20, top: 64, width: 175, height: 658 } // in page 1, with its soft shadow
const PLUS = { left: 1704, top: 910, width: 122, height: 120 }

const white = (width, height) => ({ create: { width, height, channels: 3, background: '#fff' } })
const patch = async (w, h, left, top) => ({ input: await sharp(white(w, h)).png().toBuffer(), left, top })

const page1 = await sharp(`${dir}/page1.png`)
  .removeAlpha()
  .composite([
    await patch(160, 140, 1690, 895), // page 1's + button
    await patch(SIDEBAR.width, SIDEBAR.height, SIDEBAR.left, SIDEBAR.top), // the side menu, drawn on top instead
  ])
  .extract({ left: 0, top: 0, width: WIDTH, height: SEAM })
  .png()
  .toBuffer()

const page2 = async () => {
  const patches = [
    await patch(210, 700, 0, 40), // the sidebar and its soft shadow
    await patch(BUTTON.width, BUTTON.height, BUTTON.left, BUTTON.top),
  ]
  const flat = await sharp(`${dir}/page2.png`).removeAlpha().composite(patches).png().toBuffer()
  return sharp(flat).extract({ left: SHIFT, top: 0, width: WIDTH - SHIFT, height: 1080 }).png().toBuffer()
}

const joined = await sharp(white(WIDTH, SEAM + 1080))
  .composite([
    { input: page1, left: 0, top: 0 },
    { input: await page2(), left: 0, top: SEAM },
  ])
  .png()
  .toBuffer()
const page = await sharp(joined).resize({ width: 1600 }).webp({ quality: 90 }).toFile(`${out}/cookpad-recipe-scroll.webp`)
console.log('page', page.width, page.height)

// a part alone: flood in from the crop's edges, so the white inside the + stays white
async function cutOut(region, file, page = 'page2') {
  const { data, info } = await sharp(`${dir}/${page}.png`).removeAlpha().extract(region).raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const lightest = (x, y) => {
    const i = (y * w + x) * 3
    return Math.min(data[i], data[i + 1], data[i + 2])
  }
  const outside = new Uint8Array(w * h)
  const stack = []
  const visit = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h || outside[y * w + x] || lightest(x, y) < 250) return
    outside[y * w + x] = 1
    stack.push(x, y)
  }
  for (let x = 0; x < w; x++) {
    visit(x, 0)
    visit(x, h - 1)
  }
  for (let y = 0; y < h; y++) {
    visit(0, y)
    visit(w - 1, y)
  }
  while (stack.length) {
    const y = stack.pop()
    const x = stack.pop()
    visit(x + 1, y)
    visit(x - 1, y)
    visit(x, y + 1)
    visit(x, y - 1)
  }
  const isOut = (x, y) => x >= 0 && y >= 0 && x < w && y < h && outside[y * w + x] === 1
  const rgba = Buffer.alloc(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3
      const o = (y * w + x) * 4
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      // the edge next to the outside fades out; everything else stays solid
      const a = isOut(x, y) ? 0 : isOut(x - 1, y) || isOut(x + 1, y) || isOut(x, y - 1) || isOut(x, y + 1) ? 255 - Math.min(r, g, b) : 255
      if (a > 0) {
        const k = a === 255 ? 1 : 255 / a
        const m = a === 255 ? 0 : 255 - a
        rgba[o] = Math.round((r - m) * k)
        rgba[o + 1] = Math.round((g - m) * k)
        rgba[o + 2] = Math.round((b - m) * k)
      }
      rgba[o + 3] = a
    }
  }
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${out}/${file}.webp`)
  console.log(file, w, h)
}

await cutOut(PLUS, 'cookpad-add-plus')
await cutOut(BALLOON, 'cookpad-add-balloon')
await cutOut(SIDEBAR, 'cookpad-sidebar', 'page1')
