import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { CharacterIllustration } from './CharacterIllustration'
import { Sparkle, Underline } from './HandDrawnDecoration'
import { SocialLinks } from './SocialLinks'

type Props = {
  /** Show a link back to the projects (used outside the homepage). */
  showProjectsLink?: boolean
  headingLevel?: 'h2' | 'h3'
}

export function ContactCTA({ showProjectsLink = false, headingLevel: H = 'h2' }: Props) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    window.setTimeout(() => setCopied('idle'), 2500)
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container contact__inner">
        <div className="contact__text">
          <p className="hand contact__kicker">say hi!</p>
          <H id="contact-title" className="contact__title">
            Let’s build something{' '}
            <span className="marked">
              useful
              <Underline className="marked__line" draw />
            </span>{' '}
            together.
          </H>
          <p className="contact__lede">
            I’m looking for junior UI/UX and product design roles in Canada. I’d love to hear about your team and the problems
            you’re solving.
          </p>

          <div className="contact__actions">
            <a className="btn btn--accent" href={`mailto:${site.email}`}>
              Email me <span className="arrow" aria-hidden="true">→</span>
            </a>
            <button type="button" className="btn btn--ghost" onClick={copy}>
              Copy email
            </button>
            {showProjectsLink && (
              <Link className="btn btn--ghost" to="/work">
                See projects
              </Link>
            )}
          </div>
          <p className="contact__email">
            <a className="text-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <span className="contact__status" role="status" aria-live="polite">
              {copied === 'ok' && 'Copied!'}
              {copied === 'fail' && 'Couldn’t copy. Please select the address instead.'}
            </span>
          </p>
          <SocialLinks />
        </div>

        <div className="contact__art" aria-hidden="true">
          <Sparkle className="contact__sparkle" />
          <CharacterIllustration />
        </div>
      </div>
    </section>
  )
}
