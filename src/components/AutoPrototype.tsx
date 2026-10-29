import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Figure } from '../data/projects'
import { DeviceFrame } from './DeviceFrame'

type Screen = { label: string; figure: Figure }
type Step = { screen: number; tap: [number, number] }

const MOVE = 900 // ms for the cursor to glide to its target
const PRESS = 260 // ms the click lasts
const SHOW = 1700 // ms each screen rests before the cursor moves

/**
 * A prototype that plays itself inside a phone: a touch cursor (a see-through circle with
 * a white edge) glides to a real control
 * on the screen (an event card, the back arrow, a tab), clicks it, and the next screen
 * slides in, looping through the flow with no input needed. Tap points are percentages
 * of the screen. It only runs while it's on screen; with reduced motion it shows the
 * first screen, still.
 */
export function AutoPrototype({ screens, steps }: { screens: Screen[]; steps: Step[] }) {
  const [i, setI] = useState(0) // current step
  const [phase, setPhase] = useState<'rest' | 'move' | 'press'>('rest')
  const box = useRef<HTMLDivElement>(null)
  const step = steps[i]

  useEffect(() => {
    const el = box.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // on screen = at least a third of the phone is inside the window
    const onScreen = () => {
      const r = el.getBoundingClientRect()
      return Math.min(r.bottom, innerHeight) - Math.max(r.top, 0) > r.height / 3
    }
    let t = 0
    let alive = true
    const wait = (ms: number) => new Promise<void>((r) => (t = window.setTimeout(r, ms)))
    const run = async () => {
      let n = 0
      while (alive) {
        await wait(SHOW)
        if (!onScreen() || document.hidden) continue
        setPhase('move')
        await wait(MOVE)
        setPhase('press')
        await wait(PRESS)
        n = (n + 1) % steps.length
        setI(n)
        setPhase('rest')
      }
    }
    run()
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [steps.length])

  // the cursor rests a little below and right of where it last clicked, then glides in
  const [x, y] = step.tap
  const cursor = { '--x': `${x}%`, '--y': `${y}%` } as CSSProperties

  return (
    <div ref={box} className="autoproto">
      <DeviceFrame device="phone" caption="">
        <div className="autoproto__screen">
          {screens.map((s, n) => (
            <img
              key={s.figure.src}
              className={`autoproto__img ${n === step.screen ? 'is-current' : ''}`}
              src={s.figure.src}
              alt={n === step.screen ? s.figure.alt : ''}
              aria-hidden={n !== step.screen}
              width={s.figure.width}
              height={s.figure.height}
              loading="lazy"
              decoding="async"
            />
          ))}
          <span className={`autoproto__cursor is-${phase}`} style={cursor} aria-hidden="true">
            <span className="autoproto__ring" />
          </span>
        </div>
      </DeviceFrame>
      <p className="autoproto__label" aria-live="polite">
        {screens[step.screen].label}
      </p>
    </div>
  )
}
