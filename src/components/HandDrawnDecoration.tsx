// Hand-drawn doodles shared across the site.
// All are decorative (aria-hidden). The "crayon" filter defined in
// <CrayonDefs /> roughens the strokes so they feel drawn rather than vector-perfect.

import type { CSSProperties } from 'react'

type DoodleProps = {
  className?: string
  color?: string
  /** Animate the stroke drawing in on mount. */
  draw?: boolean
  style?: CSSProperties
}

const stroke = (color = 'var(--c-accent)', width = 4) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: width,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

/** Rendered once in the layout; provides the shared crayon texture filter. */
export function CrayonDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="crayon" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

export function Underline({ className = '', color, draw, style }: DoodleProps) {
  return (
    <svg className={`doodle doodle-underline ${draw ? 'draw' : ''} ${className}`} viewBox="0 0 200 22" preserveAspectRatio="none" aria-hidden="true" focusable="false" style={style}>
      <g filter="url(#crayon)">
        <path d="M4 13 C 42 6, 84 16, 122 9 S 180 6, 196 11" {...stroke(color, 6)} />
        <path d="M18 17 C 60 12, 120 18, 176 13" {...stroke(color, 3)} opacity="0.55" />
      </g>
    </svg>
  )
}

export function Circle({ className = '', color, draw, style }: DoodleProps) {
  return (
    <svg className={`doodle doodle-circle ${draw ? 'draw' : ''} ${className}`} viewBox="0 0 220 96" preserveAspectRatio="none" aria-hidden="true" focusable="false" style={style}>
      <g filter="url(#crayon)">
        <path
         
          d="M34 22 C 84 3, 186 5, 210 40 C 226 74, 128 94, 56 84 C 8 77, 2 44, 38 20 C 50 13, 64 10, 76 9"
          {...stroke(color, 4)}
        />
      </g>
    </svg>
  )
}

export function Arrow({ className = '', color, draw, style }: DoodleProps) {
  return (
    <svg className={`doodle doodle-arrow ${draw ? 'draw' : ''} ${className}`} viewBox="0 0 120 80" aria-hidden="true" focusable="false" style={style}>
      <g filter="url(#crayon)">
        <path d="M8 12 C 22 54, 62 72, 106 54" {...stroke(color ?? 'var(--c-ink)', 3)} />
        <path d="M90 42 L 107 54 L 89 66" {...stroke(color ?? 'var(--c-ink)', 3)} />
      </g>
    </svg>
  )
}

export function Star({ className = '', color = 'var(--c-highlight)', style }: DoodleProps) {
  return (
    <svg className={`doodle doodle-star ${className}`} viewBox="0 0 50 50" aria-hidden="true" focusable="false" style={style}>
      <path
        filter="url(#crayon)"
        d="M25 4 L 31 18.5 L 46.5 20 L 34.5 30.5 L 38.5 46 L 25 37.5 L 11.5 46.5 L 15.5 30.5 L 3.5 20.5 L 19 18.5 Z"
        fill={color}
        stroke="var(--c-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({ className = '', color, style }: DoodleProps) {
  return (
    <svg className={`doodle doodle-sparkle ${className}`} viewBox="0 0 40 40" aria-hidden="true" focusable="false" style={style}>
      <g filter="url(#crayon)" {...stroke(color ?? 'var(--c-ink)', 2.5)}>
        <path d="M20 4 L 20 14" />
        <path d="M20 26 L 20 36" />
        <path d="M4 20 L 14 20" />
        <path d="M26 20 L 36 20" />
        <path d="M9 9 L 13 13" />
        <path d="M27 27 L 31 31" />
      </g>
    </svg>
  )
}

export function Squiggle({ className = '', color, style }: DoodleProps) {
  return (
    <svg className={`doodle doodle-squiggle ${className}`} viewBox="0 0 100 20" aria-hidden="true" focusable="false" style={style}>
      <path filter="url(#crayon)" d="M3 12 q 8 -12 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 14 0" {...stroke(color, 3.5)} />
    </svg>
  )
}

export function Heart({ className = '', color = 'var(--c-coral)', style }: DoodleProps) {
  return (
    <svg className={`doodle doodle-heart ${className}`} viewBox="0 0 48 44" aria-hidden="true" focusable="false" style={style}>
      <path
        filter="url(#crayon)"
        d="M24 40 C 8 28, 2 20, 4 12 C 6 4, 18 2, 24 12 C 30 2, 43 4, 44 13 C 45 22, 38 29, 24 40 Z"
        fill={color}
        fillOpacity="0.85"
        stroke="var(--c-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A strip of washi tape for the scrapbook look. */
export function Tape({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <span className={`tape ${className}`} style={style} aria-hidden="true" />
}
