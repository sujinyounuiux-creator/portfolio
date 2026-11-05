// Joins the two Cookpad recipe frames (Portfolio Figma 27:4207 and 27:3685) into one long page.
// Recipe steps sit 90px apart, so page 2 starts where step 3 falls in that rhythm. The sidebar and
// the + button are fixed on screen, so only one of each stays: page 1's sidebar, page 2's button.
// Source: design-exports/cookpad-recipe/page[12].png → public/images/projects/cookpad-recipe-full.webp
import sharp from 'sharp'

sharp.cache(false)
const dir = 'design-exports/cookpad-recipe'
const WIDTH = 1920
const SEAM = 1038 // page 1's step 2 ends above this; page 2's step 3 centre lands 90px after step 2's
const SHIFT = 4 // page 2's content sits 4px right of page 1's, so its steps are moved back to line up
const white = (width, height) => ({ create: { width, height, channels: 3, background: '#fff' } })

const patch = async (w, h, left, top) => ({ input: await sharp(white(w, h)).png().toBuffer(), left, top })

const page1 = await sharp(`${dir}/page1.png`)
  .removeAlpha()
  .composite([await patch(160, 140, 1690, 895)]) // the + button
  .extract({ left: 0, top: 0, width: WIDTH, height: SEAM })
  .png()
  .toBuffer()

const page2 = await sharp(`${dir}/page2.png`)
  .removeAlpha()
  .composite([await patch(210, 700, 0, 40)]) // the sidebar and its soft shadow
  .png()
  .toBuffer()
const page2Shifted = await sharp(page2).extract({ left: SHIFT, top: 0, width: WIDTH - SHIFT, height: 1080 }).png().toBuffer()

const joined = await sharp(white(WIDTH, SEAM + 1080))
  .composite([
    { input: page1, left: 0, top: 0 },
    { input: page2Shifted, left: 0, top: SEAM },
  ])
  .png()
  .toBuffer()

const out = await sharp(joined).resize({ width: 1600 }).webp({ quality: 90 }).toFile('public/images/projects/cookpad-recipe-full.webp')
console.log(out.width, out.height)
