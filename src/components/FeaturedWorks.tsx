import type { MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { disciplineLabel, featuredProjects, type Project } from '../data/projects'

/**
 * A click anywhere on a project card opens its case study (the title stays the real link
 * for keyboards and screen readers). Clicks on another link, or ones that end a text
 * selection, are left alone.
 */
function useCardClick(slug: string) {
  const navigate = useNavigate()
  return (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a, button') || window.getSelection()?.toString()) return
    navigate(`/work/${slug}`)
  }
}

/** Folder card for Featured Works on Home: coloured tab, thumbnail, title, tags and one result. */
export function ProjectFolder({ project, index }: { project: Project; index: number }) {
  const { slug, title, category, thumbnail, theme, proof, disciplines } = project
  // the folder colour is a soft tint of the project colour (see .feature / .folder in home.css)
  const style = { '--f-accent': theme.accent } as React.CSSProperties
  const onClick = useCardClick(slug)

  return (
    <article className="folder" style={style} onClick={onClick}>
      <p className="folder__tab">Project {String(index + 1).padStart(2, '0')}</p>
      <div className="folder__body">
        <div className="folder__thumb">
          <img src={thumbnail.src} alt="" width={thumbnail.width} height={thumbnail.height} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
        </div>
        <div className="folder__text">
          <h3 className="folder__title">
            <Link to={`/work/${slug}`} className="folder__link">
              {title}
            </Link>
          </h3>
          <p className="folder__meta">{category}</p>
          <ul className="feature__tags folder__tags" aria-label="Design fields">
            {disciplines.map((d) => (
              <li key={d}>
                <span className="feature__tag">#{disciplineLabel(d)}</span>
              </li>
            ))}
          </ul>
          <p className="folder__proof">
            <strong>{proof.value}</strong> {proof.label}
          </p>
        </div>
      </div>
    </article>
  )
}

/** "Featured works" on Home: the featured projects as folder cards, two per row. */
export function FeaturedWorks() {
  return (
    <section id="work" className="section featured" aria-labelledby="featured-title">
      <div className="container">
        <header className="section-head-c">
          <p className="hand section-kicker">Explore my work!</p>
          <h2 id="featured-title" className="section-title">
            Featured Works
          </h2>
          <p className="section-lede">UX/UI case studies: research, design decisions and final interfaces.</p>
        </header>

        <ol className="folder-grid">
          {featuredProjects.map((p, i) => (
            <li key={p.slug}>
              <ProjectFolder project={p} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
