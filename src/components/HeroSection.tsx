import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { StampableCharacter } from './StampableCharacter'
import { Underline } from './HandDrawnDecoration'

/**
 * Home hero. The illustrated character is the focal point. The role, a few
 * hashtags (site.heroTags) and the location float around it as stickers;
 * name, "portfolio" and slogan sit beside it. Visitors can decorate the
 * character with stamps.
 */
export function HeroSection() {
  const [lead, last] = splitSlogan(site.slogan)
  const [primary] = site.specialties

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__stage">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__hi hand">
              hi, I’m
            </span>
            <span className="hero__name">{site.name}</span>
            <span className="hero__word">portfolio</span>
          </h1>
          <p className="hero__slogan">
            {lead}{' '}
            <span className="marked">
              {last}
              <Underline className="marked__line" draw />
            </span>
          </p>
        </div>

        <div className="hero__art">
          <StampableCharacter label={`Illustrated portrait of ${site.name}, smiling and waving`}>
            <div className="hero__blob" aria-hidden="true" />

            <ul className="hero__labels" aria-label="Role, skills, languages and location">
              <li className="hero__label hero__label--role">
                <Link to={primary.href} className="specialty specialty--primary specialty--role">
                  {site.role}
                </Link>
              </li>
              {site.heroTags.map((t, i) => (
                <li key={t.label} className={`hero__label hero__label--tag${i + 1}`}>
                  {t.href ? (
                    <Link to={t.href} className={`specialty specialty--${t.group}`}>
                      #{t.label}
                    </Link>
                  ) : (
                    <span className={`specialty specialty--${t.group}`}>#{t.label}</span>
                  )}
                </li>
              ))}
              <li className="hero__label hero__label--place">
                <Link to="/about" className="sticker sticker--yellow wiggle" aria-label={`${site.location}: more about me`}>
                  {site.location}
                </Link>
              </li>
            </ul>
          </StampableCharacter>
        </div>
      </div>
    </section>
  )
}

/** Splits the slogan so its last phrase ("for people.") gets the crayon underline. */
function splitSlogan(slogan: string): [string, string] {
  const i = slogan.lastIndexOf(',')
  if (i === -1) return ['', slogan]
  return [slogan.slice(0, i + 1), slogan.slice(i + 1).trim()]
}
