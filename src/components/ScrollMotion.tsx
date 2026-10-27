import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Site-wide scroll motion, added on top of the pages without changing them:
 * - reveal: headings, text blocks, cards and images rise and fade in as they
 *   scroll into view (siblings one after another), clearing a soft blur; images
 *   grow into place and cards, folders and Polaroids swing in with a slight tilt
 * - parallax: the Home hero's soft blob and the name and slogan drift at slightly
 *   different speeds while scrolling (the hashtag labels stay where they are)
 * - progress: a thin bar on case studies that fills as you read
 * Nothing moves for people who ask for reduced motion, and content is only ever
 * hidden after this script has started (styles in motion.css are scoped to .motion).
 */

// what to reveal, and how; listed outer elements win over anything inside them.
// Hashtag tags never move: the hero labels, the About Me specialties, the project tags
// and the Case Study filters stay put, so blocks holding them reveal their other parts only.
const REVEAL: [string, 'title' | 'up' | 'media' | 'pop'][] = [
  ['.section-title, .cs-section__head, .cs-hero__title, .contact__title, .about-hello', 'title'],
  ['.cs-hero__media, .cs-figure, .cs-feature__media, .devices, .compare-set, .cs-embed, .cs-pages, .walkthrough, .feature__media, .folder__thumb', 'media'],
  // card-like pieces swing in with a slight tilt
  ['.cs-card, .folder, .collage__item, .cs-swatch, .cs-stats > div, .cs-kit__item, .cs-pager__card, .cs-tldr__list > div', 'pop'],
  [
    [
      '.section-kicker', '.section-lede', '.cs-hero__tagline', '.cs-hero__summary', '.cs-facts', '.cs-tldr__title',
      '.cs-prose', '.cs-quotes li', '.type-specimen li', '.cs-outline__step',
      '.cs-bars', '.cs-icons__group', '.cs-feature__text', '.feature__text > :not(.feature__tags)',
      '.about-home__col > :not(.about-home__specialties):not(.collage)', '.about-block', '.experience > li', '.skills > li', '.tools > li', '.side-facts',
      '.volunteer__grid > *', '.asclo__grid > *', '.contact__lede', '.contact__actions', '.stamp-bar',
    ].join(', '),
    'up',
  ],
]

// [selector, speed]: positive drifts up faster than the page as it scrolls, negative lags behind
const PARALLAX: [string, number][] = [
  ['.hero__blob', -0.1],
  ['.hero__copy', 0.12],
]

export function ScrollMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches || !('IntersectionObserver' in window)) return
    const root = document.documentElement
    root.classList.add('motion')
    const main = document.getElementById('main')
    if (!main) return

    // ── reveal ──
    const picked = new Map<Element, string>()
    for (const [sel, kind] of REVEAL) main.querySelectorAll(sel).forEach((el) => picked.has(el) || picked.set(el, kind))
    const targets = [...picked.keys()]
      .filter((el) => {
        // the outermost match wins, so nested elements don't animate twice
        for (let p = el.parentElement; p && p !== main; p = p.parentElement) if (picked.has(p)) return false
        return true
      })
      .filter((el) => !el.hasAttribute('data-reveal'))

    const order = new Map<Element, number>()
    for (const el of targets) {
      const parent = el.parentElement!
      const i = order.get(parent) ?? 0
      order.set(parent, i + 1)
      ;(el as HTMLElement).style.setProperty('--d', `${Math.min(i, 6) * 120}ms`)
      el.setAttribute('data-reveal', picked.get(el)!)
    }

    const pending = new Set<Element>(targets)
    const arrive = (el: Element) => {
      if (!pending.delete(el)) return
      el.classList.add('is-in')
      io.unobserve(el)
      // hand transitions back to the element's own hover styles once it has arrived
      window.setTimeout(() => el.classList.add('is-done'), 2400)
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) arrive(e.target)
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )
    targets.forEach((el) => io.observe(el))

    // ── parallax + reading progress ──
    const drifters: { el: HTMLElement; speed: number }[] = []
    for (const [sel, speed] of PARALLAX) main.querySelectorAll<HTMLElement>(sel).forEach((el) => drifters.push({ el, speed }))
    const bar = document.querySelector<HTMLElement>('.read-progress')

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      // the hero layers sit exactly where they were designed at the top of the page,
      // then drift by their own speed as it scrolls away (no work once it's gone)
      const y = Math.min(window.scrollY, vh * 1.5)
      for (const d of drifters) d.el.style.setProperty('--py', `${Math.round(-y * d.speed * 10) / 10}px`)
      // a big jump (End key, scrollbar drag, link to a section) can skip past elements
      // before the observer sees them: anything already above the fold arrives anyway
      for (const el of pending) if (el.getBoundingClientRect().top < vh * 0.92) arrive(el)
      if (bar) {
        const max = root.scrollHeight - vh
        bar.style.setProperty('--progress', String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    drifters.forEach((d) => d.el.setAttribute('data-parallax', ''))
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pathname])

  // the reading progress bar only shows on case studies
  return pathname.startsWith('/work/') ? <div className="read-progress" aria-hidden="true" /> : null
}
