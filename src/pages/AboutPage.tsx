import { ContactCTA } from '../components/ContactCTA'
import { Underline } from '../components/HandDrawnDecoration'
import { PhotoCollage } from '../components/PhotoCollage'
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
          <p className="hand section-kicker about-kicker">nice to meet you!</p>
          <h1 id="about-title" className="about-hello">
            <span className="about-hello__small">{about.greeting}</span>
            <span className="about-hello__name">
              {site.name}
              <Underline className="about-hello__line" draw />
            </span>
          </h1>
          <div className="about-intro intro-hand">
            {about.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
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
        <section className="about-block" aria-labelledby="outside-title">
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
      </div>

      <ContactCTA showProjectsLink />
    </div>
  )
}
