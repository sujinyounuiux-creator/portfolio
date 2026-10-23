import { AboutTeaser } from '../components/AboutTeaser'
import { AscloGallery } from '../components/AscloGallery'
import { ContactCTA } from '../components/ContactCTA'
import { FeaturedWorks } from '../components/FeaturedWorks'
import { HeroSection } from '../components/HeroSection'
import { site } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

// hero → about me → featured works → ASCLO gallery → contact
export function HomePage() {
  usePageMeta(
    null,
    `${site.name} is a UX/UI designer in ${site.location}. ${site.slogan} Case studies: LastCow, Cookpad, PROFITKEY and Open Door Yoga.`,
  )

  return (
    <>
      <HeroSection />
      <AboutTeaser />
      <FeaturedWorks />
      <AscloGallery />
      <ContactCTA />
    </>
  )
}
