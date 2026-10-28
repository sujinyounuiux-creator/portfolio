/**
 * The site's arrow icon. Drawn as an SVG instead of a typed character (→ ← ↑ ↗), because
 * each font puts those glyphs at a different height; this one always sits centred on the
 * capital letters of the text next to it (see .arrow in base.css).
 */
type Dir = 'right' | 'left' | 'up' | 'up-right'

const PATHS: Record<Dir, string> = {
  right: 'M4 12h15M13 6l6 6-6 6',
  left: 'M20 12H5M11 6l-6 6 6 6',
  up: 'M12 20V5M6 11l6-6 6 6',
  'up-right': 'M7 17 17 7M8.5 7H17v8.5',
}

export function Arrow({ dir = 'right', className = '' }: { dir?: Dir; className?: string }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[dir]} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
