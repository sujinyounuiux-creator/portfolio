export type SitemapNode = {
  label: string
  note?: string
  /** page (default), view = a view or tool inside a page, success / error = a confirmation state */
  type?: 'page' | 'view' | 'success' | 'error'
  children?: SitemapNode[]
}

const TYPES: { type: NonNullable<SitemapNode['type']>; label: string }[] = [
  { type: 'page', label: 'Page' },
  { type: 'view', label: 'View or tool on a page' },
  { type: 'success', label: 'Success state' },
  { type: 'error', label: 'Error / retry state' },
]

function Tree({ nodes }: { nodes: SitemapNode[] }) {
  return (
    <ul className="smap__tree">
      {nodes.map((n) => (
        <li key={n.label}>
          <span className={`smap__node smap__node--${n.type ?? 'page'}`}>
            <strong>{n.label}</strong>
            {n.note && <span>{n.note}</span>}
          </span>
          {n.children && <Tree nodes={n.children} />}
        </li>
      ))}
    </ul>
  )
}

/**
 * A sitemap drawn as real, readable HTML (not a picture): the home page on top, one column per
 * main section with its pages as an indented tree, and the shared elements underneath.
 */
export function Sitemap({
  root,
  sections,
  shared,
  caption,
}: {
  root: string
  sections: { title: string; items: SitemapNode[] }[]
  shared?: { title: string; items: SitemapNode[] }
  caption?: string
}) {
  return (
    <figure className="smap">
      <div className="smap__root">
        <span className="smap__node smap__node--root">
          <strong>{root}</strong>
        </span>
      </div>
      <ol className="smap__sections">
        {sections.map((s, i) => (
          <li key={s.title} className="smap__section">
            <p className="smap__head">
              <span>{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </p>
            <Tree nodes={s.items} />
          </li>
        ))}
      </ol>
      {shared && (
        <div className="smap__shared">
          <p className="smap__head smap__head--shared">{shared.title}</p>
          <ul className="smap__chips">
            {shared.items.map((n) => (
              <li key={n.label}>
                <span className={`smap__node smap__node--${n.type ?? 'page'}`}>
                  <strong>{n.label}</strong>
                  {n.note && <span>{n.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul className="smap__legend" aria-label="Key">
        {TYPES.map((t) => (
          <li key={t.type}>
            <span className={`smap__swatch smap__node--${t.type}`} aria-hidden="true" />
            {t.label}
          </li>
        ))}
      </ul>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
