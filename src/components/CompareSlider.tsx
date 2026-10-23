import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Figure } from '../data/projects'

type Props = { before: Figure; after: Figure; label: string; labels?: [string, string] }

/**
 * Before/after comparison: the redesigned screen sits underneath and the
 * original is revealed from the left up to the divider.
 * Works with mouse, touch (horizontal drag; vertical page scroll still works)
 * and keyboard (arrow keys, Home/End on the handle).
 */
export function CompareSlider({ before, after, label, labels = ['Before', 'After'] }: Props) {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
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
