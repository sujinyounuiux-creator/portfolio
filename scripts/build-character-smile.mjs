// A second expression of Sujin's character for the About Me text: the same artwork with the
// eyes and mouth painted over in the skin colour and redrawn as happy curved eyes and an
// open smile, roughened to match the crayon line.
// Source: public/images/character.webp. Output: public/images/character-smile.webp
import sharp from 'sharp'

sharp.cache(false)
const SRC = 'public/images/character.webp'
const { width: W, height: H } = await sharp(SRC).metadata()
const { data } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const at = (x, y) => { const i = (y * W + x) * 4; return `rgb(${data[i]},${data[i + 1]},${data[i + 2]})` }
const SKIN = at(440, 190)

// paint out the old eyes and mouth, with a soft edge so no patch shows
const patch = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><g fill="${SKIN}">
  <ellipse cx="390" cy="200" rx="27" ry="29" transform="rotate(12 390 200)"/>
  <circle cx="368" cy="182" r="9"/>
  <ellipse cx="495" cy="225" rx="30" ry="27" transform="rotate(12 495 225)"/>
  <ellipse cx="428" cy="274" rx="46" ry="19" transform="rotate(10 428 274)"/>
</g></svg>`)).blur(2).png().toBuffer()

const INK = '#2a1b18'
const face = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><filter id="crayon" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6"/>
  </filter></defs>
  <g filter="url(#crayon)" stroke-linecap="round" stroke-linejoin="round">
    <!-- happy eyes: curved up, with a small lash at the outer corner -->
    <path d="M369 205 Q391 176 414 210" fill="none" stroke="${INK}" stroke-width="7.5"/>
    <path d="M369 205 L360 200" fill="none" stroke="${INK}" stroke-width="4.5"/>
    <path d="M472 225 Q497 198 519 235" fill="none" stroke="${INK}" stroke-width="7.5"/>
    <path d="M519 235 L528 233" fill="none" stroke="${INK}" stroke-width="4.5"/>
    <!-- open smile: a rosy mouth, a band of teeth and a little tongue -->
    <path d="M388 258 Q430 272 472 280 Q462 316 418 306 Q388 296 388 258 Z" fill="#b9474d" stroke="#a83d44" stroke-width="3.5"/>
    <path d="M395 263 Q430 275 463 282 Q458 290 451 289 Q420 284 399 275 Q395 270 395 263 Z" fill="#fff8f2"/>
    <path d="M412 299 Q430 288 448 301 Q432 310 412 299 Z" fill="#e88a8c"/>
  </g>
</svg>`)
const out = await sharp(SRC).composite([{ input: patch }, { input: face }]).webp({ quality: 92, alphaQuality: 100 }).toFile('public/images/character-smile.webp')
console.log('character-smile', out.width, out.height, SKIN)
