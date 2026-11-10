import { AboutCharacter } from '../components/AboutCharacter'
import { ContactCTA } from '../components/ContactCTA'
import { Underline } from '../components/HandDrawnDecoration'
import { PhotoCollage } from '../components/PhotoCollage'
import { Rich } from '../components/Rich'
import { about } from '../data/about'
import { site } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

export function AboutPage() {
  usePageMeta('About', `About ${site.name}: a UX/UI designer in ${site.location} with a background in network engineering.`)

  return (
    <div className="about">
      <div className="container about__inner">
        {/* About */}
        <section className="about-block" aria-labelledby="about-title">
          <p className="hand section-kicker about-kicker">Nice to meet you!</p>
          <h1 id="about-title" className="about-hello">
            <span className="about-hello__small">{about.greeting}</span>
            <span className="about-hello__name">
              {site.name}
              <Underline className="about-hello__line" draw />
            </span>
          </h1>
          <div className="intro-art">
            <div className="about-intro intro-hand">
              {about.intro.map((p, i) => (
                <p key={i}><Rich text={p} /></p>
              ))}
            </div>
            <AboutCharacter />
          </div>
          <a className="btn btn--ghost about-resume" href={site.resumeUrl} target="_blank" rel="noreferrer" aria-label="View my résumé, PDF (opens in a new tab)">
            View my résumé
          </a>
        </section>

        {/* Experience */}
        <section className="about-block" aria-labelledby="experience-title">
          <h2 id="experience-title" className="section-title about-heading">
            Experience
          </h2>
          <ol className="experience">
            {about.experience.map((e) => (
              <li key={e.org}>
                <h3>{e.org}</h3>
                {e.role && <p>{e.role}</p>}
                {e.place && <p>{e.place}</p>}
                <p className="experience__when">{e.when}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Skills */}
        <section className="about-block" aria-labelledby="skills-title">
          <h2 id="skills-title" className="section-title about-heading">
            Skills
          </h2>
          <dl className="skills">
            {about.skills.map((g) => (
              <div key={g.title}>
                <dt>{g.title}</dt>
                <dd>{g.items.join(', ')}.</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Outside of work */}
        <section className="about-block about-block--center" aria-labelledby="outside-title">
          <h2 id="outside-title" className="section-title about-heading">
            Outside of work
          </h2>
          <PhotoCollage className="collage--page" />
        </section>

        {/* Tools */}
        <section className="about-block" aria-labelledby="tools-title">
          <h2 id="tools-title" className="section-title about-heading">
            Tools
          </h2>
          <ul className="tools">
            {about.tools.map((t) => (
              <li key={t.name}>
                <img src={t.icon} alt="" width={64} height={64} />
                <span>{t.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How I built this site */}
        <section className="about-block" aria-labelledby="built-title">
          <h2 id="built-title" className="section-title about-heading">
            How I built this site
          </h2>
          <p className="about-built__lead">{about.builtLead}</p>
          <ol className="about-built">
            {about.builtPoints.map((p, i) => (
              <li key={p.title} className="about-built__item">
                <span className="about-built__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <ContactCTA />
    </div>
  )
}
