import { useEffect, useRef, useState } from 'react'
import { Rich } from './Rich'

export type Rating = 'yes' | 'part' | 'no'

const RATING_LABEL: Record<Rating, string> = {
  yes: 'Available',
  part: 'Available, but unclear or hard to use',
  no: 'Not available',
}

/** One dot: filled, half filled or empty. */
function Dot({ rating }: { rating: Rating }) {
  return <span className={`rmatrix__dot rmatrix__dot--${rating}`} role="img" aria-label={RATING_LABEL[rating]} />
}

/**
 * Competitive analysis as a dot matrix (as in the BCA final presentation): one row per UX
 * feature, one dot per competitor, and the design opportunity it showed. Hovering a column
 * dims the others; a highlighted row marks the gap no competitor filled.
 */
export function RatingMatrix({
  columns,
  rows,
  noteLabel,
  takeaways,
  caption,
}: {
  columns: string[]
  rows: { label: string; ratings: Rating[]; note: string; highlight?: boolean }[]
  noteLabel: string
  takeaways?: { value: string; label: string }[]
  caption?: string
}) {
  const [col, setCol] = useState<number | null>(null)
  return (
    <figure className="rmatrix">
      <div className="rmatrix__scroll" tabIndex={0} role="region" aria-label="Competitive analysis table (scrollable)">
        <table className={col === null ? '' : 'has-col'}>
          <thead>
            <tr>
              <th scope="col">UX feature</th>
              {columns.map((c, i) => (
                <th key={c} scope="col" className={`rmatrix__site ${col === i ? 'is-col' : ''}`} onMouseEnter={() => setCol(i)} onMouseLeave={() => setCol(null)}>
                  {c}
                </th>
              ))}
              <th scope="col">{noteLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={r.highlight ? 'is-gap' : ''}>
                <th scope="row">{r.label}</th>
                {r.ratings.map((rt, i) => (
                  <td key={columns[i]} className={`rmatrix__cell ${col === i ? 'is-col' : ''}`} onMouseEnter={() => setCol(i)} onMouseLeave={() => setCol(null)}>
                    <Dot rating={rt} />
                  </td>
                ))}
                <td className="rmatrix__note">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="rmatrix__legend" aria-hidden="true">
        {(Object.keys(RATING_LABEL) as Rating[]).map((k) => (
          <li key={k}>
            <span className={`rmatrix__dot rmatrix__dot--${k}`} />
            {RATING_LABEL[k]}
          </li>
        ))}
      </ul>
      {takeaways && (
        <dl className="rmatrix__takeaways">
          {takeaways.map((t) => (
            <div key={t.value + t.label}>
              <dt>{t.value}</dt>
              <dd>
                <Rich text={t.label} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/**
 * Task ease ratings as stacked bars (1 = easiest), as in the BCA final presentation.
 * The bars grow in when they scroll into view; hovering a segment shows what it means.
 */
export function TaskEase({
  title,
  tasks,
  legend,
  caption,
}: {
  title: string
  tasks: { label: string; n: number; parts: { value: number; key: string }[] }[]
  legend: { key: string; label: string }[]
  caption?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return setShown(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const name = (key: string) => legend.find((l) => l.key === key)?.label ?? key
  return (
    <figure ref={ref} className={`tease ${shown ? 'is-shown' : ''}`}>
      <p className="tease__title">{title}</p>
      <ul className="tease__list">
        {tasks.map((t) => (
          <li key={t.label}>
            <span className="tease__label">
              <strong>{t.label}</strong>
              <span>n = {t.n}</span>
            </span>
            <span className="tease__bar" role="img" aria-label={`${t.label}: ${t.parts.map((p) => `${p.value}% ${name(p.key)}`).join(', ')}`}>
              {t.parts.map((p, i) => (
                <span key={i} className={`tease__seg tease__seg--${p.key}`} style={{ flexBasis: `${p.value}%` }} title={`${p.value}% ${name(p.key)}`}>
                  <span>{p.value}%</span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <ul className="tease__legend" aria-hidden="true">
        {legend.map((l) => (
          <li key={l.key}>
            <span className={`tease__swatch tease__seg--${l.key}`} />
            {l.label}
          </li>
        ))}
      </ul>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
