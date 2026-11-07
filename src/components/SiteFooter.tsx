import { site } from '../data/site'
import { SocialLinks } from './SocialLinks'

export function SiteFooter() {
  const toTop = () => {
    window.scrollTo({ top: 0 })
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>
          © {new Date().getFullYear()} {site.name} · <span className="hand">Designed &amp; doodled in {site.location}</span>
        </p>
        <SocialLinks className="social-links--footer" />
        <button type="button" className="to-top" onClick={toTop} aria-label="Back to top">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="21.5" />
            <path d="M24 34V14.5M14.5 24l9.5-9.5 9.5 9.5" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
