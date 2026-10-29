import { site } from '../data/site'
import { StampableCharacter } from './StampableCharacter'

/**
 * Home hero. The illustrated character is the focal point. The role, a few
 * hashtags (site.heroTags) and the location float around it as plain labels
 * (no links or hover motion);
 * name, "portfolio" and slogan sit beside it. Visitors can decorate the
 * character with stamps.
 */
export function HeroSection() {

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__stage">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__hi hand">
              Hi, I’m
            </span>
            <span className="hero__name">{site.name}</span>
            <span className="hero__word">portfolio</span>
          </h1>
          <p className="hero__slogan">{site.slogan}</p>
          <p className="hero__subline">{site.subline}</p>
        </div>

        <div className="hero__art">
          <StampableCharacter label={`Illustrated portrait of ${site.name}, smiling and waving`}>
            <div className="hero__blob" aria-hidden="true" />

            <ul className="hero__labels" aria-label="Role, skills, languages and location">
              <li className="hero__label hero__label--role">
                <span className="specialty specialty--primary specialty--role">{site.role}</span>
              </li>
              {site.heroTags.map((t, i) => (
                <li key={t.label} className={`hero__label hero__label--tag${i + 1}`}>
                  <span className={`specialty specialty--${t.group}`}>#{t.label}</span>
                </li>
              ))}
              <li className="hero__label hero__label--place">
                <span className="sticker sticker--yellow">{site.location}</span>
              </li>
            </ul>
          </StampableCharacter>
        </div>
      </div>
    </section>
  )
}
