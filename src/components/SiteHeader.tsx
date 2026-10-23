import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../data/site'

// Navigation styled after the Meeko template: a light rounded bar,
// name on the left, links on the right with a hover underline.
const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Case Study' },
  { to: '/#contact', label: 'Contact' },
]

function isActive(to: string, pathname: string, hash: string) {
  if (to === '/#contact') return pathname === '/' && hash === '#contact'
  if (to === '/') return pathname === '/' && hash !== '#contact'
  if (to === '/work') return pathname === '/work' || pathname.startsWith('/work/')
  return pathname === to
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="4.5" cy="4.5" r="2.5" fill="currentColor" />
      <rect x="2.25" y="8.5" width="4.5" height="13" rx="0.6" fill="currentColor" />
      <path d="M9.5 8.5h4.3v1.9c.7-1.3 2.3-2.2 4.2-2.2 3.4 0 4.5 2.1 4.5 5.4v7.9H18v-7c0-1.7-.4-2.9-2-2.9s-2.2 1.3-2.2 2.9v7H9.5z" fill="currentColor" />
    </svg>
  )
}

export function SiteHeader() {
  const { pathname, hash } = useLocation()
  const [open, setOpen] = useState(false)

  // close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname, hash])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="container">
        <div className={`navbar ${open ? 'is-open' : ''}`}>
          <Link to="/" className="navbar__name">
            {site.name}
          </Link>

          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="navbar__burger" aria-hidden="true" />
          </button>

          <nav id="main-menu" className="navbar__menu" aria-label="Main">
            <ul className="nav-list">
              {links.map((l) => {
                const active = isActive(l.to, pathname, hash)
                return (
                  <li key={l.to}>
                    <Link to={l.to} className={`nav-link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <a className="navbar__social" href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
              <LinkedInIcon />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
