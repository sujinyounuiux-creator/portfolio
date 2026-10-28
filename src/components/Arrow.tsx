/**
 * The site's arrow icon. Drawn as an SVG instead of a typed character (→ ← ↑ ↗), because
 * each font puts those glyphs at a different height; this one always sits centred on the
 * capital letters of the text next to it (see .arrow in base.css).
 */
type Dir = 'right' | 'left' | 'up' | 'up-right'

const PATHS: Record<Dir, string> = {
  right: 'M3 12h17.5M13.5 5l7 7-7 7',
  left: 'M21 12H3.5M10.5 5l-7 7 7 7',
  up: 'M12 21V3.5M5 10.5l7-7 7 7',
  'up-right': 'M5.5 18.5 18.5 5.5M8.5 5.5h10v10',
}

export function Arrow({ dir = 'right', className = '' }: { dir?: Dir; className?: string }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[dir]} fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
