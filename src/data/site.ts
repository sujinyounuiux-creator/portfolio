// Personal details shown across the site.
// Any value written as "[LIKE THIS]" renders as a highlighted placeholder,
// so unfinished content is always easy to spot. Replace it with your own copy.

export type SocialLink = { label: string; url: string }

export const site = {
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

  // Slogan under the "portfolio" heading on Home.
  slogan: 'I design with purpose, for people.',
  // a quieter line under the slogan on Home
  subline: '6 years in network engineering. Now designing better digital experiences.',

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
    { label: '6 YEARS IN NETWORK ENGINEERING', group: 'it' },
    { label: 'Japanese', group: 'language' },
  ] as { label: string; group: 'design' | 'language' | 'it' }[],

  // Optional: path to a résumé PDF in /public (e.g. "/resume.pdf").
  resumeUrl: '[RESUME PDF]',
}

export const isPlaceholder = (value: string | undefined | null) =>
  !value || /^\[.*\]$/.test(value.trim())
