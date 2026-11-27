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
    id: 'rizsq',
    kind: 'Social graphics',
    title: 'Rizsq',
    note: 'Social media posts for a farming app, made as a volunteer.',
    shots: [
      { src: '/images/rizsq/rizsq-communities.webp', alt: 'Rizsq post “Growing Food, Growing Communities” above a photo of women planting rice.', w: 1080, h: 1350, device: 'post', label: 'Post' },
      { src: '/images/rizsq/rizsq-growing.webp', alt: 'Rizsq post “Growing Together, Feeding the Future.” with farmers planting rice seedlings.', w: 1080, h: 1350, device: 'post', label: 'Post' },
      { src: '/images/rizsq/rizsq-farmer.webp', alt: 'Rizsq post: a woman carrying her baby while tending young plants.', w: 1080, h: 1080, device: 'post', label: 'Post' },
    ],
  },
]

function Screen({ s }: { s: Shot }) {
  return (
    <figure className={`scr-shot scr-shot--${s.device}`}>
      <a className="scr-shot__frame" href={s.src} target="_blank" rel="noreferrer" aria-label={`${s.label}, open full size in a new tab`}>
        <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" />
      </a>
      <figcaption>{s.label}</figcaption>
    </figure>
  )
}

export function ScreensPage() {
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
              <Screen key={s.src + i} s={s} />
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
    </div>
  )
}
