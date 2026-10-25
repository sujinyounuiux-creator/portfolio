import { useEffect, useState } from 'react'
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { CharacterIllustration } from './CharacterIllustration'

/**
 * The home character, which visitors can decorate: pick a stamp (star, heart,
 * diamond, flower) and tap anywhere on or around the character to stick it on.
 * The tappable area reaches a little past the illustration (see .stampable__hit
 * in home.css). Stamps are kept in this browser and can be undone or cleared.
 * Keyboard: focus the character and press Enter or Space to add the chosen stamp
 * at a random spot.
 */

type Kind = 'star' | 'heart' | 'diamond' | 'flower'
type Stamp = { id: number; kind: Kind; x: number; y: number; r: number; s: number }

const KINDS: { kind: Kind; label: string; color: string }[] = [
  { kind: 'star', label: 'Star', color: '#f7d87c' },
  { kind: 'heart', label: 'Heart', color: '#f29bb0' },
  { kind: 'diamond', label: 'Diamond', color: '#9fc0e6' },
  { kind: 'flower', label: 'Flower', color: '#f4a98f' },
]
const STORE = 'character-stamps'
const MAX = 60

function StampShape({ kind, color }: { kind: Kind; color: string }) {
  const common = { fill: color, stroke: 'var(--c-ink)', strokeWidth: 1.6, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'star':
      return <path {...common} d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.1 6.1 20.3l1.3-6.5L2.5 9.3l6.6-.8z" />
    case 'heart':
      return <path {...common} d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8 2.9c0 6.1-8 11-8 11z" />
    case 'diamond':
      return (
        <>
          <path {...common} d="M6.5 4h11l4 5.2L12 20.5 2.5 9.2z" />
          <path d="M2.5 9.2h19M9 4l3 16.5L15 4" fill="none" stroke="var(--c-ink)" strokeWidth={1.1} strokeLinejoin="round" />
        </>
      )
    case 'flower':
      return (
        <>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} {...common} cx="12" cy="6.6" rx="3.6" ry="4.4" transform={`rotate(${a} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="3" fill="#f7d87c" stroke="var(--c-ink)" strokeWidth={1.4} />
        </>
      )
  }
}

function load(): Stamp[] {
  try {
    const raw = localStorage.getItem(STORE)
    const list = raw ? (JSON.parse(raw) as Stamp[]) : []
    return Array.isArray(list) ? list.slice(-MAX) : []
  } catch {
    return []
  }
}

export function StampableCharacter({ label, children }: { label: string; children?: ReactNode }) {
  const [stamps, setStamps] = useState<Stamp[]>(load)
  const [kind, setKind] = useState<Kind>('star')
  const [announce, setAnnounce] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(stamps))
    } catch {
      /* storage unavailable: stamps just last for this visit */
    }
  }, [stamps])

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
            {stamps.map((st) => {
              const k = KINDS.find((x) => x.kind === st.kind) ?? KINDS[0]
              return (
                <span
                  key={st.id}
                  className="stamp"
                  style={{ left: `${st.x * 100}%`, top: `${st.y * 100}%`, width: `${9 * st.s}%`, ['--r' as string]: `${st.r}deg` }}
                >
                  <svg viewBox="0 0 24 24" overflow="visible">
                    <StampShape kind={st.kind} color={k.color} />
                  </svg>
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="stamp-bar" role="group" aria-label="Decorate the character">
        <p className="stamp-bar__hint hand" id="stamp-hint">
          decorate me! pick a stamp, then tap anywhere
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
                <StampShape kind={k.kind} color={k.color} />
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
