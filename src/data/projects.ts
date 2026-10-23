// All case-study content lives here, separate from the layout.
//
// • Text in "[BRACKETS]" renders as a visible placeholder. Replace it with your copy.
// • Images live in /public/images/projects/. Swap a file with one of the same
//   name, or point `src` to a new file (update width/height to avoid layout shift).
// • Every statement below comes from the two Figma files. Nothing was added
//   about research participants, metrics or outcomes.
//
// Section blocks are rendered in order; omit a section to hide it.

export type Figure = {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  /** Very tall page captures are shown in a scrollable frame. */
  tall?: boolean
}

export type Swatch = { name: string; hex: string; usage?: string }

export type Block =
  | { kind: 'text'; body: string[] }
  | { kind: 'list'; intro?: string; items: string[] }
  | { kind: 'quotes'; source: string; items: string[] }
  | { kind: 'cards'; items: { title: string; body: string }[] }
  | { kind: 'figure'; figure: Figure }
  | { kind: 'gallery'; figures: Figure[] }
  | { kind: 'swatches'; swatches: Swatch[]; note?: string }
  /** Real screens shown inside laptop or phone mockups. `tall` screens scroll inside the device. */
  | { kind: 'devices'; device: 'desktop' | 'phone'; screens: Figure[] }
  /** Draggable before/after comparison of an original and a redesigned screen. */
  | { kind: 'compare'; label: string; before: Figure; after: Figure; caption?: string }
  /** Typography specimen rendered as live text. */
  | { kind: 'type'; styles: { name: string; font: string; weight: 400 | 500 | 700; size: number; sample: string }[]; note?: string }
  /** A row of key numbers (only real figures from the project). */
  | { kind: 'stats'; items: { value: string; label: string }[] }
  /** One design decision: a real screen or crop beside the reasoning. */
  | { kind: 'feature'; title: string; tag?: string; body: string[]; figures: Figure[]; reverse?: boolean }
  /** Icon set from the project, grouped, with what each group is for. */
  | { kind: 'icons'; groups: { title: string; note: string; items: { src: string; label: string }[] }[] }
  /** Several draggable comparisons shown side by side inside phones (e.g. wireframe → hi-fi). */
  | { kind: 'compareSet'; labels: [string, string]; items: { label: string; before: Figure; after: Figure }[] }
  /** Click-through prototype: real screens shown one step at a time in a laptop. */
  | { kind: 'walkthrough'; caption?: string; steps: { title: string; note: string; figure: Figure }[] }
  /** Embedded live Figma file, with an optional link to the interactive prototype. */
  | { kind: 'embed'; title: string; src: string; caption?: string; link?: { href: string; label: string }; variant?: 'phone' }
  /** Simple horizontal bar chart of percentages, with its source and what it means. */
  | { kind: 'bars'; title: string; source: string; items: { label: string; value: number }[]; takeaway?: string }
  /** Numbered page structure (e.g. recommended section order), rendered as live text. */
  | { kind: 'outline'; caption?: string; steps: { title: string; note?: string; points: string[] }[] }
  | { kind: 'placeholder'; label: string; hint?: string }

export type Section = {
  id: string
  /** Short label used in the table of contents. */
  label: string
  title: string
  blocks: Block[]
  /** Optional handwritten margin note. */
  note?: string
}

/** Categories used by the Case Study page filters and the homepage hashtags. */
export const disciplines = [
  { id: 'ux-ui', label: 'UX/UI Design' },
  { id: 'graphic', label: 'Graphic Design' },
  { id: 'visual', label: 'Visual Design' },
] as const

export type DisciplineId = (typeof disciplines)[number]['id']

export const disciplineLabel = (id: DisciplineId) => disciplines.find((d) => d.id === id)!.label

/** Where a category tag links to. Graphic design work lives in the ASCLO gallery on Home. */
export const disciplineHref = (id: DisciplineId) => (id === 'graphic' ? '/#asclo' : `/work?category=${id}`)

export type Project = {
  slug: string
  title: string
  disciplines: DisciplineId[]
  /** Shown in Featured Works on the homepage. */
  featured: boolean
  tagline: string
  /** One or two sentences for the project card and page intro. */
  summary: string
  category: string
  platform: string
  role: string
  timeline: string
  team: string
  tools: string[]
  thumbnail: Figure
  hero: Figure
  /** The project's own brand colours: used for the hero band and accents. */
  theme: { accent: string; ink: string; surface: string }
  /** Small handwritten note on the homepage card (optional). */
  cardNote?: string
  sections: Section[]
}

const img = (name: string, alt: string, caption?: string, width = 1600, height = 900): Figure => ({
  src: `/images/projects/${name}.webp`,
  alt,
  caption,
  width,
  height,
})

/** A grayscale low-fi wireframe (SVG, 960 px wide) drawn by scripts/build-profitkey-wireframes.mjs. */
const wire = (name: string, alt: string, caption: string, height: number): Figure => ({
  src: `/images/wireframes/profitkey-${name}.svg`,
  alt,
  caption,
  width: 960,
  height,
})

/** A clean UI export from the Cookpad frames in the Portfolio file (see scripts/prepare-cookpad.mjs). */
const cook = (name: string, alt: string, caption: string | undefined, width: number, height: number): Figure => ({
  src: `/images/cookpad/${name}.webp`,
  alt,
  caption,
  width,
  height,
})

/** A real screen export prepared for a device mockup (see scripts/prepare-screens.mjs). */
const screen = (name: string, alt: string, caption: string, width: number, height: number): Figure => ({
  src: `/images/screens/${name}.webp`,
  alt,
  caption,
  width,
  height,
})

export const projects: Project[] = [
  // ───────────────────────────────────────────── Cookpad
  {
    slug: 'cookpad',
    title: 'Cookpad',
    disciplines: ['ux-ui'],
    featured: true,
    tagline: 'UI/UX improvement project',
    summary:
      'A personal redesign of the Cookpad recipe site focused on better search filters, a simpler UI and a more active community.',
    category: 'Responsive web · Redesign',
    platform: 'Responsive web (desktop & mobile)',
    role: 'UI/UX Design',
    timeline: '2024.11 – 2025.01',
    team: 'Personal project',
    tools: ['Figma'],
    // cover: "Overview" frame (1:2139), the first Cookpad slide in the Portfolio Figma file
    thumbnail: img('cookpad-cover', 'Cookpad UI/UX improvement project cover with the redesigned search page on tablet and mobile.'),
    hero: img('cookpad-cover', 'Cookpad UI/UX improvement project cover with the redesigned search page on tablet and mobile.'),
    theme: { accent: '#FF9934', ink: '#370000', surface: '#FFF1E3' },
    sections: [
      {
        // Sources: the Cookpad frames in the Portfolio Figma file ("Overview", "Research", "Goal",
        // "wireframe", "Design", "UI", "Filter", "Comment", "Main", "List", "Recipe").
        id: 'overview',
        label: 'Overview',
        title: 'The challenge',
        blocks: [
          {
            kind: 'text',
            body: [
              'Cookpad is a recipe-sharing service. Its ratings and reviews were low, its number of users was falling, and competitors were growing. I set out to find out why, and to redesign the experience around what users actually struggled with.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Problem', body: 'Low ratings and reviews, a decrease in users, strong competitors and usability issues raised in feedback.' },
              { title: 'Goal', body: 'A simpler, better experience that keeps existing users, wins new ones and makes the community more active.' },
              { title: 'My role', body: 'A personal project: research, UX strategy, wireframes, visual design and usability testing.' },
            ],
          },
        ],
      },
      {
        // The competitor chart in the Research frame has no units or source, so its numbers are left out.
        id: 'research',
        label: 'Research',
        title: 'Research findings',
        blocks: [
          {
            kind: 'text',
            body: [
              'I reviewed what users said in public ratings and reviews, compared Cookpad with competing recipe services (kurashiru and Delish Kitchen), and looked at how people access the service.',
            ],
          },
          {
            kind: 'quotes',
            source: 'What users said: recurring opinions I gathered from public ratings and reviews',
            items: [
              'Please strengthen the search filter feature',
              'Complex and difficult-to-use UI',
              'Too many restrictions for free members',
              'Lack of community-related features',
            ],
          },
          {
            kind: 'bars',
            title: 'Active users by device',
            source: 'Secondary data recorded in my research slides; the original source was not noted, so it is shown as recorded and not as my own finding.',
            items: [
              { label: 'Mobile web', value: 49 },
              { label: 'Web (desktop)', value: 27 },
              { label: 'App', value: 23 },
            ],
            takeaway:
              'Nearly half of active users reach Cookpad through a smartphone browser, more than through the app. So the redesign had to work as a responsive website, with larger controls that are easy to use on small screens.',
          },
          { kind: 'placeholder', label: '[DATA SOURCE]', hint: 'Add where the device-share figures came from, so they can be cited.' },
        ],
      },
      {
        id: 'insights',
        label: 'Insights',
        title: 'Key insights',
        note: 'search first!',
        blocks: [
          {
            kind: 'cards',
            items: [
              {
                title: 'Search is hard to narrow down',
                body: 'Users asked for stronger search filters. → Filters for cooking time, difficulty, dish type, ingredients and allergies.',
              },
              {
                title: 'The interface feels complex',
                body: 'Reviews called the UI complex, and testing showed navigation friction. → A simpler UI with a clear icon set.',
              },
              {
                title: 'Free members feel restricted',
                body: 'Free members felt limited. → Enhanced free-membership features became one of the planned solutions.',
              },
              {
                title: 'Little sense of community',
                body: 'Users missed community features. → Threaded comments so questions get answered and conversations stay easy to follow.',
              },
            ],
          },
        ],
      },
      {
        id: 'wireframes',
        label: 'Wireframes',
        title: 'Wireframes',
        blocks: [
          {
            kind: 'text',
            body: ['I planned the layout around the user flow: a login modal, then the main page with its search, the search results, and the recipe page.'],
          },
          { kind: 'figure', figure: cook('wireframes', 'Low-fidelity wireframes for the login modal, main page, search page and recipe page.', 'Login modal → main page → search page → recipe page.', 1600, 762) },
        ],
      },
      {
        id: 'visual-language',
        label: 'Visual language',
        title: 'Colour, type & icons',
        blocks: [
          {
            kind: 'text',
            body: [
              'The palette builds on Cookpad’s brand image of friendliness, homely warmth and naturalness. The background is uniformly white, orange and dark red highlight the key areas, and text is dark grey for better readability.',
            ],
          },
          {
            kind: 'swatches',
            swatches: [
              { name: 'Main', hex: '#FF9934', usage: 'Key actions and highlights' },
              { name: 'Sub', hex: '#FFD9B4', usage: 'Soft highlight areas' },
              { name: 'Dark red', hex: '#370000', usage: 'Headings and emphasis' },
              { name: 'Text', hex: '#646464', usage: 'Body text' },
              { name: 'Black', hex: '#000000', usage: 'Strong text' },
              { name: 'Base', hex: '#FFFFFF', usage: 'Background' },
            ],
          },
          {
            // sizes and weights taken from the real Recipe, List and Main frames
            kind: 'type',
            note: 'One typeface, Noto Sans KR, in three weights. Sizes and weights are taken from the real recipe and list pages.',
            styles: [
              { name: 'Recipe title', font: 'Noto Sans KR', weight: 700, size: 40, sample: 'Butter Pancake' },
              { name: 'Section heading', font: 'Noto Sans KR', weight: 700, size: 32, sample: 'Ingredients' },
              { name: 'Author', font: 'Noto Sans KR', weight: 500, size: 32, sample: 'ChefMario' },
              { name: 'Card title', font: 'Noto Sans KR', weight: 700, size: 24, sample: 'Hearty Spaghetti Bolognese' },
              { name: 'Body', font: 'Noto Sans KR', weight: 400, size: 24, sample: 'Flour 180g · Sugar 60 g · Milk 250 ml' },
              { name: 'Meta', font: 'Noto Sans KR', weight: 400, size: 16, sample: 'Newest First · 25 minutes · ChefAnna89' },
            ],
          },
          {
            // icons cut from the "Icon" rows of the Design frame (scripts/prepare-cookpad.mjs)
            kind: 'icons',
            groups: [
              {
                title: 'Recipe actions',
                note: 'In Cookpad orange: the things people do with a recipe.',
                items: [
                  { src: '/images/cookpad/icon-1.png', label: 'Save' },
                  { src: '/images/cookpad/icon-4.png', label: 'Saved' },
                  { src: '/images/cookpad/icon-2.png', label: 'Add' },
                  { src: '/images/cookpad/icon-3.png', label: 'Filter' },
                  { src: '/images/cookpad/icon-5.png', label: 'Premium badge' },
                ],
              },
              {
                title: 'Navigation & tools',
                note: 'The same rounded outline style in neutral grey: menus and page tools.',
                items: [
                  { src: '/images/cookpad/icon-7.png', label: 'Menu' },
                  { src: '/images/cookpad/icon-9.png', label: 'Search' },
                  { src: '/images/cookpad/icon-10.png', label: 'Time' },
                  { src: '/images/cookpad/icon-11.png', label: 'Notifications' },
                  { src: '/images/cookpad/icon-12.png', label: 'Share' },
                  { src: '/images/cookpad/icon-8.png', label: 'Print' },
                ],
              },
            ],
          },
          { kind: 'figure', figure: cook('devices', 'The redesigned Cookpad search page on phone, tablet, laptop and desktop.', 'One responsive layout from phone to desktop, with larger controls on small screens.', 1600, 439) },
        ],
      },
      {
        id: 'decisions',
        label: 'Key decisions',
        title: 'Key design decisions',
        blocks: [
          {
            kind: 'text',
            body: [
              'Usability testing helped me identify navigation challenges and friction points in Cookpad’s features. Based on these insights, I refined the UI and designed custom icons to make the interface more intuitive and easier to navigate.',
            ],
          },
          {
            kind: 'feature',
            tag: 'Insight: search is hard to narrow down',
            title: 'Search filters that match how people cook',
            body: [
              'The filter button sits right in the search bar. It opens filters for cooking time, difficulty, type of dish and allergies alongside the ingredients you type, so people can quickly find the recipes they need.',
            ],
            figures: [
              cook('search-bar', 'Search bar with an ingredients field, a highlighted filter button and an orange Search button.', 'Search bar with the filter button.', 1600, 143),
              cook('filter-panel', 'Filter panel: ingredients, cooking time from within 10 minutes to over an hour, difficulty, type of dish and an allergy field.', 'Filter panel.', 1600, 532),
            ],
          },
          {
            kind: 'feature',
            tag: 'Insight: little sense of community',
            title: 'Threaded comments',
            reverse: true,
            body: [
              'Replies sit under the comment they answer, so a question and its answers stay together. This makes discussions easier to follow and questions more likely to get an answer.',
            ],
            figures: [cook('comments', 'Comment thread: my comment highlighted in peach, with replies from other users nested below and Reply links.', 'Comment thread with replies.', 1400, 672)],
          },
        ],
      },
      {
        id: 'final',
        label: 'Final design',
        title: 'Final interface',
        blocks: [
          {
            kind: 'devices',
            device: 'desktop',
            screens: [
              img('cookpad-main', 'Home page with the ingredient search bar.', 'Home'),
              img('cookpad-list', 'Recipe list sorted by newest or popularity, with cooking times.', 'Recipe list'),
              img('cookpad-recipe', 'Recipe detail for butter pancakes with ingredients and steps.', 'Recipe detail'),
            ],
          },
        ],
      },
      {
        id: 'reflection',
        label: 'Reflection',
        title: 'What I learned & next steps',
        blocks: [
          {
            kind: 'text',
            body: [
              'This project taught me how valuable user research is in guiding design decisions. Moving forward, I want to strengthen my skills in user research, interactive prototyping, and developer handoff to translate user insights into practical, production-ready designs.',
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── LastCow
  // Sources: LastCow frames in the Portfolio Figma file + the team's UX research deck
  // (used as a reference only; its link is intentionally not shown on the site).
  {
    slug: 'lastcow',
    title: 'LastCow',
    disciplines: ['ux-ui'],
    featured: true,
    tagline: 'Last tickets. Best prices.',
    summary:
      'A mobile app concept that helps people aged 18–40 find last-minute and discounted tickets to live events before they sell out.',
    category: 'Mobile app · Event ticketing',
    platform: 'iOS mobile app',
    role: 'UX/UI design · User interviews',
    timeline: '2026.07 – 2026.08',
    team: '2 designers',
    tools: ['Figma'],
    thumbnail: img('lastcow-cover', 'LastCow cover: the cow-and-ticket logo, the tagline "Last tickets. Best prices." and the app splash screen on an iPhone.'),
    hero: img('lastcow-cover', 'LastCow cover: the cow-and-ticket logo, the tagline "Last tickets. Best prices." and the app splash screen on an iPhone.'),
    theme: { accent: '#4B17C1', ink: '#1B1B1B', surface: '#EFE9FB' },
    cardNote: 'newest!',
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        title: 'The challenge',
        note: 'the "too late" problem',
        blocks: [
          {
            kind: 'text',
            body: [
              'Adults aged 18–40 often miss live events because they discover them too late: tickets are sold out, too expensive or hard to plan for. Meanwhile, organisers are left with unsold tickets and empty seats.',
              'LastCow is a ticket-discovery app that surfaces last-minute and discounted tickets and matches events to personal taste.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Team', body: 'Two designers working together in Figma, on research, wireframes, UI design and prototyping.' },
              { title: 'My focus', body: 'I conducted the user interviews.' },
              { title: 'My teammate’s focus', body: 'My teammate conducted the usability testing.' },
            ],
          },
        ],
      },
      {
        id: 'research',
        label: 'Research',
        title: 'User research',
        blocks: [
          {
            kind: 'text',
            body: [
              'Goal: understand why people who enjoy live entertainment miss out on events, and where the discovery process breaks down. I interviewed four people to learn their needs and motivations.',
            ],
          },
          {
            kind: 'quotes',
            source: 'User interviews (four participants), conducted by me',
            items: [
              'There are a lot of events, but they’re all on different platforms. Sometimes it takes a lot of searching to find something I actually like.',
              'I found an event I really wanted to go to, but by the time I checked, the tickets were either sold out or too expensive. If there was a cheaper last-minute ticket, I’d probably go.',
              'I usually check Instagram first. I follow pages that post about local events, cafés, and things happening around the city.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Discovered too late', body: 'Events are often found after tickets sell out or prices rise.' },
              { title: 'No way to track deals', body: 'People want last-minute or discounted tickets but can’t track availability.' },
              { title: 'Scattered and generic', body: 'Event information is spread across platforms, and listings aren’t matched to personal taste.' },
            ],
          },
          {
            // "Persona" slide (40:188) in the revised UX research slides, cropped to the card
            kind: 'figure',
            figure: img(
              'lastcow-persona',
              'Persona card for Steven Karney, 32, male, a graphic designer in Vancouver, BC. Profile: enjoys local music shows, live events and the outdoors, but often struggles to discover events early enough. Goals: discover interesting local events and live music, find events that match his interests, find affordable ways to attend. Frustrations: events are spread across many platforms, he often discovers them too late, and last-minute tickets are hard to find. Quote: “I’m always looking for something interesting to do, but I don’t want to spend an hour searching through five different websites.”',
              'Persona: Steven Karney, built from the interview findings.',
              1600,
              645,
            ),
          },
        ],
      },
      {
        id: 'decisions',
        label: 'Key decisions',
        title: 'Design challenges & solutions',
        blocks: [
          {
            kind: 'cards',
            items: [
              {
                title: 'Hard to discover similar events',
                body: 'A “You Might Also Like” section on the event page, so people can move straight to related events instead of searching again.',
              },
              {
                title: 'Upcoming events are easy to forget',
                body: 'Upcoming and registered events appear directly in the in-app calendar, so plans stay visible in one place.',
              },
            ],
          },
        ],
      },
      {
        id: 'wireframes',
        label: 'Wireframes → hi-fi',
        title: 'From wireframes to hi-fi screens',
        note: 'drag to compare',
        blocks: [
          {
            kind: 'text',
            body: ['Each pair is the same screen from the LastCow design file. Drag the handle (or use the arrow keys) to move between the wireframe and the final design.'],
          },
          {
            // pairs exported from the "Wireframe" and "Phone Final UI" sections of the LastCow design file
            kind: 'compareSet',
            labels: ['Wireframe', 'Hi-fi'],
            items: [
              {
                label: 'Home',
                before: screen('lastcow-home-wire', 'Home wireframe: location, search bar and grey placeholder event cards.', 'Home wireframe', 600, 1304),
                after: screen('lastcow-home-hifi', 'Home hi-fi: event cards for Tame Impala and The Strokes with prices and 24-hour price changes.', 'Home hi-fi', 600, 1304),
              },
              {
                label: 'Event details',
                before: screen('lastcow-event-wire', 'Event details wireframe: image placeholder, title, overview, location and a Get Tickets bar.', 'Event details wireframe', 600, 1304),
                after: screen('lastcow-event-hifi', 'Event details hi-fi: concert photo, host with a Follow button, overview, location and a Get Tickets bar.', 'Event details hi-fi', 600, 1304),
              },
              {
                label: 'Saved events',
                before: screen('lastcow-saved-wire', 'Saved events wireframe: a list of placeholder event cards with filled hearts.', 'Saved events wireframe', 600, 1304),
                after: screen('lastcow-saved-hifi', 'Saved events hi-fi: saved Tame Impala and birthday events with prices.', 'Saved events hi-fi', 600, 1304),
              },
              {
                label: 'Ticket calendar',
                before: screen('lastcow-calendar-wire', 'Calendar wireframe: upcoming and past events tabs above a monthly ticket calendar.', 'Calendar wireframe', 600, 1304),
                after: screen('lastcow-calendar-hifi', 'Calendar hi-fi: the monthly ticket calendar with the selected date and its events.', 'Calendar hi-fi', 600, 1304),
              },
            ],
          },
        ],
      },
      {
        id: 'ui-kit',
        label: 'UI kit',
        title: 'UI kit',
        blocks: [
          {
            kind: 'text',
            body: [
              'We built the screens from a component library organised with Atomic Design: atoms such as inputs, icons and controls, combined into molecules such as buttons, menus, the location drop-down and event detail blocks.',
            ],
          },
          {
            // the Atoms and Molecules sections of the design file's Components page
            kind: 'gallery',
            figures: [
              img('lastcow-atoms', 'Atoms: input field states, the logo, the icon set and carousel and filter controls.', 'Atoms: inputs, logo, icons and controls.', 1368, 1055),
              img('lastcow-molecules', 'Molecules: input field states, location drop-down menu, tab bar menus, buttons in four styles and three sizes, list rows, profile card and event detail blocks.', 'Molecules: buttons, menus, drop-down and event details.', 1600, 908),
            ],
          },
        ],
      },
      {
        id: 'final',
        label: 'Prototype',
        title: 'Final screens & prototype',
        blocks: [
          {
            kind: 'devices',
            device: 'phone',
            screens: [
              screen('lastcow-phone-home', 'LastCow home screen: Vancouver location, search bar and event cards for the Vancouver Bird Celebration and The Strokes with prices and 24-hour price changes.', 'Home: events near you', 600, 1303),
              screen('lastcow-phone-event', 'LastCow event details screen: event photo, title, venue, host with a Follow button, overview, location and a Get Tickets bar.', 'Event details', 600, 1305),
            ],
          },
          {
            // Sujin's Figma prototype (node 632:2106), embedded with Figma's prototype embed URL
            kind: 'embed',
            title: 'LastCow interactive prototype (Figma)',
            caption: 'Interactive prototype: click or tap inside the phone to move through the app.',
            src: 'https://embed.figma.com/proto/W31BDdO58GhHsFuggHq4iK/LastCow---Design?node-id=632-2106&starting-point-node-id=632-2106&scaling=scale-down&content-scaling=fixed&embed-host=share',
            variant: 'phone',
          },
        ],
      },
      {
        id: 'testing',
        label: 'Usability testing',
        title: 'Usability testing & results',
        blocks: [
          {
            kind: 'list',
            intro: 'My teammate ran task-based usability tests followed by the System Usability Scale (SUS). The tasks:',
            items: [
              'Buy a ticket to an event.',
              'You have already purchased two tickets for an event. Where would you check for your tickets?',
              'Change your interests.',
              'Check your past events.',
            ],
          },
          {
            kind: 'stats',
            items: [
              { value: '92.5', label: 'Average SUS score' },
              { value: '4', label: 'Participants' },
              { value: '87.5–100', label: 'Range of individual scores' },
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'What worked', body: 'Users found the app easy to learn and navigate, and most expected to find their ticket information on their profile.' },
              { title: 'What to improve', body: 'Some found the flow between past and upcoming events in the calendar confusing, so those screens needed simplifying.' },
            ],
          },
        ],
      },
      {
        id: 'reflection',
        label: 'Reflection',
        title: 'Reflection & next steps',
        blocks: [
          {
            kind: 'text',
            body: [
              'UX research helped us uncover real user needs and revealed problems we might not have noticed ourselves. Users had different expectations, so we compared their feedback to identify common patterns.',
            ],
          },
          {
            kind: 'list',
            intro: 'Next steps:',
            items: [
              'Run another round of usability testing and refine the flows, starting with the calendar’s past and upcoming events.',
              'Consolidate event discovery in one place, since users currently piece it together from Instagram, Eventbrite and word of mouth.',
            ],
          },
        ],
      },
    ],
  },
  // ───────────────────────────────────────────── PROFITKEY
  {
    slug: 'profitkey',
    title: 'PROFITKEY',
    disciplines: ['ux-ui'],
    featured: true,
    tagline: 'Finding the key to investment success',
    summary:
      'A beginner-friendly investment website with AI stock recommendations and plain-language explanations of financial terms.',
    category: 'Responsive web · Fintech',
    platform: 'Desktop web',
    role: 'Design 100%, Planning 70%',
    timeline: '2025.01 – 2025.03',
    team: '6 people: 5 front-end/back-end engineers and 1 designer (me)',
    tools: ['Figma'],
    thumbnail: img('profitkey-cover', 'PROFITKEY home page and stock analysis page with an AI comment panel.'),
    hero: img('profitkey-cover', 'PROFITKEY home page and stock analysis page with an AI comment panel.'),
    theme: { accent: '#FFB400', ink: '#333333', surface: '#FFF6DE' },
    cardNote: 'sole designer',
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        title: 'The challenge',
        note: 'beginners first',
        blocks: [
          {
            kind: 'text',
            body: [
              'PROFITKEY lets people view domestic and international stocks and financial news at a glance. Our concept: a beginner-friendly investment website, supported by AI.',
            ],
          },
          {
            kind: 'stats',
            items: [
              { value: '1 of 6', label: 'The only designer on a team of six' },
              { value: '100%', label: 'Of the design work' },
              { value: '70%', label: 'Of the planning' },
              { value: '10', label: 'Investment beginners interviewed' },
            ],
          },
        ],
      },
      {
        id: 'research',
        label: 'Research',
        title: 'What beginners told us',
        blocks: [
          {
            kind: 'text',
            body: ['We interviewed 10 investment beginners about their current concerns and difficulties. Common themes:'],
          },
          {
            kind: 'quotes',
            source: 'Interviews with 10 investment beginners (paraphrased in the source file)',
            items: [
              'I am interested in investing, but I don’t know where to start.',
              'Securities websites were difficult to understand because of all the technical terms.',
              'I am afraid of risk and anxious about how to make a decision.',
            ],
          },
        ],
      },
      {
        id: 'wireframes',
        label: 'Wireframes',
        title: 'Wireframes',
        blocks: [
          {
            kind: 'text',
            body: ['Low-fidelity wireframes set the layout and hierarchy for each page before any visual design: what comes first, how stocks and news are grouped, and where AI comments and the community sit.'],
          },
          {
            // redrawn from the original wireframe slide by scripts/build-profitkey-wireframes.mjs
            kind: 'gallery',
            figures: [
              wire('main', 'Main page wireframe: title and sub text, AI recommended stocks with a chart, soaring, domestic/overseas and market-trend stock lists, and a news row.', 'Main', 1120),
              wire('stock-analysis', 'Stock analysis wireframe: item name and price, Stock analysis / Community tabs, indicator rows beside a price chart, an AI comment box and financial indicators.', 'Stock analysis', 800),
              wire('community', 'Stock community wireframe: comment box with a Post button and a list of comments with avatars and reactions.', 'Stock community', 840),
              wire('notice-faq', 'Notice / FAQ wireframe: Notice and FAQ tabs above a list of posts with pagination.', 'Notice / FAQ', 800),
              wire('my-page', 'My page wireframe: tabs for my interests, comments I wrote and edit member info; avatar and nickname beside four watchlist charts.', 'My page: my interests', 720),
              wire('my-comments', 'My page wireframe, comments tab: a dated list of comments the member wrote, with pagination.', 'My page: comments I wrote', 760),
              wire('news', 'News wireframe: a row of latest news cards with title and source, then an all-news list with pagination.', 'News', 840),
            ],
          },
        ],
      },
      {
        // each feature shown with a crop of the real page (scripts/crop-profitkey-features.mjs)
        id: 'features',
        label: 'Key features',
        title: 'Key design decisions',
        blocks: [
          {
            kind: 'feature',
            tag: '“I don’t know where to start.”',
            title: 'AI stock recommendations',
            body: [
              'The home page opens with AI-recommended stocks. Stocks expected to rise are suggested from data such as stability, growth rate, profitability and financial health, along with the reason for each recommendation, giving beginners a clear place to start.',
            ],
            figures: [screen('profitkey-crop-ai-picks', 'AI Recommended Stocks card: Apple, +20%, $28 usd, a price chart, key figures and an AI comment explaining the pick.', 'AI Recommended Stocks on the home page.', 500, 595)],
          },
          {
            kind: 'feature',
            tag: '“Too many technical terms.”',
            title: 'An AI comment on every stock',
            reverse: true,
            body: [
              'Each stock page summarises growth, profitability, stability and financial soundness in plain sentences, next to the detailed figures.',
            ],
            figures: [screen('profitkey-crop-ai-comment', 'AI Comment panel summarising growth, profitability, stability and financial soundness in four plain sentences.', 'AI Comment on the stock detail page.', 1220, 290)],
          },
          {
            kind: 'feature',
            tag: '“Too many technical terms.”',
            title: 'Glossary tooltips',
            body: [
              'Terms such as PER, PBR, EPS and dividends carry a “?” mark. Hovering shows a short explanation, making unfamiliar terms easier for beginners.',
            ],
            figures: [screen('profitkey-crop-glossary', 'Key indicator table: 52-week high and low, PER, PBR, EPS, BPS and dividends, with “?” marks beside the financial terms.', 'Indicators with “?” glossary marks.', 600, 340)],
          },
        ],
      },
      {
        id: 'design',
        label: 'Final design',
        title: 'Final design',
        blocks: [
          {
            kind: 'swatches',
            note: 'Sampled from the final screens. The source file has no documented palette.',
            swatches: [
              { name: 'Key yellow', hex: '#FFB400', usage: 'Logo, highlights' },
              { name: 'Rise', hex: '#D9001B', usage: 'Price up' },
              { name: 'Fall', hex: '#0074D9', usage: 'Price down' },
              { name: 'Ink', hex: '#333333', usage: 'Text' },
            ],
          },
          {
            // screens: the English Home and Stock detail frames, plus the complete Korean screens
            // from the "Outview" slide (straightened by scripts/prepare-profitkey-outview.mjs)
            kind: 'walkthrough',
            caption: 'Click through the website screens. Each scrolls inside the laptop; click a screen to enlarge it. Notices, FAQ and profile screens are the Korean UI.',
            steps: [
              {
                title: 'Home',
                note: 'AI recommended stocks, soaring stocks, main market information and PROFITKEY News.',
                figure: { ...screen('profitkey-web-home', 'PROFITKEY home page: AI recommended stocks, soaring stocks, main market information and PROFITKEY News.', 'Home', 1400, 2029), tall: true },
              },
              {
                title: 'Stock detail',
                note: 'Price chart, key indicators with “?” glossary tooltips, the AI comment, quarterly financials and investment-firm opinions.',
                figure: { ...screen('profitkey-web-detail', 'PROFITKEY stock detail page: price chart, key indicators, AI comment, quarterly financial indicators and investment-firm opinions.', 'Stock detail with AI comment', 1400, 2349), tall: true },
              },
              {
                title: 'Notices',
                note: 'Service notices from the operations team.',
                figure: { ...screen('profitkey-ov-notice', 'PROFITKEY notices page (Korean): a service maintenance notice with date and author.', 'Notices', 1400, 777), tall: true },
              },
              {
                title: 'FAQ',
                note: 'Frequently asked questions in an accordion, with a 1:1 inquiry button.',
                figure: { ...screen('profitkey-ov-faq', 'PROFITKEY FAQ page (Korean): questions in an expandable accordion with a 1:1 inquiry button.', 'FAQ', 1400, 1073), tall: true },
              },
              {
                title: 'Edit profile',
                note: 'Members can change their nickname and email address.',
                figure: { ...screen('profitkey-ov-edit-profile', 'PROFITKEY edit profile page (Korean): nickname change and email address fields beside the member menu.', 'Edit profile', 1400, 755), tall: true },
              },
            ],
          },
        ],
      },
      {
        id: 'reflection',
        label: 'Reflection',
        title: 'Project review',
        blocks: [
          {
            kind: 'cards',
            items: [
              {
                title: 'What I learned',
                body: 'To deepen my user research skills and improve team efficiency, I applied usability testing and brought modern design tools into our workflow, aiming for practical, user-centered designs and smoother collaboration.',
              },
              {
                title: 'What I want to learn next',
                body: 'I want to further develop my design skills and strengthen my understanding of UX research, so I can make more informed design decisions based on user needs.',
              },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── Open Door Yoga
  {
    slug: 'open-door-yoga',
    title: 'Open Door Yoga',
    disciplines: ['ux-ui', 'visual'],
    featured: true,
    tagline: 'A calmer, clearer website for an East Vancouver yoga studio',
    summary:
      'A team redesign of the Open Door Yoga website: class styles, teacher training and pass pricing, on desktop and mobile.',
    category: 'Responsive web · Redesign',
    platform: 'Desktop & mobile web',
    role: 'UX/UI Design',
    timeline: '2026.08 – 2026.09',
    team: 'Group project, 3 designers',
    tools: ['Figma', 'html.to.design'],
    // cover: "Banner 1" (452:777) on the "Presentation - Elements" page of the Open Door Yoga Figma file
    // (this project is not in the Portfolio file)
    thumbnail: img('yoga-cover', 'Laptop on a wooden chair showing the redesigned Open Door Yoga home page with large "YOGA" lettering.', undefined, 1600, 939),
    // hero: the first slide of the Open Door Yoga presentation (Figma Slides, slide 1:42)
    hero: img('yoga-hero', 'Open Door Yoga logo beside a laptop on a wooden chair showing the redesigned home page with large "YOGA" lettering.', undefined, 1600, 900),
    theme: { accent: '#6A4E77', ink: '#2E2E2E', surface: '#F0EDF1' },
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        title: 'The challenge',
        blocks: [
          {
            kind: 'text',
            body: [
              'Open Door Yoga is a studio at Main & 14th in East Vancouver offering hatha, vinyasa, yin and prenatal classes. For this class brief, our group redesigned the website’s home, pricing, teacher-training and about pages, starting from a usability review of the existing site.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Team', body: 'Three designers. We worked on every stage together, from the heuristic evaluation to the style guide, components and final pages.' },
              { title: 'My focus', body: 'I mainly designed the About and Pricing pages.' },
              { title: 'Target user', body: 'First-time yoga students in Vancouver looking for an in-studio class.' },
            ],
          },
        ],
      },
      {
        id: 'heuristic-evaluation',
        label: 'Heuristic evaluation',
        title: 'Heuristic evaluation of the existing site',
        note: 'Nielsen’s 10 heuristics',
        blocks: [
          {
            kind: 'text',
            body: [
              'We imported the live opendooryoga.bc.ca pages into Figma (with html.to.design) and reviewed them with Nielsen’s 10 usability heuristics, walking through three key tasks a first-time student would try.',
            ],
          },
          {
            kind: 'stats',
            items: [
              { value: '10', label: 'Nielsen heuristics' },
              { value: '3', label: 'Key tasks evaluated' },
              { value: '7', label: 'Existing pages audited' },
            ],
          },
          {
            kind: 'list',
            intro: 'We evaluated three key tasks:',
            items: [
              'Find a beginner-friendly yoga class and its schedule. Can you understand the types, levels, dates and locations?',
              'Compare the introductory pass options and decide which one to purchase. Are the price, duration, target audience and next steps clear?',
              'Find the studio location, entry instructions and what to know before attending. Are the address, entrance, contact information and what to bring easy to find?',
            ],
          },
          { kind: 'figure', figure: img('yoga-audit-board', 'Audit board: the existing site’s Homepage, About, Schedule, Teacher Training, Passes, Workshops and Contact pages, with the three evaluation tasks mapped onto them.', 'The existing site’s pages mapped to the three evaluation tasks.', 1600, 753) },
        ],
      },
      {
        id: 'issues',
        label: 'Usability issues',
        title: 'Usability issues & design recommendations',
        blocks: [
          {
            kind: 'cards',
            items: [
              {
                title: 'Issue: price is hard to find',
                body: 'On the Teacher Training page, readers had to scroll halfway down to find the tuition. Recommendation: show the total tuition (or “Tuition from $X”) at the top, and make tuition & payment a main section with deposit, installment plan, what’s included and the refund policy.',
              },
              {
                title: 'Issue: long text, unclear benefits',
                body: 'Lengthy vision text hid what the program offers. Recommendation: lead with three clear benefits, and present the curriculum as five cards or accordions with total hours and brief outcomes.',
              },
              {
                title: 'Issue: schedule is hard to scan',
                body: 'The time commitment wasn’t clear at a glance. Recommendation: keep the schedule on the same page but turn it into an easy-to-scan table or timeline (weekend intensive, weekly practice, practicum).',
              },
              {
                title: 'Issue: dense, hard-to-read sections',
                body: 'Three-column long testimonials and full faculty bios were difficult to read, especially on mobile. Recommendation: keep 2–3 concise quotes, use photo cards with one sentence per teacher, and keep the FAQ as an accordion at the bottom.',
              },
            ],
          },
          {
            // transcribed from the team's written recommendations (Figma)
            kind: 'outline',
            caption: 'Our recommended structure for the Teacher Training page.',
            steps: [
              {
                title: 'Hero / At a glance',
                points: [
                  '200-hour Hatha Teacher Training',
                  'Next start date | Vancouver | Format | Total tuition',
                  'Apply now, Attend an info session',
                  'The price should be clearly displayed here, or at least “Tuition from $X,” so that readers don’t have to scroll halfway through the page to find it.',
                ],
              },
              { title: 'Why this program', points: ['3 clear benefits, avoid lengthy vision text'] },
              {
                title: 'What you’ll learn',
                points: ['5 curriculum cards/accordions', 'Present them using total hours and brief results'],
              },
              {
                title: 'Training schedule',
                points: [
                  'Keep it on the same page, but change it to an easy-to-scan table or timeline',
                  'For example: Weekend intensive / Weekly practice / Practicum, making the time commitment clear at a glance',
                ],
              },
              {
                title: 'Tuition & payment',
                note: 'Make it a main section of the page',
                points: ['Total tuition', 'Deposit', 'Installment plan', 'What’s included', 'Refund/withdrawal policy link'],
              },
              {
                title: 'Meet the faculty',
                points: [
                  'Keep three photo cards + name, role, and one sentence about expertise',
                  'Detailed bio leads to a drawer/individual profile; don’t cram the entire resume onto this page',
                ],
              },
              {
                title: 'Student testimonials',
                points: [
                  'Keep 2–3 concise quotes, including name and graduation year',
                  'Avoid three-column long texts, especially difficult to read on mobile devices',
                ],
              },
              {
                title: 'FAQ',
                points: [
                  'Keep it at the bottom; the accordion is reasonable',
                  'Most frequently asked questions: qualifications, attendance, make-up classes, payment, certificates, cancellation rules',
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'wireframes',
        label: 'Wireframes',
        title: 'Wireframes',
        blocks: [
          {
            kind: 'figure',
            figure: { ...img('yoga-wireframe-home', 'Home page wireframe: hero, class styles, about and team sections.', 'Home page wireframe.', 1179, 2400), tall: true },
          },
        ],
      },
      {
        id: 'design-system',
        label: 'Style guide',
        title: 'Style guide & components',
        note: 'checked for AAA',
        blocks: [
          {
            kind: 'text',
            body: [
              'Each colour has light, normal and dark steps, with interaction states and contrast ratings documented. Headings use Cinzel and body text uses Nunito.',
            ],
          },
          {
            kind: 'swatches',
            swatches: [
              { name: 'Violet light', hex: '#F0EDF1', usage: 'Backgrounds' },
              { name: 'Violet', hex: '#6A4E77', usage: 'Primary' },
              { name: 'Violet darker', hex: '#251B2A', usage: 'Headings' },
              { name: 'Green', hex: '#B2C95D', usage: 'Secondary' },
              { name: 'Green dark', hex: '#869746', usage: 'Buttons' },
              { name: 'Grey', hex: '#2E2E2E', usage: 'Text' },
            ],
          },
          {
            // the project's text styles, rendered live in their own fonts
            kind: 'type',
            styles: [
              { name: 'H1', font: 'Cinzel', weight: 700, size: 128, sample: 'Yoga' },
              { name: 'H2', font: 'Cinzel', weight: 700, size: 96, sample: 'Our Team' },
              { name: 'H3', font: 'Cinzel', weight: 700, size: 36, sample: 'Passes & Pricing' },
              { name: 'H4', font: 'Cinzel', weight: 700, size: 24, sample: 'Hatha Yoga' },
              { name: 'Body 1', font: 'Nunito', weight: 700, size: 36, sample: 'First time student' },
              { name: 'Body 2', font: 'Nunito', weight: 400, size: 24, sample: 'Find the yoga pass that best fits your practice.' },
              { name: 'Body 3', font: 'Nunito', weight: 400, size: 20, sample: 'Geared for beginners with many variations given.' },
              { name: 'Label', font: 'Nunito', weight: 400, size: 16, sample: '200-2940 Main St (enter on 14th)' },
            ],
          },
          {
            kind: 'list',
            intro: 'Reusable components built from the style guide (Atomic Design: atoms, molecules, templates):',
            items: [
              'Pass and pricing cards, with a highlighted “Good Deal” variant',
              'Class style cards and teacher profile cards',
              'Schedule items and curriculum accordions',
              'Header and footer variants for desktop and mobile',
              'Gift card and call-to-action buttons',
            ],
          },
          { kind: 'figure', figure: img('yoga-components', 'Component sheet: pricing cards, gift card, class style cards, teacher cards, schedule items, curriculum accordion, headers and footers.', 'Molecules from the component library.', 1600, 939) },
        ],
      },
      {
        id: 'before-after',
        label: 'Before & after',
        title: 'My pages: before & after',
        note: 'drag to compare',
        blocks: [
          {
            kind: 'text',
            body: ['The original site (before) and our redesign (after) for the two pages I mainly designed, About and Pricing. Drag the handle, or use the arrow keys, to compare.'],
          },
          {
            kind: 'compare',
            label: 'Pricing page',
            caption: 'Pricing: original site vs redesign',
            before: screen('yoga-pricing-before', 'Original Open Door Yoga passes and pricing page: purple header with small navigation and a green first-time student section.', 'Pricing, before', 1600, 1000),
            after: screen('yoga-pricing-after', 'Redesigned Passes & Pricing page: lilac hero with a large serif title, a short introduction and a calm photo background.', 'Pricing, after', 1600, 1000),
          },
          {
            kind: 'compare',
            label: 'About page',
            caption: 'About: original site vs redesign',
            before: screen('yoga-about-before', 'Original Open Door Yoga about page: photo header with a promotion banner and a long block of centred text below.', 'About, before', 1600, 1000),
            after: screen('yoga-about-after', 'Redesigned About page: full-width photo hero with the large serif title “Welcome to Open Door Yoga!”.', 'About, after', 1600, 1000),
          },
        ],
      },
      {
        id: 'final',
        label: 'Final design',
        title: 'Final pages',
        blocks: [
          {
            kind: 'devices',
            device: 'desktop',
            screens: [
              { ...img('yoga-home', 'Final home page: hero, class style cards, about us and the teacher team.', 'Home', 1075, 2400), tall: true },
              { ...img('yoga-pricing', 'Final pricing page with first-time student offer, pass cards and gift section.', 'Pricing', 1114, 2400), tall: true },
              { ...img('yoga-training', 'Teacher training page with program details, video and a curriculum timeline.', 'Teacher training', 766, 2400), tall: true },
              { ...img('yoga-about', 'About page with program promotion, vision and free month program.', 'About', 1046, 2400), tall: true },
            ],
          },
        ],
      },
      {
        id: 'reflection',
        label: 'Reflection',
        title: 'Testing & reflection',
        blocks: [
          {
            kind: 'cards',
            items: [
              {
                title: 'Testing & Feedback',
                body: 'Feedback highlighted inconsistencies in the use of imagery and visual styles across different pages of the website. This showed that even well-designed individual sections can feel disconnected when they don’t follow a consistent visual direction.',
              },
              {
                title: 'What I Learned',
                body: 'This project taught me the importance of research before jumping into design. Through heuristic evaluation, I learned to identify usability issues and use them to guide design decisions rather than relying only on visual preferences. I also gained a better understanding of how consistent imagery, typography, and UI components contribute to a cohesive user experience. Moving forward, I want to strengthen my research process and use evidence to create more thoughtful, user-centered designs.',
              },
            ],
          },
        ],
      },
    ],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

export const getNeighbours = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  const n = projects.length
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] }
}
