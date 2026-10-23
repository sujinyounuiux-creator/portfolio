import { asclo } from '../data/asclo'
import { ZoomImage } from './Lightbox'

/** Home-only gallery of freelance photo editing: heading, label, large images. */
export function AscloGallery() {
  return (
    <section id="asclo" className="section asclo" aria-labelledby="asclo-title">
      <div className="container">
        <header className="section-head-c">
          <p className="asclo__label wiggle">{asclo.label}</p>
          <h2 id="asclo-title" className="section-title">
            {asclo.title}
          </h2>
        </header>

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
