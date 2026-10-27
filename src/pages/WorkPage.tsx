import { Link, useSearchParams } from 'react-router-dom'
import { ProjectFolder } from '../components/FeaturedWorks'
import { disciplines, projects, type DisciplineId } from '../data/projects'
import { usePageMeta } from '../hooks/usePageMeta'

const isDiscipline = (v: string | null): v is DisciplineId => disciplines.some((d) => d.id === v)
const countFor = (id: DisciplineId) => projects.filter((p) => p.disciplines.includes(id)).length

export function WorkPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('category')
  const active: DisciplineId | 'all' = isDiscipline(raw) ? raw : 'all'
  const shown = active === 'all' ? projects : projects.filter((p) => p.disciplines.includes(active))

  usePageMeta('Case Study', 'Case studies by category: UX/UI design first, then graphic and visual design.')

  const select = (id: DisciplineId | 'all') => setParams(id === 'all' ? {} : { category: id }, { replace: true })

  // UX/UI first (order comes from `disciplines`); empty categories are hidden
  const filters = [
    { id: 'all' as const, label: 'All', count: projects.length },
    ...disciplines.map((d) => ({ ...d, count: countFor(d.id) })).filter((d) => d.count > 0),
  ]

  return (
    <section className="section work-page" aria-labelledby="work-page-title">
      <div className="container">
        {/* same header as Featured Works on Home; projects as compact folder cards */}
        <header className="section-head-c">
          <p className="hand section-kicker">explore my work!</p>
          <h1 id="work-page-title" className="section-title">
            Case Study
          </h1>
          <p className="section-lede">UX/UI case studies: research, design decisions and final interfaces.</p>
        </header>

        <div className="filters" role="group" aria-label="Filter projects by category">
          {filters.map((f) => (
            <button key={f.id} type="button" className="filter" aria-pressed={active === f.id} onClick={() => select(f.id)}>
              {f.id === 'all' ? f.label : `#${f.label}`}
              <span className="filter__count">{f.count}</span>
            </button>
          ))}
        </div>

        <p className="visually-hidden" role="status" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? 'project' : 'projects'}
        </p>

        {shown.length === 0 ? (
          <p className="work-page__empty">
            My graphic design work is the{' '}
            <Link to="/#asclo" className="text-link">
              ASCLO photo-editing gallery
            </Link>{' '}
            on the home page.
          </p>
        ) : (
          <ol className="folder-grid">
            {shown.map((p) => (
              <li key={p.slug}>
                <ProjectFolder project={p} index={projects.indexOf(p)} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
