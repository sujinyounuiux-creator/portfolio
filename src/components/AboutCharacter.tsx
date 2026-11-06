import { CrayonFilter, StampShape, type Kind } from './StampableCharacter'

/**
 * The stamps from Home, hand placed around the character like a sticker sheet, popping on one
 * after another. x and y are percentages of the illustration, s its width, r the tilt in degrees.
 * Goes inside a positioned box the same size as the illustration.
 */
const STAMPS: { kind: Kind; x: number; y: number; s: number; r: number }[] = [
  { kind: 'flower', x: 66, y: 10, s: 13, r: 12 }, // a flower in the hair
  { kind: 'heart', x: 25, y: 12, s: 9, r: -14 }, // above the waving hand
  { kind: 'star', x: 8, y: 22, s: 7, r: 14 },
  { kind: 'heart', x: 88, y: 28, s: 7, r: 16 },
  { kind: 'diamond', x: 90, y: 11, s: 8, r: -10 },
  { kind: 'star', x: 94, y: 54, s: 10, r: -12 },
  { kind: 'flower', x: 92, y: 88, s: 8, r: -8 },
  { kind: 'heart', x: 50, y: 83, s: 8, r: 6 }, // a badge on the hoodie
]

export function PlacedStamps({ scale = 1 }: { scale?: number }) {
  return (
    <>
      <CrayonFilter />
      <div className="stampable__layer" aria-hidden="true">
        {STAMPS.map((st, i) => (
          <span
            key={i}
            className="stamp"
            style={{ left: `${st.x}%`, top: `${st.y}%`, width: `${st.s * scale}%`, ['--r' as string]: `${st.r}deg`, animationDelay: `${300 + i * 110}ms` }}
          >
            <svg viewBox="0 0 24 24" overflow="visible">
              <g filter="url(#stamp-crayon)">
                <StampShape kind={st.kind} />
              </g>
            </svg>
          </span>
        ))}
      </div>
    </>
  )
}

/** The smiling character on the About page, already decorated. */
export function AboutCharacter() {
  return (
    <div className="intro-art__figure">
      <img src="/images/character-smile.webp" alt="" width={900} height={817} loading="lazy" decoding="async" />
      <PlacedStamps />
    </div>
  )
}
