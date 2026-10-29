import { useState } from 'react'
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { CharacterIllustration } from './CharacterIllustration'

/**
 * The home character, which visitors can decorate: pick a stamp (star, heart,
 * diamond, flower) and tap anywhere on or around the character to stick it on.
 * The tappable area reaches a little past the illustration (see .stampable__hit
 * in home.css). Stamps last only while the page is open: reloading or leaving the
 * page starts the character clean again. They are drawn like the illustration
 * (its colours, a darker line of the same hue, crayon grain and a hand-drawn wobble)
 * and can be undone or cleared.
 * Keyboard: focus the character and press Enter or Space to add the chosen stamp
 * at a random spot.
 */

type Kind = 'star' | 'heart' | 'diamond' | 'flower'
type Stamp = { id: number; kind: Kind; x: number; y: number; r: number; s: number }

// colours taken from the illustration: cheek coral, mouth rose, the blue doodles, a warm yellow
const KINDS: { kind: Kind; label: string; fill: string; line: string }[] = [
  { kind: 'star', label: 'Star', fill: '#f8d47e', line: '#d9a04a' },
  { kind: 'heart', label: 'Heart', fill: '#f5a182', line: '#c2635d' },
  { kind: 'diamond', label: 'Diamond', fill: '#b6c7df', line: '#7a96c4' },
  { kind: 'flower', label: 'Flower', fill: '#feb9a0', line: '#e2856f' },
]
const MAX = 60
// an earlier version kept stamps between visits; clear what it left behind
try {
  localStorage.removeItem('character-stamps')
} catch {
  /* storage unavailable: nothing to clear */
}

/** Crayon look shared by every stamp: a slight hand-drawn wobble plus paper grain. */
function CrayonFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <filter id="stamp-crayon" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="1" seed="7" result="wobble" />
        <feDisplacementMap in="SourceGraphic" in2="wobble" scale="1.3" xChannelSelector="R" yChannelSelector="G" result="drawn" />
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.05" result="speckle" />
        <feComposite in="drawn" in2="speckle" operator="in" />
      </filter>
    </svg>
  )
}

function StampShape({ kind }: { kind: Kind }) {
  const k = KINDS.find((x) => x.kind === kind)!
  const common = { fill: k.fill, stroke: k.line, strokeWidth: 1.3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  switch (kind) {
    case 'star':
      return <path {...common} d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.1 6.1 20.3l1.3-6.5L2.5 9.3l6.6-.8z" />
    case 'heart':
      return <path {...common} d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8 2.9c0 6.1-8 11-8 11z" />
    case 'diamond':
      return (
        <>
          <path {...common} d="M6.5 4h11l4 5.2L12 20.5 2.5 9.2z" />
          <path d="M2.5 9.2h19M9 4l3 16.5L15 4" fill="none" stroke={k.line} strokeWidth={0.9} strokeLinejoin="round" strokeLinecap="round" />
        </>
      )
    case 'flower':
      return (
        <>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} {...common} cx="12" cy="6.6" rx="3.6" ry="4.4" transform={`rotate(${a} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="2.8" fill="#f8d47e" stroke="#d9a04a" strokeWidth={1.1} />
        </>
      )
  }
}

export function StampableCharacter({ label, children }: { label: string; children?: ReactNode }) {
  const [stamps, setStamps] = useState<Stamp[]>([])
  const [kind, setKind] = useState<Kind>('star')
  const [announce, setAnnounce] = useState('')

  const current = KINDS.find((k) => k.kind === kind)!

  // x and y are fractions of the illustration's box; below 0 or above 1 is the area around it
  const add = (x: number, y: number) => {
    setStamps((list) =>
      [...list, { id: Date.now() + Math.random(), kind, x, y, r: Math.round(Math.random() * 40 - 20), s: 0.85 + Math.random() * 0.35 }].slice(-MAX),
    )
    setAnnounce(`Added a ${current.label.toLowerCase()}.`)
  }

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    // keyboard "clicks" have no pointer position: handled by onKeyDown
    if (e.detail === 0) return
    const box = e.currentTarget.getBoundingClientRect()
    add((e.clientX - box.left) / box.width, (e.clientY - box.top) / box.height)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    add(-0.05 + Math.random() * 1.1, Math.random())
  }

  return (
    <>
      <CrayonFilter />
      {/* the figure keeps the hero's floating labels positioned around the character */}
      <div className="hero__figure">
        {children}
        <div className="stampable">
          <button
            type="button"
            className="stampable__hit"
            onClick={onClick}
            onKeyDown={onKeyDown}
            aria-label={`${label}. Press to stamp a ${current.label.toLowerCase()} on the picture.`}
            aria-describedby="stamp-hint"
          >
            <CharacterIllustration className="hero__character" eager />
          </button>
          <div className="stampable__layer" aria-hidden="true">
            {stamps.map((st) => (
              <span
                key={st.id}
                className="stamp"
                style={{ left: `${st.x * 100}%`, top: `${st.y * 100}%`, width: `${9 * st.s}%`, ['--r' as string]: `${st.r}deg` }}
              >
                <svg viewBox="0 0 24 24" overflow="visible">
                  <g filter="url(#stamp-crayon)">
                    <StampShape kind={st.kind} />
                  </g>
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="stamp-bar" role="group" aria-label="Decorate the character">
        <p className="stamp-bar__hint hand" id="stamp-hint">
          Decorate me! Pick a stamp, then tap anywhere
        </p>
        <div className="stamp-bar__row">
          {KINDS.map((k) => (
            <button
              key={k.kind}
              type="button"
              className="stamp-bar__pick"
              aria-pressed={kind === k.kind}
              aria-label={`${k.label} stamp`}
              onClick={() => setKind(k.kind)}
            >
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" overflow="visible">
                <g filter="url(#stamp-crayon)">
                  <StampShape kind={k.kind} />
                </g>
              </svg>
            </button>
          ))}
          <span className="stamp-bar__sep" aria-hidden="true" />
          <button
            type="button"
            className="stamp-bar__action"
            disabled={!stamps.length}
            onClick={() => {
              setStamps((l) => l.slice(0, -1))
              setAnnounce('Removed the last stamp.')
            }}
          >
            Undo
          </button>
          <button
            type="button"
            className="stamp-bar__action"
            disabled={!stamps.length}
            onClick={() => {
              setStamps([])
              setAnnounce('Cleared all stamps.')
            }}
          >
            Clear
          </button>
        </div>
        <p className="visually-hidden" aria-live="polite">
          {announce}
        </p>
      </div>
    </>
  )
}
