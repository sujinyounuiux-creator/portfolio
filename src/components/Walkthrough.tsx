import { useState } from 'react'
import type { Figure } from '../data/projects'
import { DeviceFrame } from './DeviceFrame'

type Step = { title: string; note: string; figure: Figure }

/**
 * Click through prototype: one real screen at a time inside a laptop,
 * with numbered step tabs and previous / next buttons.
 */
export function Walkthrough({ steps, caption }: { steps: Step[]; caption?: string }) {
  const [i, setI] = useState(0)
  const step = steps[i]
  const go = (n: number) => setI((n + steps.length) % steps.length)

  return (
    <figure className="walk">
      <ol className="walk__steps" aria-label="Prototype screens">
        {steps.map((s, n) => (
          <li key={s.title}>
            <button type="button" className="walk__step" aria-current={n === i ? 'step' : undefined} onClick={() => go(n)}>
              <span className="walk__num" aria-hidden="true">
                {n + 1}
              </span>
              {s.title}
            </button>
          </li>
        ))}
      </ol>

      {/* key resets the inner scroll position when the screen changes */}
      <DeviceFrame key={step.figure.src} device="desktop" figure={step.figure} caption="" />

      <div className="walk__bar">
        <button type="button" className="walk__nav" onClick={() => go(i - 1)} aria-label="Previous screen">
          ←
        </button>
        <p className="walk__note" aria-live="polite">
          <strong>
            {i + 1} / {steps.length} · {step.title}
          </strong>{' '}
          {step.note}
        </p>
        <button type="button" className="walk__nav" onClick={() => go(i + 1)} aria-label="Next screen">
          →
        </button>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
