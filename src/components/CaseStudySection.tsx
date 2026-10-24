import type { Block, Figure, Section } from '../data/projects'
import { CompareSlider } from './CompareSlider'
import { DeviceFrame } from './DeviceFrame'
import { PlaceholderBlock } from './Editable'
import { ZoomImage } from './Lightbox'
import { Walkthrough } from './Walkthrough'

function FigureView({ figure }: { figure: Figure }) {
  const img = <ZoomImage figure={figure} />
  return (
    <figure className={`cs-figure ${figure.tall ? 'cs-figure--tall' : ''} ${figure.wide ? 'cs-figure--wide' : ''}`}>
      {figure.tall ? (
        // Long page captures scroll inside a frame instead of stretching the page.
        <div className="cs-figure__scroll" tabIndex={0} role="region" aria-label={`${figure.caption ?? 'Full page'} (scrollable)`}>
          {img}
        </div>
      ) : (
        <div className="cs-figure__frame">{img}</div>
      )}
      {figure.caption && <figcaption>{figure.caption}</figcaption>}
    </figure>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'text':
      return (
        <div className="cs-prose">
          {block.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )
    case 'list':
      return (
        <div className="cs-prose">
          {block.intro && <p>{block.intro}</p>}
          <ul className="cs-list">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )
    case 'quotes':
      return (
        <figure className="cs-quotes">
          <ul>
            {block.items.map((q) => (
              <li key={q}>
                <blockquote>“{q}”</blockquote>
              </li>
            ))}
          </ul>
          <figcaption>{block.source}</figcaption>
        </figure>
      )
    case 'cards':
      return (
        <ul className={`cs-cards cs-cards--${block.items.length}`}>
          {block.items.map((c) => (
            <li key={c.title} className="cs-card">
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
      )
    case 'figure':
      return <FigureView figure={block.figure} />
    case 'gallery':
      return (
        <div className={`cs-gallery cs-gallery--${Math.min(block.figures.length, 4)}`}>
          {block.figures.map((f) => (
            <FigureView key={f.src} figure={f} />
          ))}
        </div>
      )
    case 'swatches':
      return (
        <div className="cs-swatches-wrap">
          <ul className="cs-swatches" aria-label="Project colour palette">
            {block.swatches.map((s, i) => (
              <li key={`${s.hex}-${i}`} className="cs-swatch">
                <span className="cs-swatch__chip" style={{ background: s.hex }} aria-hidden="true" />
                <span className="cs-swatch__name">{s.name}</span>
                <code>{s.hex}</code>
                {s.usage && <span className="cs-swatch__usage">{s.usage}</span>}
              </li>
            ))}
          </ul>
          {block.note && <p className="cs-note">{block.note}</p>}
        </div>
      )
    case 'placeholder':
      return <PlaceholderBlock label={block.label} hint={block.hint} />
    case 'devices':
      return (
        <div className={`devices devices--${block.device} devices--${Math.min(block.screens.length, 4)}`}>
          {block.screens.map((f) => (
            <DeviceFrame key={f.src} device={block.device} figure={f} />
          ))}
        </div>
      )
    case 'compare':
      return (
        <DeviceFrame device="desktop" caption={block.caption} className="device--compare">
          <CompareSlider label={block.label} before={block.before} after={block.after} />
        </DeviceFrame>
      )
    case 'stats':
      return (
        <dl className={`cs-stats cs-stats--${block.items.length}`}>
          {block.items.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )
    case 'feature': {
      // very wide images (e.g. a full width panel) read better stacked under the text
      const wide = block.figures.every((f) => f.width / f.height > 2.4)
      return (
        <div className={`cs-feature ${block.reverse ? 'cs-feature--reverse' : ''} ${wide ? 'cs-feature--stack' : ''}`}>
          <div className="cs-feature__text">
            {block.tag && <p className="cs-feature__tag">{block.tag}</p>}
            <h3>{block.title}</h3>
            {block.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="cs-feature__media">
            {block.figures.map((f) => (
              <FigureView key={f.src} figure={f} />
            ))}
          </div>
        </div>
      )
    }
    case 'icons':
      return (
        <div className="cs-icons">
          {block.groups.map((g) => (
            <section key={g.title} className="cs-icons__group" aria-label={g.title}>
              <h4>{g.title}</h4>
              <p>{g.note}</p>
              <ul>
                {g.items.map((it) => (
                  <li key={it.src}>
                    <img src={it.src} alt="" width={84} height={84} loading="lazy" decoding="async" />
                    <span>{it.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )
    case 'pages':
      return (
        <figure className="cs-pages">
          <ol className="cs-pages__list">
            {block.items.map((p, i) => (
              <li key={p.label} className="cs-pages__item">
                <div className="cs-pages__window">
                  <div className="cs-pages__bar" aria-hidden="true">
                    <span className="cs-pages__dots" />
                    <span className="cs-pages__url">{p.label}</span>
                  </div>
                  <ZoomImage figure={p.figure} />
                </div>
                <p className="cs-pages__label">
                  <span className="cs-pages__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {p.label}
                </p>
              </li>
            ))}
          </ol>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    case 'compareSet':
      return (
        <div className="devices devices--phone compare-set">
          {block.items.map((it) => (
            <DeviceFrame key={it.label} device="phone" caption={it.label} className="device--compare">
              <CompareSlider label={it.label} labels={block.labels} before={it.before} after={it.after} />
            </DeviceFrame>
          ))}
        </div>
      )
    case 'walkthrough':
      return <Walkthrough steps={block.steps} caption={block.caption} />
    case 'embed':
      return (
        <figure className={`cs-embed ${block.variant ? `cs-embed--${block.variant}` : ''}`}>
          <div className="cs-embed__frame">
            <iframe src={block.src} title={block.title} loading="lazy" allowFullScreen />
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
          {block.link && (
            <a className="btn btn--accent cs-embed__link" href={block.link.href} target="_blank" rel="noreferrer">
              {block.link.label} <span className="arrow" aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          )}
        </figure>
      )
    case 'bars':
      return (
        <figure className="cs-bars">
          {block.eyebrow && <p className="cs-bars__eyebrow">{block.eyebrow}</p>}
          <h4 className="cs-bars__title">{block.title}</h4>
          <ul className="cs-bars__list">
            {block.items.map((it) => (
              <li key={it.label}>
                <span className="cs-bars__label">{it.label}</span>
                <span className="cs-bars__track" aria-hidden="true">
                  <span className="cs-bars__fill" style={{ width: `${it.value}%` }} />
                </span>
                <span className="cs-bars__value">{it.value}%</span>
              </li>
            ))}
          </ul>
          {/* source sits directly under the chart */}
          <figcaption>
            {block.source}
            {block.sourceUrl && (
              <>
                {' '}
                <a className="text-link" href={block.sourceUrl} target="_blank" rel="noreferrer">
                  {new URL(block.sourceUrl).hostname}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </>
            )}
          </figcaption>
          {block.takeaway && (
            <p className="cs-bars__takeaway">
              <strong>What it means: </strong>
              {block.takeaway}
            </p>
          )}
        </figure>
      )
    case 'outline':
      return (
        <figure className="cs-outline">
          <ol className="cs-outline__list">
            {block.steps.map((s, i) => (
              <li key={s.title} className={`cs-outline__step ${s.note ? 'cs-outline__step--key' : ''}`}>
                <span className="cs-outline__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h4>{s.title}</h4>
                  {s.note && <p className="cs-outline__note">{s.note}</p>}
                  <ul>
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    case 'type':
      return (
        <figure className="type-figure">
          <ul className="type-specimen" aria-label="Typography styles">
            {block.styles.map((s) => (
              <li key={`${s.name}-${s.weight}-${s.size}`}>
                <span className="type-specimen__meta">
                  <strong>{s.name}</strong>
                  <span>
                    {s.font} {s.weight === 700 ? 'Bold' : s.weight === 500 ? 'Medium' : 'Regular'} · {s.size}px
                  </span>
                </span>
                <span
                  className="type-specimen__sample"
                  style={{ fontFamily: `'${s.font}', serif`, fontWeight: s.weight, fontSize: `clamp(1rem, ${(s.size / 16) * 0.42}rem + 1vw, ${Math.min(s.size, 72) / 16}rem)` }}
                >
                  {s.sample}
                </span>
              </li>
            ))}
          </ul>
          {block.note && <figcaption>{block.note}</figcaption>}
        </figure>
      )
  }
}

export function CaseStudySection({ section, index }: { section: Section; index: number }) {
  return (
    <section id={section.id} className="cs-section" aria-labelledby={`${section.id}-title`}>
      <header className="cs-section__head">
        <span className="cs-section__num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 id={`${section.id}-title`}>{section.title}</h2>
        {section.note && (
          <span className="hand cs-section__note" aria-hidden="true">
            {section.note}
          </span>
        )}
      </header>
      <div className="cs-section__body">
        {section.blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}
      </div>
    </section>
  )
}
