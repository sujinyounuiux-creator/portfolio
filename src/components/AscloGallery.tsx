import { asclo } from '../data/asclo'
import { ZoomImage } from './Lightbox'

/** Home-only gallery of side-job photo editing: heading, short summary, key facts, photos. */
export function AscloGallery() {
  return (
    <section id="asclo" className="section asclo" aria-labelledby="asclo-title">
      <div className="container">
        <header className="section-head-c">
          <p className="asclo__label wiggle">{asclo.label}</p>
          <h2 id="asclo-title" className="section-title">
            {asclo.title}
          </h2>
          <p className="section-lede">{asclo.summary}</p>
        </header>

        <dl className="side-facts">
          {asclo.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="asclo__grid">
          {asclo.photos.map((p) => (
            <li key={p.src}>
              <ZoomImage figure={{ src: p.src, alt: p.alt, width: asclo.width, height: asclo.height }} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
