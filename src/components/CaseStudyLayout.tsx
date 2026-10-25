import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { getNeighbours } from '../data/projects'
import { CaseStudySection } from './CaseStudySection'
import { ContactCTA } from './ContactCTA'
import { Editable } from './Editable'
import { Underline } from './HandDrawnDecoration'

/** Highlights the table-of-contents entry for the section currently in view. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

/** Previous / next project preview: the project's main image, direction and title; the whole card is the link. */
function PagerCard({ project, dir }: { project: Project; dir: 'prev' | 'next' }) {
  const { slug, title, category, thumbnail, theme } = project
  return (
    <Link
      to={`/work/${slug}`}
      className={`cs-pager__card cs-pager__card--${dir}`}
      style={{ '--pager-accent': theme.accent } as React.CSSProperties}
    >
      <span className="cs-pager__media">
        <img src={thumbnail.src} alt="" width={thumbnail.width} height={thumbnail.height} loading="lazy" decoding="async" />
      </span>
      <span className="cs-pager__text">
        <span className="cs-pager__dir">
          {dir === 'prev' ? (
            <>
              <span className="arrow" aria-hidden="true">←</span> Previous project
            </>
          ) : (
            <>
              Next project <span className="arrow" aria-hidden="true">→</span>
            </>
          )}
        </span>
        <span className="cs-pager__title">{title}</span>
        <span className="cs-pager__category">{category}</span>
      </span>
    </Link>
  )
}

export function CaseStudyLayout({ project }: { project: Project }) {
  const { prev, next } = getNeighbours(project.slug)
  const ids = project.sections.map((s) => s.id)
  const active = useActiveSection(ids)

  const facts: [string, string][] = [
    ['Role', project.role],
    ['Team', project.team],
    ['Timeline', project.timeline],
    ['Platform', project.platform],
    ['Tools', project.tools.join(', ')],
  ]

  return (
    <article
      className="case-study"
      style={
        {
          '--p-accent': project.theme.accent,
          '--p-ink': project.theme.ink,
          '--p-surface': project.theme.surface,
        } as React.CSSProperties
      }
    >
      <header className="cs-hero">
        <div className="container">
          <nav aria-label="Breadcrumb" className="cs-breadcrumb">
            <Link to="/work" className="text-link">
              ← All projects
            </Link>
          </nav>

          <div className="cs-hero__grid">
            <div>
              <p className="eyebrow">{project.category}</p>
              <h1 className="cs-hero__title">{project.title}</h1>
              <p className="cs-hero__tagline">
                <span className="marked">
                  {project.tagline}
                  <Underline className="marked__line" color="var(--p-accent)" />
                </span>
              </p>
              <p className="cs-hero__summary">{project.summary}</p>
            </div>

            <dl className="cs-facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    <Editable value={v} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="container">
          <div className="cs-hero__media">
            <img src={project.hero.src} alt={project.hero.alt} width={project.hero.width} height={project.hero.height} fetchPriority="high" />
          </div>
        </div>
      </header>

      {project.tldr && (
        <section className="container cs-tldr" aria-labelledby="tldr-title">
          <h2 id="tldr-title" className="cs-tldr__title">
            TL;DR
          </h2>
          <dl className="cs-tldr__list">
            {project.tldr.map((t) => (
              <div key={t.label}>
                <dt>{t.label}</dt>
                <dd>{t.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="container cs-body">
        <nav className="cs-toc" aria-label="On this page">
          <p className="cs-toc__label">On this page</p>
          <ol>
            {project.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="cs-content">
          {project.sections.map((s, i) => (
            <CaseStudySection key={s.id} section={s} index={i} />
          ))}
        </div>
      </div>

      <nav className="container cs-pager" aria-label="More projects">
        <PagerCard project={prev} dir="prev" />
        <PagerCard project={next} dir="next" />
        <Link to="/work" className="cs-pager__all">
          View all projects
        </Link>
      </nav>

      <ContactCTA showProjectsLink />
    </article>
  )
}
