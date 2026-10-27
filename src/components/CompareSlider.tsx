import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Figure } from '../data/projects'

type Props = { before: Figure; after: Figure; label: string; labels?: [string, string] }

/**
 * Before/after comparison: the redesigned screen sits underneath and the
 * original is revealed from the left up to the divider.
 * Works with mouse, touch (horizontal drag; vertical page scroll still works)
 * and keyboard (arrow keys, Home/End on the handle).
 * While on screen it sweeps gently side to side by itself (not for reduced motion)
 * until someone drags, taps or uses the keyboard on it.
 */
export function CompareSlider({ before, after, label, labels = ['Before', 'After'] }: Props) {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const touched = useRef(false)

  useEffect(() => {
    const el = box.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false
    let frame = 0
    let t = 0
    let last = performance.now()
    const io = new IntersectionObserver(([e]) => (visible = e.intersectionRatio >= 0.4), { threshold: [0, 0.4] })
    io.observe(el)
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (touched.current) return
      if (visible && !document.hidden) {
        t += dt
        // 50% → 22% → 78% → 50% over seven seconds, eased by a sine
        setPos(50 + 28 * Math.sin((t / 7000) * Math.PI * 2))
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [])

  const moveTo = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    touched.current = true
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
    touched.current = true
    const step = e.shiftKey ? 10 : 2
    const next: Record<string, number> = { ArrowLeft: pos - step, ArrowRight: pos + step, Home: 0, End: 100 }
    if (e.key in next) {
      e.preventDefault()
      setPos(Math.min(100, Math.max(0, next[e.key])))
    }
  }

  return (
    <div
      ref={box}
      className="compare"
      style={{ '--pos': `${pos}%` } as React.CSSProperties}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <img className="compare__img" src={after.src} alt={after.alt} width={after.width} height={after.height} loading="lazy" draggable={false} />
      <div className="compare__before" aria-hidden={pos === 0}>
        <img className="compare__img" src={before.src} alt={before.alt} width={before.width} height={before.height} loading="lazy" draggable={false} />
      </div>

      <span className="compare__label compare__label--before" aria-hidden="true">{labels[0]}</span>
      <span className="compare__label compare__label--after" aria-hidden="true">{labels[1]}</span>

      <div className="compare__divider" aria-hidden="true" />
      <button
        type="button"
        className="compare__handle"
        role="slider"
        aria-label={`${label}: drag to compare ${labels[0].toLowerCase()} and ${labels[1].toLowerCase()}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% ${labels[0].toLowerCase()} shown`}
        onKeyDown={onKey}
      >
        <span aria-hidden="true">‹ ›</span>
      </button>
    </div>
  )
}
