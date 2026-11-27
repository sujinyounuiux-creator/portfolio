import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * A visual-first page of screens Sujin designed herself, for applications that care about
 * visuals more than UX process (e.g. screen graphics for film and TV). Not in the menu: the link
 * is sent directly. Only work Sujin made herself is shown here: no AI made screens, and for
 * team projects only her own parts.
 */
type Shot = { src: string; alt: string; w: number; h: number; device: 'phone' | 'tablet' | 'web' | 'post'; label: string }
type Group = { id: string; kind: string; title: string; note: string; shots: Shot[] }

const groups: Group[] = [
  {
    id: 'lastcow',
    kind: 'Phone app',
    title: 'LastCow',
    note: 'A ticket app for last minute events. I designed the Event details and Ticket calendar screens.',
    shots: [
      { src: '/images/screens/lastcow-event-hifi.webp', alt: 'LastCow event details: a concert photo, the host with a Follow button, overview, location and a Get Tickets bar.', w: 600, h: 1304, device: 'phone', label: 'Event details' },
      { src: '/images/screens/lastcow-calendar-hifi.webp', alt: 'LastCow ticket calendar: the month view with the selected date and its events.', w: 600, h: 1304, device: 'phone', label: 'Ticket calendar' },
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
    id: 'profitkey',
    kind: 'Website · Fintech',
    title: 'PROFITKEY',
    note: 'An investment website for beginners. I was the only designer on a team with five developers.',
    shots: [
      { src: '/images/screens-original/profitkey-web-home.webp', alt: 'PROFITKEY home: Finding the key to success, AI recommended stocks, stock rankings, market information and news.', w: 1400, h: 2029, device: 'web', label: 'Home' },
      { src: '/images/screens-original/profitkey-web-detail.webp', alt: 'PROFITKEY stock detail: key indicators, a price chart, an AI comment, financial indicators and analyst opinions.', w: 1400, h: 2349, device: 'web', label: 'Stock detail' },
      { src: '/images/screens-original/profitkey-en-community.webp', alt: 'PROFITKEY community tab with a comment box and threaded comments.', w: 1400, h: 1625, device: 'web', label: 'Community' },
      { src: '/images/screens-original/profitkey-en-news.webp', alt: 'PROFITKEY news page with headline cards and a list of all news.', w: 1400, h: 1378, device: 'web', label: 'News' },
      { src: '/images/screens-original/profitkey-en-watchlist.webp', alt: 'PROFITKEY my watchlist with saved stocks as chart cards.', w: 1400, h: 941, device: 'web', label: 'My watchlist' },
      { src: '/images/screens-original/profitkey-en-notice-list.webp', alt: 'PROFITKEY notices list with an important maintenance notice first.', w: 1400, h: 734, device: 'web', label: 'Notices' },
      { src: '/images/screens-original/profitkey-en-faq.webp', alt: 'PROFITKEY FAQ with questions in an accordion.', w: 1400, h: 1072, device: 'web', label: 'FAQ' },
      { src: '/images/screens-original/profitkey-en-login.webp', alt: 'PROFITKEY login with email and password and social log in buttons.', w: 1400, h: 935, device: 'web', label: 'Login' },
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

function Screen({ s, onOpen }: { s: Shot; onOpen: (s: Shot) => void }) {
  return (
    <figure className={`scr-shot scr-shot--${s.device}`}>
      <button type="button" className="scr-shot__frame" onClick={() => onOpen(s)} aria-label={`${s.label}, see it full size`}>
        <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" />
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
        <img className={`scr-view__img scr-view__img--${s.device}`} src={s.src} alt={s.alt} width={s.w} height={s.h} />
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
