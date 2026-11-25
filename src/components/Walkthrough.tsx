import { useEffect, useRef, useState } from 'react'
import type { Figure } from '../data/projects'
import { DeviceFrame } from './DeviceFrame'

type Step = { title: string; note: string; figure: Figure }

const STEP_MS = 6000 // how long each screen shows before the next one slides in

/**
 * Prototype walkthrough: one real screen at a time inside a laptop. The screens move on by
 * themselves (a bar fills inside the current tab to show when the next one comes), and the
 * numbered tabs still jump straight to any screen. It pauses while the pointer or focus is
 * on it, while it is off screen, and does not play by itself for people who prefer reduced
 * motion. On phones every tab is shown at once in a grid, so it's clear how many pages there are.
 */
export function Walkthrough({ steps }: { steps: Step[] }) {
  const [i, setI] = useState(0)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const step = steps[i]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const playing = visible && !hover && !reduced
  const next = () => setI((n) => (n + 1) % steps.length)

  return (
    <figure
      ref={ref}
      className={`walk ${playing ? 'is-playing' : ''}`}
      style={{ '--walk-ms': `${STEP_MS}ms` } as React.CSSProperties}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <ol className="walk__steps" aria-label="Prototype screens">
        {steps.map((s, n) => (
          <li key={s.title}>
            <button type="button" className="walk__step" aria-current={n === i ? 'step' : undefined} onClick={() => setI(n)}>
              <span className="walk__num" aria-hidden="true">
                {n + 1}
              </span>
              <span className="walk__label">{s.title}</span>
              {/* fills while this screen shows; when it is full the next screen comes in */}
              {n === i && !reduced && <span key={i} className="walk__progress" aria-hidden="true" onAnimationEnd={next} />}
            </button>
          </li>
        ))}
      </ol>

      <div className="walk__stage">
        {/* key restarts the slide-in and resets the inner scroll position on each screen */}
        <div key={step.figure.src} className="walk__screen">
          <DeviceFrame device="desktop" figure={step.figure} caption="" />
        </div>
        <p className="walk__count" aria-hidden="true">
          {i + 1} / {steps.length} · {step.title}
        </p>
      </div>

      {/* screen readers still hear which screen is showing */}
      <p className="visually-hidden" aria-live="polite">
        {step.title}: {step.note}
      </p>
    </figure>
  )
}
