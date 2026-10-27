import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Long screens inside the laptop and phone mockups (and the tall scrolling page
 * captures) glide down by themselves while they're on screen, rest at the bottom,
 * glide back to the top and go again, so visitors see the whole page without
 * scrolling it. As soon as someone scrolls, touches, clicks or tabs into one, that
 * screen stops for good and is theirs to control. Off for reduced motion.
 */
const SELECTOR = '.device__scroll, .cs-figure__scroll'
const SPEED = 55 // px per second
const REST = 1600 // ms paused at the top and the bottom

type State = { el: HTMLElement; visible: boolean; stopped: boolean; dir: 1 | -1; restUntil: number; y: number }

export function AutoScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const main = document.getElementById('main')
    if (!main) return

    const states = new Map<HTMLElement, State>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const s = states.get(e.target as HTMLElement)
          if (s) s.visible = e.intersectionRatio >= 0.35
        }
      },
      { threshold: [0, 0.35, 0.6] },
    )
    const stop = (e: Event) => {
      const s = states.get(e.currentTarget as HTMLElement)
      if (s) s.stopped = true
    }
    const userEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'focusin'] as const
    const track = (el: HTMLElement) => {
      if (states.has(el)) return
      states.set(el, { el, visible: false, stopped: false, dir: 1, restUntil: performance.now() + REST, y: el.scrollTop })
      userEvents.forEach((t) => el.addEventListener(t, stop, { passive: true }))
      io.observe(el)
    }
    main.querySelectorAll<HTMLElement>(SELECTOR).forEach(track)
    // the walkthrough swaps in a new screen when a tab is picked: pick those up too
    const mo = new MutationObserver(() => main.querySelectorAll<HTMLElement>(SELECTOR).forEach(track))
    mo.observe(main, { childList: true, subtree: true })

    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      for (const s of states.values()) {
        if (!s.el.isConnected) {
          states.delete(s.el)
          continue
        }
        if (s.stopped || !s.visible || document.hidden || now < s.restUntil) continue
        const max = s.el.scrollHeight - s.el.clientHeight
        if (max < 8) continue
        // back to the top is quicker than the way down
        s.y = Math.min(max, Math.max(0, s.y + s.dir * SPEED * (s.dir === 1 ? 1 : 3) * (dt / 1000)))
        s.el.scrollTop = s.y
        if ((s.dir === 1 && s.y >= max) || (s.dir === -1 && s.y <= 0)) {
          s.dir = s.dir === 1 ? -1 : 1
          s.restUntil = now + REST
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      mo.disconnect()
      for (const s of states.values()) userEvents.forEach((t) => s.el.removeEventListener(t, stop))
    }
  }, [pathname])

  return null
}
