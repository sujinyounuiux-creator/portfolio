import { isPlaceholder, site } from '../data/site'

/** Real links render as anchors; unfinished ones render as visible to-do chips, never broken links. */
export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`social-links ${className}`}>
      <li>
        <a className="social-link" href={`mailto:${site.email}`}>
          Email
        </a>
      </li>
      {site.socials.map((s) =>
        isPlaceholder(s.url) ? (
          <li key={s.label}>
            <span className="social-link social-link--todo" title="Add this link in src/data/site.ts">
              {s.label} <span className="placeholder">{s.url}</span>
            </span>
          </li>
        ) : (
          <li key={s.label}>
            <a className="social-link" href={s.url} target="_blank" rel="noreferrer">
              {s.label}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
        ),
      )}
    </ul>
  )
}
