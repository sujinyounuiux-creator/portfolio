import { site } from '../data/site'
import { Rich } from './Rich'
import { StampableCharacter } from './StampableCharacter'

/**
 * Home hero. The headline says why to hire Sujin; the name and slogan sit with it. The
 * illustrated character is beside it, with the role, a few hashtags (site.heroTags) and the
 * location floating around it as plain labels. Visitors can decorate the character with stamps.
 */
export function HeroSection() {

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__stage">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__intro">
              <span className="hero__hi hand">Hi, I’m</span> <span className="hero__name">{site.name}</span>
            </span>
            <span className="hero__claim">
              {site.headline.map((line) => (
                <span key={line} className="hero__claim-line">
                  <Rich text={line} />
                </span>
              ))}
            </span>
          </h1>
          <p className="hero__slogan">{site.slogan}</p>
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
