import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CrayonDefs } from './HandDrawnDecoration'
import { LightboxProvider } from './Lightbox'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/** Scrolls to the top on page change, or to the #hash target when present. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // effects run after render, so the target section already exists
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
        el.focus({ preventScroll: true })
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export function Layout() {
  return (
    // one image lightbox for the whole site: any <ZoomImage> opens in it
    <LightboxProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CrayonDefs />
      <ScrollManager />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </LightboxProvider>
  )
}
