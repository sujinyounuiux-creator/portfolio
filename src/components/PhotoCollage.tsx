import type { CSSProperties } from 'react'
import { about } from '../data/about'
import { Tape } from './HandDrawnDecoration'
import { ZoomImage } from './Lightbox'

// Hand-picked tilts and nudges so the collage looks casually pinned
// rather than randomly scattered (same values every render).
const layout = [
  { tilt: -4, y: 0 },
  { tilt: 3, y: 12 },
  { tilt: -2, y: -2 },
  { tilt: 4, y: 6 },
  { tilt: -3, y: 0 },
  { tilt: 2.5, y: 8 },
  { tilt: -1.5, y: 2 },
]

type Props = {
  className?: string
  /** Limit to these photo paths (in this order). Defaults to every photo. */
  only?: string[]
}

/** Scrapbook-style Polaroid collage of personal photos. Photos keep their full frame. */
export function PhotoCollage({ className = '', only }: Props) {
  const photos = only
    ? only.map((src) => about.outsideOfWork.find((p) => p.src === src)).filter((p) => p !== undefined)
    : about.outsideOfWork

  return (
    <ul className={`collage ${className}`} aria-label="Photos from outside of work">
      {photos.map((p, i) => {
        const { tilt, y } = layout[i % layout.length]
        return (
          <li
            key={p.src}
            className="collage__item"
            style={{ '--tilt': `${tilt}deg`, '--nudge': `${y}px` } as CSSProperties}
          >
            <figure className="collage__polaroid">
              <Tape className="collage__tape" />
              <ZoomImage figure={{ src: p.src, alt: p.alt, width: p.width, height: p.height, caption: p.caption }} />
              <figcaption className="hand">{p.caption}</figcaption>
            </figure>
          </li>
        )
      })}
    </ul>
  )
}
