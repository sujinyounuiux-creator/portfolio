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
  /** A small card (end of case studies): heading and email actions only, no illustration. */
  card?: boolean
}

export function ContactCTA({ showProjectsLink = false, headingLevel: H = 'h2', card = false }: Props) {
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

  const actions = (
    <>
      <div className="contact__actions">
        {/* the main action: dark with white text, like the "UX/UI Designer" label */}
        <a className="btn contact__email-btn" href={`mailto:${site.email}`}>
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
    </>
  )

  if (card) {
    return (
      <section id="contact" className="contact-card" aria-labelledby="contact-title">
        <div className="contact-card__text">
          <p className="hand contact__kicker">say hi!</p>
          <H id="contact-title" className="contact-card__title">
            Let’s make a{' '}
            <span className="marked">
              connection,
              <Underline className="marked__line" />
            </span>{' '}
            not just a network.
          </H>
        </div>
        <div className="contact-card__actions">{actions}</div>
      </section>
    )
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container contact__inner">
        <div className="contact__text">
          <p className="hand contact__kicker">say hi!</p>
          <H id="contact-title" className="contact__title">
            <span className="contact__line">
              Let’s make a{' '}
              <span className="marked">
                connection,
                <Underline className="marked__line" draw />
              </span>
            </span>{' '}
            <span className="contact__line">not just a network.</span>
          </H>
          <p className="contact__lede">
            I’m looking for junior UI/UX and product design roles in Canada. I’d love to hear about your team and the problems
            you’re solving.
          </p>

          {actions}
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
