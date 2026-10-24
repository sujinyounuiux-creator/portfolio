// ASCLO photo editing gallery, shown on the Home page after Featured Works.
// Original edited photos from the Portfolio Figma file ("ASCLO" frame).
// Replace the files in /public/images/projects/ with higher resolution
// originals any time; keep the names or update the paths below.

export const asclo = {
  title: 'ASCLO: Photo Editing',
  label: 'Side job',
  // what the work was, in one line (from Sujin)
  summary:
    'I edited product photos for ASCLO, a Korean online shopping mall, for its listings on BUYMA, a Japanese shopping site. I also translated the Korean product descriptions into Japanese and checked them.',
  facts: [
    { label: 'When', value: '2024.06 to 2024.11' },
    { label: 'What I did', value: 'Photo editing · Korean to Japanese translation' },
    { label: 'Tool', value: 'Adobe Photoshop' },
    { label: 'Where it ran', value: 'BUYMA (Japan)' },
  ],
  photos: [
    { src: '/images/projects/asclo-1.webp', alt: 'Model in a brown sweatshirt and wide trousers standing on grass, with the ASCLO logo.' },
    { src: '/images/projects/asclo-2.webp', alt: 'Model in a shearling jacket sitting on steps in warm evening light, with the ASCLO logo.' },
    { src: '/images/projects/asclo-3.webp', alt: 'Model wrapped in a blue checked scarf in a hotel lobby, with the ASCLO logo.' },
    { src: '/images/projects/asclo-4.webp', alt: 'Model in a black jacket sitting on a riverside wall, with the ASCLO logo.' },
  ],
  width: 428,
  height: 428,
}
