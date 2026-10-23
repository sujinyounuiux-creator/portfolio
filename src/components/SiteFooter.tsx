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
          © {new Date().getFullYear()} {site.name} · <span className="hand">designed &amp; doodled in {site.location}</span>
        </p>
        <SocialLinks className="social-links--footer" />
        <button type="button" className="text-link link-button" onClick={toTop}>
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
