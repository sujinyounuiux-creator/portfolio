// Personal details shown across the site.
// Any value written as "[LIKE THIS]" renders as a highlighted placeholder,
// so unfinished content is always easy to spot. Replace it with your own copy.

import { glueAll } from './glue'

export type SocialLink = { label: string; url: string }

export const site = glueAll({
  // From the "About me" frame in the Portfolio Figma file.
  name: 'Sujin Youn',
  firstName: 'Sujin',
  role: 'UX/UI Designer',
  location: 'Vancouver, BC',

  // From the "End" frame in the Portfolio Figma file.
  email: 'sop3314@gmail.com',

  linkedin: 'https://www.linkedin.com/in/sujin-youn-58401118b/',

  // Shown in the contact section and footer. Add more profiles here.
  // Entries left as "[PLACEHOLDER]" show as non-clickable "to do" chips.
  socials: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/sujin-youn-58401118b/' }] satisfies SocialLink[],

  // The main claim on Home: one line per sentence, **bold** is the accent colour.
  headline: ['I spent 6 years making technology work.', 'Now I make it **make sense** to people.'],
  // Under the headline on Home.
  slogan: 'I design the connection between people and technology.',

  // "Why work with me" on Home: each strength with its real proof (from the résumé).
  strengths: [
    {
      proof: '6 years',
      proofLabel: 'in network engineering',
      title: 'I speak both engineering and design.',
      body: 'Network operations and troubleshooting at **NTT Data** and **NetOne Systems** in Tokyo taught me to approach complex problems systematically. Now I turn that into products that feel simple.',
      link: { label: 'My background', to: '/about' },
    },
    {
      proof: '1 + 5',
      proofLabel: 'one designer, five engineers',
      title: 'I design through conversation.',
      body: 'On PROFITKEY I was the **only designer** working with 5 engineers, and I **interviewed 10** investment beginners. As an engineer I explained technical solutions to clients. I work in **English, Korean and Japanese**.',
      link: { label: 'See PROFITKEY', to: '/work/profitkey' },
    },
  ],

  // Design specialties, always in this order: UX/UI first (shown as the primary one).
  // Each links to matching work. Graphic Design points to the ASCLO gallery on Home.
  specialties: [
    { label: 'UX/UI Design', href: '/work?category=ux-ui', primary: true },
    { label: 'Graphic Design', href: '/#asclo', primary: false },
    { label: 'Visual Design', href: '/work?category=visual', primary: false },
  ],

  // Hashtags floating around the character on Home (the "UX/UI Designer" and
  // location stickers are separate). They are plain labels, not links.
  // group sets the colour: design (blue), language (coral), it (teal).
  heroTags: [
    { label: 'English', group: 'language' },
    { label: 'Graphic Design', group: 'design' },
    { label: 'Korean', group: 'language' },
    { label: 'Japanese', group: 'language' },
  ] as { label: string; group: 'design' | 'language' | 'it' }[],

  // Optional: path to a résumé PDF in /public (e.g. "/resume.pdf").
  resumeUrl: '/Sujin-Youn-Resume.pdf',
})

export const isPlaceholder = (value: string | undefined | null) =>
  !value || /^\[.*\]$/.test(value.trim())
