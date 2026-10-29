// Content for the About page, taken from the "About me" frame in the
// Portfolio Figma file (small typos fixed). Edit freely.

import { glueAll } from './glue'

export const about = glueAll({
  greeting: 'Hi! I’m',

  intro: [
    'I’m a UX/UI designer based in Vancouver, passionate about creating intuitive, user centered digital experiences that bring people and technology together. I enjoy turning complex problems into simple, thoughtful solutions that make everyday interactions easier and more meaningful.',
    'My background in network engineering taught me to think logically and approach complex problems systematically. As I explored UI/UX design, I discovered a new way to combine that technical mindset with creativity and empathy. I’m always curious about how people interact with digital products, and I enjoy finding inspiration in everyday details. I believe the best designs balance clarity and functionality with a little personality.',
  ],

  // Names: Rizsq is an app; Samawada is a charity organization.
  // role and place are optional; previous non design work is summarised as one entry
  experience: [
    { org: 'Cornerstone College', role: 'UX/UI student', place: 'Vancouver', when: '2026.5 to 2026.11' },
    // confirmed by Sujin: volunteers at Samawada doing social media design and UI/UX for the Rizsq app
    { org: 'Samawada charity (Volunteer)', role: 'Social media design & UI/UX for the Rizsq', place: 'Ottawa (remote)', when: '2026.10 to present' },
    { org: 'Network Engineering Experience', place: 'Japan', when: '2019.05 to 2026.03' },
  ] as { org: string; role?: string; place?: string; when: string }[],

  skills: [
    {
      title: 'UI & Product Design',
      items: ['Responsive Web & Mobile Design', 'Design Systems', 'Visual Hierarchy', 'Interaction Design'],
    },
    {
      title: 'UX & Research',
      items: ['User Research', 'Usability Testing', 'Wireframing', 'Information Architecture', 'Prototyping'],
    },
    {
      title: 'Product Design',
      items: ['User Centered Design', 'Journey Mapping', 'Design Thinking', 'UX Problem Solving', 'Feature Prioritization', 'Iterative Design'],
    },
    {
      title: 'Visual Design',
      items: ['Typography', 'Color Theory', 'Visual Communication', 'UI Components', 'Branding', 'Visual Consistency'],
    },
  ],

  // Which photos appear in the smaller collage on Home (by file). The About page shows all.
  homePhotos: ['/images/about/photo-2.webp', '/images/about/photo-7.webp', '/images/about/photo-10.webp', '/images/about/photo-4.webp'],

  // Your own photos for the Polaroid collage (About Me on Home + About page).
  // Files live in /public/images/about/ (full frames, not cropped).
  // Captions are short handwritten labels describing what's in each photo; edit freely.
  outsideOfWork: [
    // About page order, three per row: Qualicum, sunset, drums / cake, lovebird, color swatching / goose, Ribfest, KDD
    { src: '/images/about/photo-2.webp', width: 675, height: 900, caption: 'Qualicum beach', alt: 'Sujin posing on a large driftwood log on a sunny day at Qualicum Beach.' },
    { src: '/images/about/photo-3.webp', width: 675, height: 900, caption: 'Sunset in Vancouver', alt: 'Sujin watching a golden sunset over the water and the Vancouver skyline from a seawall.' },
    { src: '/images/about/photo-4.webp', width: 660, height: 900, caption: 'On the drums', alt: 'Sujin taking a mirror selfie behind a drum kit in an orange rehearsal studio.' },
    { src: '/images/about/photo-7.webp', width: 675, height: 900, caption: 'Cake & coffee', alt: 'A slice of cookies and cream cheesecake with whipped cream next to a takeaway coffee.' },
    { src: '/images/about/photo-10.webp', width: 675, height: 900, caption: 'My lovebird', alt: 'A green lovebird with a peach orange face, tucked in with its eyes closed.' },
    { src: '/images/about/photo-8.webp', width: 675, height: 900, caption: 'Color swatching', alt: 'A collage of red finds around Vancouver: “I love you” candy boxes, Mozartkugeln tins, a candy wall, Canada sweaters, a parking sign and a FIFA banner.' },
    { src: '/images/about/photo-1.webp', width: 900, height: 672, caption: 'With Canadian goose', alt: 'Sujin smiling on a sandy beach in a blue cap, with a hand drawn note "With Canadian goose" pointing to a goose nearby.' },
    { src: '/images/about/photo-6.webp', width: 900, height: 675, caption: 'RIBFEST', alt: 'Pulled pork sandwich, barbecue ribs and corn on the cob on an outdoor table at Ribfest.' },
    { src: '/images/about/photo-9.webp', width: 900, height: 675, caption: 'KDD workshop', alt: 'A projected workshop slide titled “Core Values” listing six values, from continuous self development to aiming for a positive change.' },
  ],

  tools: [
    { name: 'Figma', icon: '/images/tools/figma.svg' },
    { name: 'Photoshop', icon: '/images/tools/photoshop.png' },
    { name: 'Canva', icon: '/images/tools/canva.png' },
    { name: 'Illustrator', icon: '/images/tools/illustrator.png' },
  ],
})
