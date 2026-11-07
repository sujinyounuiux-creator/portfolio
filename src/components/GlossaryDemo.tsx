import { useId, useState } from 'react'
import type { Figure } from '../data/projects'

export type GlossaryTerm = {
  term: string
  text: string
  /** Middle of the "?" mark, as percentages of the image. */
  x: number
  y: number
  /** The half row that lifts on hover: left, top, width and height, as percentages. */
  row: [number, number, number, number]
}

/**
 * The PROFITKEY indicator table with its "?" marks working as in the design: hovering, focusing
 * or tapping a mark lifts that row and opens a grey balloon with a plain explanation.
 */
export function GlossaryDemo({ figure, terms }: { figure: Figure; terms: GlossaryTerm[] }) {
  const [active, setActive] = useState<string | null>(null)
  const id = useId()

  return (
    <figure className="glossary">
      <div className="glossary__stage" onKeyDown={(e) => e.key === 'Escape' && setActive(null)}>
        <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" decoding="async" />
        {terms.map((t, i) => {
          const open = active === t.term
          const [left, top, width, height] = t.row
          const rightColumn = t.x > 50
          return (
            <div key={t.term} className={`glossary__term ${open ? 'is-open' : ''}`}>
              <span className="glossary__row" style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }} aria-hidden="true" />
              <button
                type="button"
                className="glossary__mark"
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                aria-label={`What is ${t.term}?`}
                aria-describedby={`${id}-${i}`}
                onMouseEnter={() => setActive(t.term)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(t.term)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(t.term)}
              />
              <span className="glossary__arrow" style={{ left: `${t.x}%`, top: `${top + height}%` }} aria-hidden="true" />
              <span
                id={`${id}-${i}`}
                role="tooltip"
                className="glossary__tip"
                style={{ top: `${top + height}%`, ...(rightColumn ? { right: `${100 - left - width}%` } : { left: `${left}%` }) }}
              >
                {t.text}
              </span>
            </div>
          )
        })}
      </div>
      {figure.caption && <figcaption>{figure.caption}</figcaption>}
    </figure>
  )
}
