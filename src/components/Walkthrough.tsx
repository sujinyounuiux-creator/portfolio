import { useState } from 'react'
import type { Figure } from '../data/projects'
import { DeviceFrame } from './DeviceFrame'

type Step = { title: string; note: string; figure: Figure }

/**
 * Click through prototype: one real screen at a time inside a laptop, picked
 * with the numbered step tabs. No arrows, counter or caption: the tabs say it all.
 */
export function Walkthrough({ steps }: { steps: Step[] }) {
  const [i, setI] = useState(0)
  const step = steps[i]
  const go = (n: number) => setI(n)

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

      {/* screen readers still hear which screen is showing */}
      <p className="visually-hidden" aria-live="polite">
        {step.title}: {step.note}
      </p>
    </figure>
  )
}
