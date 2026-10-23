import { Link } from 'react-router-dom'
import { CharacterIllustration } from '../components/CharacterIllustration'
import { usePageMeta } from '../hooks/usePageMeta'

export function NotFoundPage() {
  usePageMeta('Page not found', 'This page does not exist.')
  return (
    <section className="section not-found">
      <div className="container not-found__inner">
        <CharacterIllustration className="not-found__art" />
        <div>
          <p className="hand not-found__note">hmm… nothing here</p>
          <h1>Page not found</h1>
          <p>The page you’re looking for doesn’t exist or has moved.</p>
          <Link to="/" className="btn">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}
