import { volunteer } from '../data/volunteer'
import { ZoomImage } from './Lightbox'

/** Home-only section for ongoing volunteer design work (Rizsq), above the ASCLO gallery. */
export function VolunteerWork() {
  return (
    <section id="volunteer" className="section volunteer" aria-labelledby="volunteer-title">
      <div className="container">
        <header className="section-head-c">
          <p className="asclo__label wiggle">{volunteer.label}</p>
          <h2 id="volunteer-title" className="section-title">
            {volunteer.title}
          </h2>
          <p className="section-lede">{volunteer.summary}</p>
        </header>

        <dl className="side-facts">
          {volunteer.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        {/* designs keep their own shape (landscape banner, portrait post) */}
        <ul className="volunteer__grid">
          {volunteer.photos.map((p) => (
            <li key={p.src} style={{ flexGrow: p.width / p.height }}>
              <ZoomImage figure={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
