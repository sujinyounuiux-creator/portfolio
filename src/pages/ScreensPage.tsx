import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * A visual-first page of screens Sujin designed herself, for applications that care about
 * visuals more than UX process (e.g. screen graphics for film and TV). Not in the menu: the link
 * is sent directly. Only work Sujin made herself is shown here: no AI made screens, and for
 * team projects only her own parts.
 */
/**
 * Animated phone screens. The screen is cut into a still base (the screen with the moving parts
 * hidden) and transparent layers, all exported from Figma at 2x. Positions are in the 393 × 852
 * Figma frame. 'chat' brings the layers in one by one, like messages arriving. 'slide' is the
 * notification motion set in Figma (up from 200px below in 0.5s, on a 2s loop).
 */
type LayerKind = 'msg' | 'meta' | 'typing' | 'card'
type Layer = { src: string; x: number; y: number; w: number; h: number; kind: LayerKind }
type Anim = { base: string; mode: 'chat' | 'slide'; layers: Layer[] }
type Shot = { src: string; alt: string; w: number; h: number; device: 'phone' | 'tablet' | 'web' | 'post'; label: string; anim?: Anim }
type Group = { id: string; kind: string; title: string; note: string; shots: Shot[] }

const FW = 393
const FH = 852
const A = '/images/robert-story/anim/'
/** builds an Anim from [x, y, w, h, kind] rows; layer i is the file `${key}-L${i}.webp` */
function anim(key: string, mode: Anim['mode'], rows: [number, number, number, number, LayerKind][]): Anim {
  return { base: `${A}${key}-base.webp`, mode, layers: rows.map(([x, y, w, h, kind], i) => ({ src: `${A}${key}-L${i}.webp`, x, y, w, h, kind })) }
}

const groups: Group[] = [
  {
    id: 'seen',
    kind: 'Screen graphics · Short thriller',
    title: 'Seen',
    note: 'Phone screens for a short thriller about being watched. The story is told through two phones, starting on Robert’s and ending on Emily’s.',
    shots: [
      { src: '/images/robert-story/01-lock-screen.webp', alt: 'Robert’s lock screen at 9:41 with two Instagram notifications from emilyy.parker.', w: 786, h: 1704, device: 'phone', label: 'Robert’s lock screen', anim: anim('01', 'slide', [[4, 578, 385, 88, 'card']]) },
      { src: '/images/robert-story/02-instagram-profile.webp', alt: 'Emily’s Instagram profile as Robert sees it, with her photo grid and a Follow button.', w: 786, h: 1704, device: 'phone', label: 'Robert’s Instagram' },
      {
        src: '/images/robert-story/03-messages.webp', alt: 'Robert’s text messages to Emily. She asks how he got her number.', w: 786, h: 1704, device: 'phone', label: 'Robert’s messages',
        anim: anim('03', 'chat', [[4, 172, 385, 64, 'msg'], [4, 214, 385, 84, 'msg'], [4, 276, 385, 94, 'msg'], [4, 348, 385, 94, 'msg'], [4, 420, 385, 39, 'meta']]),
      },
      { src: '/images/robert-story/04-recent-calls.webp', alt: 'Robert’s recent calls, almost all to Emily Parker, late at night.', w: 786, h: 1704, device: 'phone', label: 'Robert’s recent calls' },
      {
        src: '/images/robert-story/05-instagram-dm.webp', alt: 'An Instagram DM where Emily asks Robert to stop messaging her.', w: 786, h: 1704, device: 'phone', label: 'Robert’s Instagram DM',
        anim: anim('05', 'chat', [[4, 511, 385, 86, 'msg'], [4, 575, 385, 72, 'msg'], [4, 625, 385, 62, 'msg'], [4, 665, 385, 84, 'msg'], [4, 727, 385, 39, 'meta']]),
      },
      { src: '/images/robert-story/06-location.webp', alt: 'A location app on Robert’s phone showing where Emily is right now.', w: 786, h: 1704, device: 'phone', label: 'Robert’s location app' },
      { src: '/images/robert-story/07-notes.webp', alt: 'Robert’s note titled Emily, with a checklist of her daily routine.', w: 786, h: 1704, device: 'phone', label: 'Robert’s notes' },
      {
        src: '/images/robert-story/08-messages-friend.webp', alt: 'Emily texts her friend Sarah that Robert keeps contacting her.', w: 786, h: 1704, device: 'phone', label: 'Emily’s messages',
        anim: anim('08', 'chat', [[4, 172, 385, 86, 'msg'], [4, 236, 385, 72, 'msg'], [4, 286, 385, 72, 'msg'], [4, 336, 385, 106, 'msg'], [4, 420, 385, 94, 'msg'], [4, 492, 385, 94, 'msg'], [4, 564, 385, 39, 'meta'], [4, 581, 385, 94, 'msg']]),
      },
      { src: '/images/robert-story/09-notification-center.webp', alt: 'Emily’s notification center at 11:59 with messages, missed calls and new followers.', w: 786, h: 1704, device: 'phone', label: 'Emily’s notification center', anim: anim('09', 'slide', [[4, 232, 385, 88, 'card']]) },
      {
        src: '/images/robert-story/10-final-message.webp', alt: 'Emily’s last message to an unknown number, “Please leave me alone. I’ve called the police.”', w: 786, h: 1704, device: 'phone', label: 'Emily’s last message',
        anim: anim('10', 'chat', [[4, 172, 385, 64, 'msg'], [4, 214, 385, 62, 'msg'], [4, 254, 385, 62, 'msg'], [4, 294, 385, 94, 'msg'], [4, 366, 385, 39, 'meta'], [4, 383, 385, 70, 'typing']]),
      },
    ],
  },
  {
    id: 'bca-mobile',
    kind: 'Phone app · Website',
    title: 'BCA, on a phone',
    note: 'A bilingual community website. I led the mobile design.',
    shots: [
      { src: '/images/projects/bca-m-home.webp', alt: 'BCA mobile home: a dark green hero with “Brazilian roots, at home in BC” and a Get BCA News button.', w: 780, h: 1690, device: 'phone', label: 'Home' },
      { src: '/images/projects/bca-m-events.webp', alt: 'BCA mobile events: “Find your next community moment” and the next event card.', w: 780, h: 1690, device: 'phone', label: 'Events' },
      { src: '/images/projects/bca-m-event-detail.webp', alt: 'BCA mobile event detail for the Brazilian Holiday Market, with a photo of the market.', w: 780, h: 1690, device: 'phone', label: 'Event detail' },
      { src: '/images/projects/bca-m-business-detail.webp', alt: 'BCA mobile business detail for Casa da Mesa Brazilian Kitchen, with contact buttons.', w: 780, h: 1690, device: 'phone', label: 'Business' },
      { src: '/images/projects/bca-m-menu.webp', alt: 'BCA mobile full screen menu with an EN / PT switch and a Get BCA News button.', w: 780, h: 1690, device: 'phone', label: 'Menu' },
      { src: '/images/projects/bca-m-events-month.webp', alt: 'BCA mobile event calendar in month view.', w: 780, h: 1690, device: 'phone', label: 'Event calendar' },
      { src: '/images/projects/bca-m-business.webp', alt: 'BCA mobile business directory with search, filters and a featured business.', w: 780, h: 1690, device: 'phone', label: 'Business directory' },
      { src: '/images/projects/bca-m-involved.webp', alt: 'BCA mobile get involved page with three ways to help.', w: 780, h: 1690, device: 'phone', label: 'Get involved' },
      { src: '/images/projects/bca-m-list-business.webp', alt: 'BCA mobile list your business page with free and member listings.', w: 780, h: 1690, device: 'phone', label: 'List your business' },
      { src: '/images/projects/bca-m-guides.webp', alt: 'BCA mobile guides and news with topic filters.', w: 780, h: 1690, device: 'phone', label: 'Guides and news' },
    ],
  },
  {
    id: 'bca-tablet',
    kind: 'Tablet',
    title: 'BCA, on an iPad',
    note: 'The same site, designed for tablet.',
    shots: [
      { src: '/images/projects/bca-ipad-home.webp', alt: 'BCA iPad home with the BCA News sign up and the next event.', w: 1100, h: 1525, device: 'tablet', label: 'Home' },
      { src: '/images/projects/bca-ipad-events-month.webp', alt: 'BCA iPad events with the community event calendar in month view.', w: 1100, h: 1525, device: 'tablet', label: 'Events calendar' },
      { src: '/images/projects/bca-ipad-business.webp', alt: 'BCA iPad business directory with search and filters.', w: 1100, h: 1525, device: 'tablet', label: 'Business directory' },
    ],
  },
  {
    id: 'yoga',
    kind: 'Website',
    title: 'Open Door Yoga',
    note: 'A calm studio website. I designed the About and Pricing pages.',
    shots: [
      { src: '/images/projects/yoga-about.webp', alt: 'Open Door Yoga about page with a full width photo and the serif title “Welcome to Open Door Yoga!”.', w: 1400, h: 3222, device: 'web', label: 'About' },
      { src: '/images/projects/yoga-pricing.webp', alt: 'Open Door Yoga passes and pricing page with a lilac hero and pass cards.', w: 1114, h: 2400, device: 'web', label: 'Pricing' },
    ],
  },
  {
    id: 'lastcow',
    kind: 'Phone app',
    title: 'LastCow',
    note: 'A ticket app for last minute events, designed in a team of two. I designed the Event details and Ticket calendar screens.',
    shots: [
      { src: '/images/lastcow-screens/onboarding.webp', alt: 'LastCow onboarding: the purple cow logo and LastCow name on soft purple waves.', w: 804, h: 1748, device: 'phone', label: 'Onboarding' },
      { src: '/images/lastcow-screens/login.webp', alt: 'LastCow log in with email and password, and Continue with Google or Apple.', w: 804, h: 1748, device: 'phone', label: 'Log in' },
      { src: '/images/lastcow-screens/home.webp', alt: 'LastCow home: a location picker, search and event cards for Tame Impala and The Strokes with prices and 24 hour changes.', w: 804, h: 1748, device: 'phone', label: 'Home' },
      { src: '/images/lastcow-screens/event-strokes.webp', alt: 'LastCow event details for The Strokes: a concert photo, the host with a Follow button, overview, location and a Get Tickets bar.', w: 804, h: 1748, device: 'phone', label: 'Event details' },
      { src: '/images/lastcow-screens/event-birthday.webp', alt: 'LastCow event details for Victor’s Birthday at the Fairmont Hotel Vancouver.', w: 804, h: 1748, device: 'phone', label: 'Event details' },
      { src: '/images/lastcow-screens/saved.webp', alt: 'LastCow saved events: Tame Impala and a birthday event with prices.', w: 804, h: 1748, device: 'phone', label: 'Saved events' },
      { src: '/images/lastcow-screens/calendar.webp', alt: 'LastCow ticket calendar: the August month view with the selected date and its event.', w: 804, h: 1748, device: 'phone', label: 'Ticket calendar' },
      { src: '/images/lastcow-screens/past-events.webp', alt: 'LastCow past events tab with the Vancouver Bird Celebration.', w: 804, h: 1748, device: 'phone', label: 'Past events' },
      { src: '/images/lastcow-screens/past-event-detail.webp', alt: 'LastCow past event detail for the Vancouver Bird Celebration with two tickets purchased.', w: 804, h: 1748, device: 'phone', label: 'Past event' },
      { src: '/images/lastcow-screens/profile.webp', alt: 'LastCow profile: the user, then preferences, help and legal settings.', w: 804, h: 1748, device: 'phone', label: 'Profile' },
    ],
  },
  {
    id: 'profitkey',
    kind: 'Website · Fintech',
    title: 'PROFITKEY',
    note: 'An investment website for beginners. I was the only designer on a team with five developers.',
    shots: [
      { src: '/images/screens/profitkey-web-home.webp', alt: 'PROFITKEY home: Finding the key to success, AI recommended stocks, stock rankings, market information and news.', w: 2400, h: 3479, device: 'web', label: 'Home' },
      { src: '/images/screens/profitkey-web-detail.webp', alt: 'PROFITKEY stock detail: key indicators, a price chart, an AI comment, financial indicators and analyst opinions.', w: 2400, h: 4498, device: 'web', label: 'Stock detail' },
      { src: '/images/screens/profitkey-en-community.webp', alt: 'PROFITKEY community tab with a comment box and threaded comments.', w: 2400, h: 2785, device: 'web', label: 'Community' },
      { src: '/images/screens/profitkey-en-news.webp', alt: 'PROFITKEY news page with headline cards and a list of all news.', w: 2400, h: 2368, device: 'web', label: 'News' },
      { src: '/images/screens/profitkey-en-watchlist.webp', alt: 'PROFITKEY my watchlist with saved stocks as chart cards.', w: 2400, h: 1612, device: 'web', label: 'My watchlist' },
      { src: '/images/screens/profitkey-en-notice-list.webp', alt: 'PROFITKEY notices list with an important maintenance notice first.', w: 2400, h: 1258, device: 'web', label: 'Notices' },
      { src: '/images/screens/profitkey-en-faq.webp', alt: 'PROFITKEY FAQ with questions in an accordion.', w: 2400, h: 1839, device: 'web', label: 'FAQ' },
      { src: '/images/screens/profitkey-en-login.webp', alt: 'PROFITKEY login with email and password and social log in buttons.', w: 2400, h: 1602, device: 'web', label: 'Login' },
    ],
  },
  {
    id: 'cookpad',
    kind: 'Website · Responsive',
    title: 'Cookpad',
    note: 'A personal redesign of a recipe website: search, recipe list and recipe page.',
    shots: [
      { src: '/images/projects/cookpad-main.webp', alt: 'Cookpad home: the logo and a large search bar with a filter icon.', w: 1600, h: 900, device: 'web', label: 'Home' },
      { src: '/images/projects/cookpad-list.webp', alt: 'Cookpad search results: recipe cards with photos, cooking times and bookmark icons.', w: 1600, h: 900, device: 'web', label: 'Search results' },
      { src: '/images/projects/cookpad-recipe-scroll.webp', alt: 'Cookpad recipe page for butter pancakes with ingredients, steps, tips and a community thread.', w: 1600, h: 1765, device: 'web', label: 'Recipe' },
    ],
  },
  {
    id: 'rizsq',
    kind: 'Social graphics',
    title: 'Rizsq',
    note: 'Social media posts for a farming app, made as a volunteer.',
    shots: [
      { src: '/images/rizsq/rizsq-communities.webp', alt: 'Rizsq post “Growing Food, Growing Communities” above a photo of women planting rice.', w: 1080, h: 1350, device: 'post', label: 'Post' },
      { src: '/images/rizsq/rizsq-growing.webp', alt: 'Rizsq post “Growing Together, Feeding the Future.” with farmers planting rice seedlings.', w: 1080, h: 1350, device: 'post', label: 'Post' },
      { src: '/images/rizsq/rizsq-farmer.webp', alt: 'Rizsq post: a woman carrying her baby while tending young plants.', w: 1080, h: 1080, device: 'post', label: 'Post' },
      { src: '/images/rizsq/rizsq-harvest.webp', alt: 'Rizsq banner: a farmer carrying rice across a field at sunset, “Every harvest deserves a fair price”.', w: 1600, h: 900, device: 'post', label: 'Banner' },
      { src: '/images/rizsq/rizsq-traditions.webp', alt: 'Rizsq banner: women washing in a canal beside a man on his phone, “Traditions must be side-by-side with technology”.', w: 1600, h: 900, device: 'post', label: 'Banner' },
    ],
  },
]

const pct = (v: number, of: number) => `${(v / of) * 100}%`
/** layer padding added around each element on export, in Figma px */
const PAD = 12

/** times (ms) at which each chat layer arrives, and the full loop length */
function chatTimeline(layers: Layer[]) {
  const at: number[] = []
  layers.forEach((l, i) => {
    const prev = at[i - 1] ?? 0
    if (i === 0) at.push(700)
    else if (l.kind === 'meta') at.push(prev + 450)
    else if (l.kind === 'typing') at.push(prev + 900)
    else at.push(prev + (layers[i - 1].kind === 'meta' ? 800 : 1100))
  })
  return { at, total: (at[at.length - 1] ?? 0) + 3800 }
}

function AnimatedScreen({ a, alt, eager = false }: { a: Anim; alt: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-layer]'))
    let anims: Animation[] = []

    if (a.mode === 'slide') {
      // the Figma motion, as set: y +200 → 0 in 0.5s (ease out), then hold, every 2s
      anims = els.map((el, i) =>
        el.animate(
          [
            { transform: `translateY(${(200 / a.layers[i].h) * 100}%)`, offset: 0, easing: 'cubic-bezier(0, 0, 0.58, 1)' },
            { transform: 'translateY(0)', offset: 0.25 },
            { transform: 'translateY(0)', offset: 1 },
          ],
          { duration: 2000, iterations: Infinity },
        ),
      )
    } else {
      const { at, total } = chatTimeline(a.layers)
      const out = (total - 450) / total
      anims = els.map((el, i) => {
        const kind = a.layers[i].kind
        const dur = kind === 'typing' ? 400 : 380
        const hidden = kind === 'msg' ? { opacity: 0, transform: 'translateY(14px) scale(0.96)' } : { opacity: 0, transform: 'none' }
        const shown = { opacity: 1, transform: 'none' }
        return el.animate(
          [
            { ...hidden, offset: 0 },
            { ...hidden, offset: at[i] / total, easing: kind === 'typing' ? 'ease-in' : 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
            { ...shown, offset: (at[i] + dur) / total },
            { ...shown, offset: out },
            { opacity: 0, transform: 'none', offset: 1 },
          ],
          { duration: total, iterations: Infinity },
        )
      })
    }

    // only play while the screen is on screen; start from the first message each time it comes into view
    anims.forEach((x) => x.pause())
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          anims.forEach((x) => {
            if (x.playState !== 'running') x.currentTime = 0
            x.play()
          })
        } else anims.forEach((x) => x.pause())
      },
      { threshold: 0.25 },
    )
    io.observe(root)
    return () => {
      io.disconnect()
      anims.forEach((x) => x.cancel())
    }
  }, [a])

  return (
    <div className="scr-anim" ref={ref} role="img" aria-label={alt}>
      <img className="scr-anim__img" src={a.base} alt="" width={FW * 2} height={FH * 2} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      {a.layers.map((l) => (
        <div key={l.src} data-layer className="scr-anim__layer" style={{ left: pct(l.x, FW), top: pct(l.y, FH), width: pct(l.w, FW), height: pct(l.h, FH) }}>
          {l.kind === 'card' && <span className="scr-anim__glass" style={{ inset: `${pct(PAD, l.h)} ${pct(PAD, l.w)}` }} />}
          <img className="scr-anim__img" src={l.src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
        </div>
      ))}
    </div>
  )
}

function Screen({ s, onOpen }: { s: Shot; onOpen: (s: Shot) => void }) {
  return (
    <figure className={`scr-shot scr-shot--${s.device}`}>
      <button type="button" className="scr-shot__frame" onClick={() => onOpen(s)} aria-label={`${s.label}, see it full size`}>
        {s.anim ? <AnimatedScreen a={s.anim} alt={s.alt} /> : <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" />}
      </button>
      <figcaption>{s.label}</figcaption>
    </figure>
  )
}

/** Full size view. Long pages scroll; clicking anywhere outside the image, or Esc, closes it. */
function Viewer({ s, onClose }: { s: Shot; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])
  const outside = (e: React.MouseEvent) => e.target === e.currentTarget && onClose()
  return (
    <div className="scr-view" role="dialog" aria-modal="true" aria-label={s.label} onClick={outside}>
      <button type="button" className="scr-view__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="scr-view__scroll" onClick={outside}>
        {s.anim ? (
          <div className={`scr-view__img scr-view__img--${s.device} scr-view__img--anim`}>
            <AnimatedScreen a={s.anim} alt={s.alt} eager />
          </div>
        ) : (
          <img className={`scr-view__img scr-view__img--${s.device}`} src={s.src} alt={s.alt} width={s.w} height={s.h} />
        )}
      </div>
    </div>
  )
}

export function ScreensPage() {
  const [open, setOpen] = useState<Shot | null>(null)
  const close = useCallback(() => setOpen(null), [])
  usePageMeta('Screens', `${site.name}, interface design. Phone, tablet and website screens.`)

  return (
    <div className="scr">
      <header className="scr-top">
        <span className="scr-top__name">{site.name}</span>
        <nav className="scr-top__links" aria-label="Links">
          <a href={`mailto:${site.email}`}>Email</a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <Link to="/">Full portfolio</Link>
        </nav>
      </header>

      <section className="scr-intro">
        <p className="scr-intro__kicker">Interface design</p>
        <h1>Screens</h1>
        <p className="scr-intro__lede">Phone, tablet and website screens I designed. Click any screen to see it full size.</p>
      </section>

      {groups.map((g) => (
        <section key={g.id} className={`scr-group scr-group--${g.shots[0].device}`} aria-labelledby={`scr-${g.id}`}>
          <div className="scr-group__head">
            <p className="scr-group__kind">{g.kind}</p>
            <h2 id={`scr-${g.id}`}>{g.title}</h2>
            <p className="scr-group__note">{g.note}</p>
          </div>
          <div className="scr-group__shots">
            {g.shots.map((s, i) => (
              <Screen key={s.src + i} s={s} onOpen={setOpen} />
            ))}
          </div>
        </section>
      ))}

      <footer className="scr-foot">
        <p>
          {site.name} · {site.location}
        </p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </footer>

      {open && <Viewer s={open} onClose={close} />}
    </div>
  )
}
