import { AscloGallery } from '../components/AscloGallery'
import { ContactCTA } from '../components/ContactCTA'
import { FeaturedWorks } from '../components/FeaturedWorks'
import { HeroSection } from '../components/HeroSection'
import { VolunteerWork } from '../components/VolunteerWork'
import { site } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

// hero → featured works → volunteer work → ASCLO gallery → contact
export function HomePage() {
  usePageMeta(
    null,
    `${site.name} is a UX/UI designer in ${site.location}. ${site.slogan} Case studies: BCA Website Redesign, Open Door Yoga, PROFITKEY and LastCow.`,
  )

  return (
    <>
      <HeroSection />
      <FeaturedWorks />
      <VolunteerWork />
      <AscloGallery />
      <ContactCTA />
    </>
  )
}
