import { Link } from 'react-router-dom'
import { disciplineLabel, featuredProjects, projects, type Project } from '../data/projects'
import { Arrow } from './Arrow'
import { Editable } from './Editable'
import { Tape } from './HandDrawnDecoration'

/** Compact folder card for the Case Study page: coloured tab, small thumbnail, title. */
export function ProjectFolder({ project, index }: { project: Project; index: number }) {
  const { slug, title, category, thumbnail, theme } = project
  // the folder colour is a soft tint of the project colour (see .feature / .folder in home.css)
  const style = { '--f-accent': theme.accent } as React.CSSProperties

  return (
    <article className="folder" style={style}>
      <p className="folder__tab">Project {String(index + 1).padStart(2, '0')}</p>
      <div className="folder__body">
        <div className="folder__thumb">
          <img src={thumbnail.src} alt="" width={thumbnail.width} height={thumbnail.height} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
        </div>
        <div className="folder__text">
          <h2 className="folder__title">
            <Link to={`/work/${slug}`} className="folder__link">
              {title}
            </Link>
          </h2>
          <p className="folder__meta">{category}</p>
        </div>
      </div>
    </article>
  )
}

/** Large folder-tab project card for Featured Works on Home. */
export function FeatureCard({ project, index }: { project: Project; index: number }) {
  const { slug, title, tagline, summary, timeline, thumbnail, theme, disciplines, category } = project
  // the folder colour is a soft tint of the project colour (see .feature / .folder in home.css)
  const style = { '--f-accent': theme.accent } as React.CSSProperties

  return (
    <article className="feature" style={style}>
      <p className="feature__tab">Project {String(index + 1).padStart(2, '0')}</p>
      <div className="feature__body">
        <div className="feature__text">
          <p className="feature__date">
            <span aria-hidden="true">●</span> <Editable value={timeline} />
          </p>
          <h3 className="feature__title">
            <Link to={`/work/${slug}`} className="feature__link">
              {title}
            </Link>
          </h3>
          <p className="feature__tagline">{tagline}</p>
          <p className="feature__summary">{summary}</p>
          <ul className="feature__tags" aria-label="Categories">
            <li>
              <span className="feature__tag">{category}</span>
            </li>
            {disciplines.map((d) => (
              <li key={d}>
                <span className="feature__tag">#{disciplineLabel(d)}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="feature__media">
          <Tape className="feature__tape feature__tape--l" />
          <Tape className="feature__tape feature__tape--r" />
          <img src={thumbnail.src} alt={thumbnail.alt} width={thumbnail.width} height={thumbnail.height} loading={index < 1 ? 'eager' : 'lazy'} decoding="async" />
        </figure>
      </div>
    </article>
  )
}

/** "Featured works" on Home, laid out as stacked folder-tab cards in each project's own colour. */
export function FeaturedWorks() {
  return (
    <section id="work" className="section featured" aria-labelledby="featured-title">
      <div className="container">
        <header className="section-head-c">
          <p className="hand section-kicker">explore my work!</p>
          <h2 id="featured-title" className="section-title">
            Featured Works
          </h2>
          <p className="section-lede">UX/UI case studies: research, design decisions and final interfaces.</p>
        </header>

        <ol className="featured__list">
          {featuredProjects.map((p, i) => (
            <li key={p.slug}>
              <FeatureCard project={p} index={i} />
            </li>
          ))}
        </ol>

        <p className="featured__more">
          <Link to="/work" className="btn btn--ghost">
            View all {projects.length} projects <Arrow />
          </Link>
        </p>
      </div>
    </section>
  )
}
