// The image shown when the portfolio link is shared (LinkedIn, messages...): the name, role
// and slogan beside the character, in the site's colours.
// Output: public/og-image.png (1200 x 630)
import sharp from 'sharp'

sharp.cache(false)
const INK = '#1F2430'
const BLUE = '#3D628F'
const FONT = 'Arial, sans-serif'
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#FFF8F1"/>
  <circle cx="900" cy="330" r="250" fill="#E3EAF3"/>
  <text x="80" y="255" font-family="${FONT}" font-size="86" font-weight="700" fill="${INK}">Sujin Youn</text>
  <path d="M84 282 C200 270 340 268 516 276" fill="none" stroke="#7A9CC6" stroke-width="9" stroke-linecap="round"/>
  <text x="80" y="346" font-family="${FONT}" font-size="31" font-weight="700" fill="${BLUE}">UX/UI Designer · Vancouver, BC</text>
  <text x="80" y="412" font-family="${FONT}" font-size="28" fill="#4A5160">I design the connection between</text>
  <text x="80" y="450" font-family="${FONT}" font-size="28" fill="#4A5160">people and technology.</text>
</svg>`)
const character = await sharp('public/images/character.webp').resize({ height: 520 }).png().toBuffer()
const { width } = await sharp(character).metadata()
await sharp(bg).composite([{ input: character, left: 905 - Math.round(width / 2), top: 110 }]).png().toFile('public/og-image.png')
