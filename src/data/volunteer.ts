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
      src: '/images/rizsq/rizsq-harvest.webp',
      alt: 'Rizsq banner: a farmer carrying a bundle of rice across a field at sunset, with the Rizsq logo and the line “Every harvest deserves a fair price”.',
      width: 1600,
      height: 900,
    },
    {
      src: '/images/rizsq/rizsq-traditions.webp',
      alt: 'Rizsq post on dark green: women washing in a canal beside a man checking his phone on a dirt road, with the line “Traditions must be side-by-side with technology, not against”.',
      width: 1600,
      height: 900,
    },
    {
      src: '/images/rizsq/rizsq-farmer.webp',
      alt: 'Rizsq post: a woman carrying her sleeping baby on her back while tending young plants in a field, under the Rizsq logo and a yellow wheat motif.',
      width: 1080,
      height: 1080,
    },
  ],
})
