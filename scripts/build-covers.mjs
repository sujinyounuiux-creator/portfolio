// Builds the project covers (Cookpad, PROFITKEY, Open Door Yoga) in one shared layout:
// title block on the left, two real screens in browser windows on the right, and a
// third real piece (a phone or a floating UI card) in front. Everything inside the
// windows, phone and cards is cut from the real Figma exports; nothing new is drawn there.
// Output: public/images/projects/<slug>-cover.webp (1600x900)
// Usage: node scripts/build-covers.mjs [slug ...]   (no args: all)
import sharp from 'sharp'

const W = 1600
const H = 900
const SANS = "'Segoe UI', Arial, sans-serif"

const projects = {
  cookpad: {
    out: 'cookpad-cover',
    bg: '#FFF4E8',
    accent: '#FF9934',
    ink: '#370000',
    grey: '#646464',
    line: '#F1DCC6',
    shadow: '#5a2a00',
    // cookpad logo mark, cut from the real home page
    logo: { src: 'design-exports/cookpad-main.png', extract: { left: 502, top: 309, width: 178, height: 178 }, w: 92, h: 92, r: 46 },
    eyebrow: 'UI/UX REDESIGN',
    title: ['Cookpad'],
    subtitle: ['Easier recipe search, filters', 'and threaded comments'],
    tags: ['Responsive web', 'Search filters', 'Custom icons'],
    back: { src: 'design-exports/cookpad-list.png' },
    front: { src: 'design-exports/cookpad-recipe.png' },
    // the mobile home screen, cut from the original cover frame
    extra: { kind: 'phone', src: 'design-exports/cookpad-cover-frame.png', extract: { left: 1424, top: 386, width: 272, height: 585 } },
  },
  profitkey: {
    out: 'profitkey-cover',
    bg: '#FFF8E6',
    accent: '#FFB400',
    ink: '#333333',
    grey: '#6E6E6E',
    line: '#F0E2BC',
    shadow: '#4a3600',
    eyebrow: 'FINTECH WEBSITE',
    // the PROFITKEY wordmark (with the key), cut from the original cover frame
    wordmark: { src: 'design-exports/profitkey-cover-frame.png', extract: { left: 138, top: 282, width: 414, height: 112 }, w: 440 },
    subtitle: ['Finding the key to', 'investment success'],
    tags: ['AI stock picks', 'Plain language', 'Desktop web'],
    back: { src: 'public/images/screens/profitkey-web-home.webp', extract: { left: 0, top: 0, width: 1400, height: 788 } },
    front: { src: 'public/images/screens/profitkey-web-detail.webp', extract: { left: 0, top: 0, width: 1400, height: 788 } },
    // the AI Recommended Stocks card with its AI Comment
    extra: { kind: 'card', src: 'public/images/screens/profitkey-ai-pick.webp', w: 262, h: 288 },
  },
  'open-door-yoga': {
    out: 'yoga-cover',
    bg: '#F4F0F6',
    accent: '#6A4E77',
    ink: '#3B2A45',
    grey: '#6B6470',
    line: '#E2D8E7',
    shadow: '#2e1a3a',
    eyebrow: 'WEBSITE REDESIGN',
    title: ['Open Door', 'Yoga'],
    titleFont: "Georgia, 'Times New Roman', serif",
    titleSize: 80,
    subtitle: ['A calmer, clearer website for', 'an East Vancouver yoga studio'],
    tags: ['Heuristic review', 'Style guide', 'Pricing & About'],
    back: { src: 'design-exports/yoga-home.png', extract: { left: 0, top: 0, width: 1075, height: 605 } },
    front: { src: 'design-exports/yoga-pricing.png', extract: { left: 0, top: 0, width: 1114, height: 627 } },
    // the "Best Deal" 12 month pass card from the Pricing page
    extra: { kind: 'card', src: 'design-exports/yoga-pricing.png', extract: { left: 690, top: 1016, width: 320, height: 300 }, w: 320, h: 300 },
  },
}

const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`)
const shadowDef = (color, op, dy = 18, sd = 20) =>
  `<defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="${dy}" stdDeviation="${sd}" flood-color="${color}" flood-opacity="${op}"/></filter></defs>`
const mask = (w, h, r) => svg(w, h, `<rect width="${w}" height="${h}" rx="${r}" fill="#fff"/>`)
const rounded = async (src, w, h, r, extract) => {
  let img = sharp(src)
  if (extract) img = img.extract(extract)
  const buf = await img.resize(w, h).png().toBuffer()
  return sharp(buf).composite([{ input: mask(w, h, r), blend: 'dest-in' }]).png().toBuffer()
}
const esc = (s) => s.replace(/&/g, '&amp;')

const BAR = 30
const WIN_W = 700
const WIN_H = Math.round((WIN_W * 9) / 16)
const backAt = { x: 640, y: 70 }
const frontAt = { x: 820, y: 330 }

async function build(p) {
  // browser window chrome: soft shadow, white body, slim bar with three dots
  const chrome = svg(
    WIN_W + 80,
    WIN_H + BAR + 80,
    shadowDef(p.shadow, 0.16) +
      `<rect x="40" y="30" width="${WIN_W}" height="${WIN_H + BAR}" rx="14" fill="#fff" filter="url(#s)"/>` +
      `<path d="M40 ${30 + BAR} V44 a14 14 0 0 1 14 -14 H${40 + WIN_W - 14} a14 14 0 0 1 14 14 V${30 + BAR} Z" fill="${p.line}" opacity="0.55"/>` +
      [0, 1, 2].map((i) => `<circle cx="${62 + i * 16}" cy="${30 + BAR / 2}" r="5" fill="${p.accent}" opacity="${[1, 0.55, 0.3][i]}"/>`).join(''),
  )

  // left column: logo, eyebrow, title, subtitle, tags (stacked from the top)
  let y = 200
  const layers = []
  let text = ''
  if (p.logo) {
    layers.push({ input: await rounded(p.logo.src, p.logo.w, p.logo.h, p.logo.r, p.logo.extract), left: 110, top: y })
    y += p.logo.h + 50
  } else y += 70
  text += `<text x="110" y="${y}" font-family="${SANS}" font-size="22" font-weight="700" letter-spacing="4" fill="${p.accent === '#FFB400' ? '#C98A00' : p.accent}">${esc(p.eyebrow)}</text>`
  y += 24
  if (p.wordmark) {
    const wm = p.wordmark
    const h = Math.round((wm.w * wm.extract.height) / wm.extract.width)
    // the export has a light grey background: fade near-white pixels to transparent
    const { data, info } = await sharp(wm.src).extract(wm.extract).resize(wm.w, h).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    for (let i = 0; i < data.length; i += 4) {
      const m = Math.min(data[i], data[i + 1], data[i + 2])
      data[i + 3] = m >= 236 ? 0 : m >= 200 ? Math.round(((236 - m) / 36) * 255) : 255
    }
    layers.push({ input: await sharp(data, { raw: info }).png().toBuffer(), left: 104, top: y })
    y += h + 66
  } else {
    const size = p.titleSize ?? 104
    for (const line of p.title) {
      y += Math.round(size * 0.98)
      text += `<text x="106" y="${y}" font-family="${p.titleFont ?? SANS}" font-size="${size}" font-weight="700" fill="${p.ink}">${esc(line)}</text>`
    }
    y += 66
  }
  for (const line of p.subtitle) {
    text += `<text x="110" y="${y}" font-family="${SANS}" font-size="30" fill="${p.grey}">${esc(line)}</text>`
    y += 42
  }
  y += 2
  let x = 110
  for (const t of p.tags) {
    const w = Math.round(t.length * 10.4 + 52)
    text += `<rect x="${x}" y="${y}" width="${w}" height="44" rx="22" fill="#fff" stroke="${p.line}" stroke-width="2"/><text x="${x + w / 2}" y="${y + 29}" font-family="${SANS}" font-size="20" font-weight="600" fill="${p.ink}" text-anchor="middle">${esc(t)}</text>`
    x += w + 12
  }

  const bg = svg(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="${p.bg}"/>` +
      `<circle cx="1130" cy="470" r="420" fill="${p.accent}" opacity="0.13"/>` +
      `<circle cx="1490" cy="130" r="120" fill="${p.accent}" opacity="0.10"/>` +
      `<circle cx="560" cy="820" r="70" fill="${p.accent}" opacity="0.12"/>` +
      text,
  )

  const screen = (s) => rounded(s.src, WIN_W, WIN_H, 14, s.extract)
  layers.push(
    { input: chrome, left: backAt.x - 40, top: backAt.y - 30 },
    { input: await screen(p.back), left: backAt.x, top: backAt.y + BAR },
    { input: chrome, left: frontAt.x - 40, top: frontAt.y - 30 },
    { input: await screen(p.front), left: frontAt.x, top: frontAt.y + BAR },
  )

  const e = p.extra
  if (e.kind === 'phone') {
    const ph = { x: 1300, y: 300, w: 236, h: 500, pad: 9 }
    layers.push(
      { input: svg(ph.w + 80, ph.h + 80, shadowDef(p.shadow, 0.22, 20, 22) + `<rect x="40" y="30" width="${ph.w}" height="${ph.h}" rx="34" fill="#2b1a12" filter="url(#s)"/>`), left: ph.x - 40, top: ph.y - 30 },
      { input: await rounded(e.src, ph.w - ph.pad * 2, ph.h - ph.pad * 2, 26, e.extract), left: ph.x + ph.pad, top: ph.y + ph.pad },
    )
  } else {
    // a floating UI card in front of the windows' lower right corner
    const cx = 1560 - e.w
    const cy = 860 - e.h
    layers.push(
      { input: svg(e.w + 80, e.h + 80, shadowDef(p.shadow, 0.22, 20, 22) + `<rect x="40" y="30" width="${e.w}" height="${e.h}" rx="16" fill="#fff" filter="url(#s)"/>`), left: cx - 40, top: cy - 30 },
      { input: await rounded(e.src, e.w, e.h, 16, e.extract), left: cx, top: cy },
    )
  }

  const out = await sharp(bg).composite(layers).webp({ quality: 88 }).toFile(`public/images/projects/${p.out}.webp`)
  console.log(p.out, out.width, out.height)
}

const slugs = process.argv.slice(2)
for (const [slug, p] of Object.entries(projects)) if (!slugs.length || slugs.includes(slug)) await build(p)
