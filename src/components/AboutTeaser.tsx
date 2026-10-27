import { Link } from 'react-router-dom'
import { about } from '../data/about'
import { site } from '../data/site'
import { PhotoCollage } from './PhotoCollage'

/**
 * "About Me" on Home.
 * Left: self introduction, specialties and background.
 * Right: a Polaroid collage of personal photos.
 * All text comes from src/data/about.ts.
 */
export function AboutTeaser() {
  return (
    <section id="about-me" className="section about-home" aria-labelledby="about-home-title">
      <div className="container">
        <header className="section-head-c">
          <p className="hand section-kicker">nice to meet you!</p>
          <h2 id="about-home-title" className="section-title">
            About Me
          </h2>
        </header>

        <div className="about-home__grid">
          <div className="about-home__col">
            <p className="intro-hand">{about.intro[0]}</p>

            <ul className="about-home__specialties tag-row" aria-label="Design specialties">
              {site.specialties.map((s) => (
                <li key={s.label}>
                  <Link to={s.href} className={`specialty ${s.primary ? 'specialty--primary' : ''}`}>
                    #{s.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="about-home__h3">My background</h3>
            <ol className="about-home__timeline">
              {about.experience.map((e) => (
                <li key={e.org}>
                  <span className="about-home__when">{e.when}</span>
                  <strong>{e.role ?? e.org}</strong>
                  {(e.role || e.place) && <span>{[e.role && e.org, e.place].filter(Boolean).join(', ')}</span>}
                </li>
              ))}
            </ol>

            <Link to="/about" className="btn btn--ghost about-home__more">
              More about me <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="about-home__col about-home__col--photos">
            <h3 className="about-home__h3">Outside of work</h3>
            {/* on Home the photos are just a glimpse: no lightbox */}
            <PhotoCollage className="collage--home" only={about.homePhotos} zoom={false} />
            <Link to="/about" className="text-link about-home__all-photos">
              See more photos on my About page →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
