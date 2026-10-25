// LastCow UI kit: real components exported one by one from the design file's Components page
// (Atoms / Molecules / Organisms), cleaned into uniform tiles for the case study.
// Each export's lavender section fill (#E8E8F7-ish) and dashed component-set outline are made
// transparent, then the component is trimmed and centred on a white tile of a fixed shape.
// Also: the persona card is cropped from the revised persona slide (its stroke painted out of the corners).
// Sources: design-exports/lastcow-kit/*.png, design-exports/lastcow-persona-v2.png
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const OUT = 'public/images/lastcow-kit'
mkdirSync(OUT, { recursive: true })

// tile width × height (px) and the component's max share of the tile
const tiles = {
  buttons: [1600, 520, 0.92],
  input: [800, 640, 0.86],
  location: [800, 640, 0.86],
  'event-card': [800, 640, 0.8],
  calendar: [800, 800, 0.84],
  'ticket-bar': [800, 520, 0.88],
  'menu-bar': [800, 520, 0.9],
}

const isBackdrop = (r, g, b) =>
  // lavender section fill and the purple dashed outline
  (r > 220 && g > 220 && b > 235 && b - r > 6) || (r > 120 && r < 180 && g < 140 && b > 200)

for (const [name, [tw, th, share]] of Object.entries(tiles)) {
  const src = `design-exports/lastcow-kit/${name}.png`
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) if (isBackdrop(data[i], data[i + 1], data[i + 2])) data[i + 3] = 0
  let comp = await sharp(data, { raw: info }).png().toBuffer()
  comp = await sharp(comp).trim({ threshold: 1 }).png().toBuffer()
  // the menu bar set stacks five states; show just the first two
  if (name === 'menu-bar') {
    const m = await sharp(comp).metadata()
    comp = await sharp(comp).extract({ left: 0, top: 0, width: m.width, height: Math.round(m.height * 0.42) }).png().toBuffer()
  }
  const resized = await sharp(comp)
    .resize({ width: Math.round(tw * share), height: Math.round(th * share), fit: 'inside' })
    .png()
    .toBuffer()
  const m = await sharp(resized).metadata()
  const info2 = await sharp({ create: { width: tw, height: th, channels: 3, background: '#ffffff' } })
    .composite([{ input: resized, left: Math.round((tw - m.width) / 2), top: Math.round((th - m.height) / 2) }])
    .webp({ quality: 90 })
    .toFile(`${OUT}/${name}.webp`)
  console.log(name, info2.width, info2.height)
}

// persona card, cropped to the card
{
  const src = 'design-exports/lastcow-persona-v2.png'
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const px = (x, y) => {
    const i = (y * info.width + x) * 3
    return [data[i], data[i + 1], data[i + 2]]
  }
  const purple = ([r, g, b]) => b > 60 && r < 70 && g < 40
  const my = Math.round(info.height * 0.6)
  const mx = Math.round(info.width * 0.5)
  let l = 0
  while (purple(px(l, my))) l++
  let r = info.width - 1
  while (purple(px(r, my))) r--
  let t = Math.round(info.height * 0.15)
  while (purple(px(mx, t))) t++
  let b = info.height - 1
  while (purple(px(mx, b))) b--
  const w = r - l + 1
  const h = b - t + 1
  const rad = Math.round(w * 0.022)
  // the card's purple stroke still curves through the four corners: paint each corner, outside
  // a slightly tighter rounded rect, with the card's own background next to it (the photo
  // backdrop on the left, white on the right). The site's figure frame rounds the corners.
  // also trim a few px off every side: the stroke and its shadow leave a thin grey line on the edges
  const IN = Math.round(w * 0.003)
  const { data: cd, info: ci } = await sharp(src).extract({ left: l + IN, top: t + IN, width: w - IN * 2, height: h - IN * 2 }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const R = rad + Math.round(w * 0.014)
  const fill = (x0, y0, sx, sy) => {
    const k = (sy * ci.width + sx) * 3
    const c = [cd[k], cd[k + 1], cd[k + 2]]
    for (let y = 0; y < R; y++)
      for (let x = 0; x < R; x++) {
        const dx = R - x, dy = R - y
        if (dx * dx + dy * dy <= (R - rad * 0.9) ** 2) continue
        const px = x0 < 0 ? ci.width - 1 - x : x, py = y0 < 0 ? ci.height - 1 - y : y
        const j = (py * ci.width + px) * 3
        cd[j] = c[0]; cd[j + 1] = c[1]; cd[j + 2] = c[2]
      }
  }
  fill(0, 0, R + 2, R + 2)
  fill(0, -1, R + 2, ci.height - R - 3)
  fill(-1, 0, ci.width - R - 3, R + 2)
  fill(-1, -1, ci.width - R - 3, ci.height - R - 3)
  const i = await sharp(cd, { raw: ci }).resize({ width: 1600 }).webp({ quality: 88 }).toFile('public/images/projects/lastcow-persona.webp')
  console.log('persona', i.width, i.height)
}
