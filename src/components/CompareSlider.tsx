import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import type { Figure } from '../data/projects'

type Props = { before: Figure; after: Figure; label: string; labels?: [string, string] }

const REST_AFTER = 1400 // ms resting on the after screen
const GLIDE = 2400 // ms for each glide across
const REST_BEFORE = 1000 // ms resting on the before screen

/** Where the handle is at time t (ms) in the loop: after, glide to before, rest, glide back. */
function autoPos(t: number) {
  const loop = REST_AFTER + GLIDE + REST_BEFORE + GLIDE
  let m = t % loop
  const ease = (x: number) => (1 - Math.cos(Math.PI * x)) / 2
  if (m < REST_AFTER) return 0
  m -= REST_AFTER
  if (m < GLIDE) return 100 * ease(m / GLIDE)
  m -= GLIDE
  if (m < REST_BEFORE) return 100
  m -= REST_BEFORE
  return 100 * (1 - ease(m / GLIDE))
}

/**
 * Before/after comparison. It opens on the after (redesigned) screen alone, then while on
 * screen the handle glides across by itself, revealing the before (original or wireframe)
 * and going back, until someone drags it. Dragging reveals the before from the left.
 * The divider is a quiet hairline and the handle a frosted circle with two outward
 * chevrons. Off for reduced motion.
 * Works with mouse, touch (horizontal drag; vertical page scroll still works)
 * and keyboard (arrow keys, Home/End on the handle).
 */
export function CompareSlider({ before, after, label, labels = ['Before', 'After'] }: Props) {
  const [pos, setPos] = useState(0)
  const [touched, setTouched] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  // the self-playing glide: runs only while on screen, and stops for good on first use
  useEffect(() => {
    const el = box.current
    if (!el || touched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let start = 0
    let visible = false
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    }, { threshold: 0.4 })
    io.observe(el)
    const tick = (now: number) => {
      if (visible && !document.hidden) {
        if (!start) start = now
        setPos(autoPos(now - start))
      } else {
        // restart from the after screen next time it comes into view
        start = 0
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [touched])

  const moveTo = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    setTouched(true)
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX)
  }
  const onUp = () => {
    dragging.current = false
  }

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 2
    const next: Record<string, number> = { ArrowLeft: pos - step, ArrowRight: pos + step, Home: 0, End: 100 }
    if (e.key in next) {
      e.preventDefault()
      setTouched(true)
      setPos(Math.min(100, Math.max(0, next[e.key])))
    }
  }

  return (
    <div
      ref={box}
      className={`compare ${touched ? 'is-touched' : ''} ${pos < 1 || pos > 99 ? 'is-at-edge' : ''}`}
      style={{ '--pos': `${pos}%` } as CSSProperties}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <img className="compare__img" src={after.src} alt={after.alt} width={after.width} height={after.height} loading="lazy" draggable={false} />
      <div className="compare__before" aria-hidden={pos === 0}>
        <img className="compare__img" src={before.src} alt={before.alt} width={before.width} height={before.height} loading="lazy" draggable={false} />
      </div>

      {/* each label shows once its side is really on screen */}
      <span className={`compare__label compare__label--before ${pos > 18 ? 'is-shown' : ''}`} aria-hidden="true">
        {labels[0]}
      </span>
      <span className={`compare__label compare__label--after ${pos < 82 ? 'is-shown' : ''}`} aria-hidden="true">
        {labels[1]}
      </span>

      {/* while it rests on the after screen, a pill beside the handle says it can be dragged */}
      {!touched && pos < 2 && (
        <span className="compare__hint" aria-hidden="true">
          Drag to see {labels[0].toLowerCase()}
        </span>
      )}

      <div className="compare__divider" aria-hidden="true" />
      <button
        type="button"
        className="compare__handle"
        role="slider"
        aria-label={`${label}: drag to compare ${labels[1].toLowerCase()} with ${labels[0].toLowerCase()}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% ${labels[0].toLowerCase()} shown`}
        onKeyDown={onKey}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M9.5 7 4.5 12l5 5M14.5 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
