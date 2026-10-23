# Sujin Youn: UI/UX Portfolio

A responsive portfolio built with **React 19, Vite 6, TypeScript and React Router**.
Pages: Home (with the ASCLO photo gallery), About, Case Study (`/work`, filterable by category), four case studies (`/work/lastcow`, `/work/cookpad`, `/work/profitkey`, `/work/open-door-yoga`) and a 404 page. The old `/work/asclo` address redirects to the gallery on Home.

## Run it locally

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev          # http://localhost:5173
```

Other scripts:

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run build`   | Type-checks and builds the production site to `dist/` |
| `npm run preview` | Serves the built `dist/` folder locally               |
| `npm run lint`    | Runs ESLint                                           |
| `npm run images`  | Converts PNGs in `design-exports/` to WebP            |

## Where things live

```
src/
  data/
    site.ts        ← name, slogan, email, LinkedIn, specialties (UX/UI first)
    about.ts       ← About page text, skills, experience, photos, tools
    projects.ts    ← case studies (text, images, colours, categories)
    asclo.ts       ← ASCLO photo-editing gallery shown on Home
  components/      ← SiteHeader (nav), SiteFooter, HeroSection, AboutTeaser, FeaturedWorks,
                     AscloGallery, ProjectCard, CaseStudyLayout, CaseStudySection,
                     CharacterIllustration, HandDrawnDecoration, ContactCTA, …
  pages/           ← HomePage, AboutPage, WorkPage, CaseStudyPage, NotFoundPage
  styles/
    tokens.css     ← colours, fonts, spacing, radii, shadows
    base.css, components.css, home.css, about.css, case-study.css
public/images/projects/   ← optimized project screenshots (WebP)
design-exports/           ← original PNG exports from Figma
```

## Update content

**Placeholders.** Any text written as `"[LIKE THIS]"` renders as a yellow dashed chip so unfinished content is easy to spot. Search the project for `[` inside `src/data/` to find all of them.

**Personal details:** edit `src/data/site.ts`. Social links that are still placeholders show as "to do" chips instead of broken links.

**About page:** edit `src/data/about.ts` (intro, experience, skills, "Outside of work" photos, tools). Photos live in `public/images/about/`, tool icons in `public/images/tools/`.

**Categories:** each project has `disciplines` (`'ux-ui'`, `'graphic'`, `'visual'`). They drive the filter chips on the Case Study page and the hashtags under the homepage hero (`heroTags` in `site.ts`). To add a category, add it to `disciplines` at the top of `projects.ts`.

**Homepage flow:** hero (illustrated character + name, "portfolio", slogan, specialties) → About Me → Featured Works (projects with `featured: true`, shown as folder-tab cards in each project's own colour) → ASCLO — Photo Editing gallery → contact. Every case study also appears on `/work`.

**Specialties:** `specialties` in `site.ts` controls the order and links of the hero/About Me pills. UX/UI Design stays first and is styled as the primary one (`primary: true`).

**ASCLO gallery:** edit `src/data/asclo.ts`. To use higher-resolution originals, drop them into `public/images/projects/` (same names, or update the paths) and set `width`/`height`.

**Navigation:** links live at the top of `src/components/SiteHeader.tsx` (Home, About, Case Study, Contact + LinkedIn). Below 820 px wide they collapse into a menu button.

**Character:** your illustrated character lives at `public/images/character.webp` (background removed). To swap the artwork, replace `design-exports/character-source.webp` and run `node scripts/prepare-character.mjs`. In the hero, the role ("UX/UI Designer", the largest label) and the other specialties float around it as stickers that wiggle on hover.

**About Me (Home):** a two-column section: intro, specialties, background and "How I design" on the left; "Outside of work" as a Polaroid photo collage on the right (`PhotoCollage.tsx`, also used on the About page).

**Your photos:** originals are in `design-exports/about-photos/` (numbered by order). To change them, replace or add files there and run `node scripts/import-about-photos.mjs`. Photos are resized but never cropped. Then update captions and alt text in `outsideOfWork` in `about.ts`. Home shows only the photos listed in `homePhotos`; the About page shows all of them.

**Project slide images** are exported from Figma with "contents only", so text layers that merely overlap a slide on the canvas (like "Personal project / Date / Role") are left out.

**About Me layout:** Text comes from `about.ts` (`intro`, `experience`, `approach`, `outsideOfWork`). Note the names: **Rizsq** is an app; **Samawada** is a charity organization.

**Project covers:** each card's `thumbnail` is the project's first cover frame in Figma: LastCow (134:1493), Cookpad "Overview" (1:2139) and PROFITKEY (1:2513) from the Portfolio file. Open Door Yoga isn't in that file, so it uses "Banner 1" from the Yoga file's "Presentation - Elements" page.

**Case studies:** edit `src/data/projects.ts`. Each project has:

- `title`, `tagline`, `summary`, `category`, `platform`, `role`, `timeline`, `team`, `tools`
- `thumbnail` (homepage card) and `hero` (top of the case study)
- `theme`: the project's **own** brand colours, used for accents on its page only
- `sections`: an ordered list. Each section has blocks of type `text`, `list`, `quotes`, `cards`, `figure`, `gallery`, `swatches` or `placeholder`. Delete a section to hide it, or reorder freely.

The project order on the homepage (and the previous/next links) follows the order of the `projects` array.

## Replace images

1. Export the frame from Figma as PNG (2× is fine).
2. Drop it into `design-exports/` with a lowercase name, e.g. `lastcow-onboarding.png`.
3. Run `npm run images`. This writes `public/images/projects/lastcow-onboarding.webp`.
4. Reference it in `projects.ts` as `/images/projects/lastcow-onboarding.webp` and set `width` / `height` to the output size the script prints (this prevents layout shift).

To swap an existing image, overwrite the file with the same name and re-run the script.

Also replace:

- `public/favicon.svg`: placeholder "SY" mark
- `public/og-image.png`: placeholder social-sharing image (1200×630)

## Change colours and typography

All portfolio tokens are CSS variables in `src/styles/tokens.css`:

- `--c-bg` (cream `#FFF8F1`), `--c-accent` (blue `#789BC4`), `--c-ink`, `--c-ink-soft`, …
- `--c-accent-ink` is a darker blue used for small text so it passes WCAG AA contrast.
- `--c-accent-strong` (`#6F93BD`) is used for the nav pill and the big "portfolio" type: the same blue, a touch deeper so white text on it meets contrast guidelines.
- `--font-sans` (Archivo) and `--font-hand` (Patrick Hand, as in the Figma design). Fonts load from Google Fonts in `index.html`; change the `<link>` there if you switch families.
- `--silk` / `--silk-opacity` control the silk background photo (`public/images/bg-silk.webp`).
- `--paper-bg` / `--paper-bg-opacity` control the paper texture layered over it (`public/images/bg-paper.webp`, made by `scripts/prepare-paper.mjs`).

Project colours are **not** in this file. They stay in each project's `theme` so every case study keeps its original identity.

## Deploy

`npm run build` outputs a static site in `dist/`. Because routes like `/work/lastcow` are client-side, the host must serve `index.html` for unknown paths:

- **Netlify:** handled by `public/_redirects`
- **Vercel:** handled by `vercel.json`
- **Other hosts:** configure an SPA fallback to `index.html`

After deploying, set the absolute URL of `og-image.png` in `index.html` so social previews work.

## Accessibility & motion

Semantic landmarks, a skip link, visible focus styles, alt text on every project image, and decorative doodles hidden from screen readers. Animations (doodles drawing in, the character waving, card lifts) are short, and are turned off when the visitor has **reduced motion** enabled.
