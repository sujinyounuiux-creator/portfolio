import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { Arrow } from './Arrow'
import { Rich } from './Rich'

/** "Why work with me" on Home: Sujin's two strengths, each with its real proof. */
export function Strengths() {
  return (
    <section className="section strengths" aria-labelledby="strengths-title">
      <div className="container">
        <header className="section-head-c">
          <p className="hand section-kicker">Why work with me</p>
          <h2 id="strengths-title" className="section-title">
            What I bring
          </h2>
        </header>
        <ul className="strengths__list">
          {site.strengths.map((s) => (
            <li key={s.title} className="strength">
              <p className="strength__proof">{s.proof}</p>
              <p className="strength__label">{s.proofLabel}</p>
              <h3 className="strength__title">{s.title}</h3>
              <p className="strength__body">
                <Rich text={s.body} />
              </p>
              <Link className="text-link strength__link" to={s.link.to}>
                {s.link.label} <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
