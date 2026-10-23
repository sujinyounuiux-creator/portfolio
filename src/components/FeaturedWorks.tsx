import { Link } from 'react-router-dom'
import { disciplineHref, disciplineLabel, featuredProjects, projects, type Project } from '../data/projects'
import { Editable } from './Editable'
import { Tape } from './HandDrawnDecoration'

/** Picks white or ink text for a project's colour band (WCAG relative luminance). */
function textOn(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const vsWhite = 1.05 / (L + 0.05)
  const vsInk = (L + 0.05) / (0.0175 + 0.05) // ink #1F2430 has luminance ≈ 0.0175
  return vsWhite >= vsInk ? '#FFFFFF' : '#1F2430'
}

/** Compact folder card for the Case Study page: coloured tab, small thumbnail, title. */
export function ProjectFolder({ project, index }: { project: Project; index: number }) {
  const { slug, title, category, thumbnail, theme } = project
  const style = { '--f-bg': theme.accent, '--f-fg': textOn(theme.accent) } as React.CSSProperties

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
        <span className="folder__arrow" aria-hidden="true">
          →
        </span>
      </div>
    </article>
  )
}

/** Large folder-tab project card for Featured Works on Home. */
export function FeatureCard({ project, index }: { project: Project; index: number }) {
  const { slug, title, tagline, summary, timeline, thumbnail, theme, disciplines, category } = project
  const style = { '--f-bg': theme.accent, '--f-fg': textOn(theme.accent) } as React.CSSProperties

  return (
    <article className="feature" style={style}>
      <p className="feature__tab">Project{String(index + 1).padStart(2, '0')}</p>
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
          <span className="feature__cta" aria-hidden="true">
            View project <span className="arrow">↗</span>
          </span>
          <ul className="feature__tags" aria-label="Categories">
            <li>
              <span className="feature__tag wiggle">{category}</span>
            </li>
            {disciplines.map((d) => (
              <li key={d}>
                <Link to={disciplineHref(d)} className="feature__tag feature__tag--link wiggle">
                  #{disciplineLabel(d)}
                </Link>
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
            View all {projects.length} projects <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  )
}
