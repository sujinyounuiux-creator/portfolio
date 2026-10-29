// Volunteer work shown on the Home page, above the ASCLO gallery.
// Rizsq is an app; Samawada is the charity Sujin volunteers with (see about.ts).
// The work is ongoing: add new designs to `photos` as they are made
// (files in /public/images/rizsq/, full frame, not cropped).

import { glueAll } from './glue'

export const volunteer = glueAll({
  title: 'Rizsq: Social Media Design',
  label: 'Volunteer · in progress',
  summary:
    'I volunteer with Samawada, a charity, where I help create social media posts for Rizsq and work on the app’s UI/UX design. The project is still ongoing, and these are some of the designs I’ve worked on so far.',
  facts: [
    { label: 'When', value: '2026.10 to present' },
    { label: 'Role', value: 'Social media design · UI/UX' },
    { label: 'Tool', value: 'Canva' },
  ],
  photos: [
    {
      src: '/images/rizsq/rizsq-1.webp',
      alt: 'Rizsq banner: a farmer gathering harvested rice in a field, with the Rizsq logo and the line “Every harvest deserves a fair price”.',
      width: 1600,
      height: 900,
    },
    {
      src: '/images/rizsq/rizsq-2.webp',
      alt: 'Rizsq post: a smiling farmer with a hoe in a green field, outlined in green, above the Rizsq logo.',
      width: 1080,
      height: 1350,
    },
  ],
})
