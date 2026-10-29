import type { CSSProperties, ReactNode } from 'react'
import type { Figure } from '../data/projects'
import mockups from '../data/mockups.json'
import { ZoomImage } from './Lightbox'

export type Device = 'desktop' | 'phone' | 'tablet' | 'monitor'

type Props = {
  device: Device
  /** A screen image, or custom screen content (e.g. a before/after slider). */
  figure?: Figure
  children?: ReactNode
  caption?: string
  className?: string
}

/**
 * Device mockup. The phone (an iPhone in black titanium) and the monitor (black glass
 * bezel, silver chin and stand) are realistic images with a see-through display
 * (scripts/prepare-device-mockups.mjs); the real screen sits exactly behind that window.
 * The laptop and tablet are drawn in CSS: the laptop seen from the front, a little from
 * above, with its keyboard deck in perspective, and a current iPad with thin even bezels.
 * The screen keeps the real screenshot's proportions. Screens marked `tall`
 * (full length pages) get a fixed viewport and scroll inside the device instead.
 */
export function DeviceFrame({ device, figure, children, caption, className = '' }: Props) {
  const scroll = Boolean(figure?.tall)
  const img = figure && <ZoomImage figure={figure} />

  const screen = (
    <div className={`device__screen ${scroll ? 'device__screen--scroll' : ''}`}>
      {children ??
        (scroll ? (
          <div className="device__scroll" tabIndex={0} role="region" aria-label={`${figure?.caption ?? 'Screen'} (scrollable)`}>
            {img}
          </div>
        ) : (
          img
        ))}
    </div>
  )

  return (
    <figure className={`device device--${device} ${className}`}>
      {device === 'desktop' ? (
        <div className="device__laptop">
          <div className="device__lid">
            <span className="device__cam" aria-hidden="true" />
            {screen}
          </div>
          <div className="device__deck" aria-hidden="true">
            <span className="device__keys" />
          </div>
          <div className="device__lip" aria-hidden="true" />
        </div>
      ) : device === 'tablet' ? (
        <div className="device__tablet">
          <span className="device__cam device__cam--tablet" aria-hidden="true" />
          {screen}
        </div>
      ) : (
        <PhotoFrame kind={device === 'monitor' ? 'monitor' : 'iphone'}>{screen}</PhotoFrame>
      )}
      {/* pass caption="" to hide the figure's own caption */}
      {(caption ?? figure?.caption) && <figcaption>{caption ?? figure?.caption}</figcaption>}
    </figure>
  )
}

/** A realistic device image with its display cut out; the screen is placed behind it. */
function PhotoFrame({ kind, children }: { kind: 'iphone' | 'monitor'; children: ReactNode }) {
  const m = mockups[kind]
  // a hair larger than the measured display, so no gap shows at its soft edge
  const bleed = 0.4
  const place = {
    left: `${m.screen.left - bleed}%`,
    top: `${m.screen.top - bleed}%`,
    width: `${m.screen.width + bleed * 2}%`,
    height: `${m.screen.height + bleed * 2}%`,
  } as CSSProperties
  // the screen layer covers the whole device and is clipped to the display's exact shape
  // (rounded corners included) by a mask cut from the same render
  const mask = `url(/images/mockups/${kind}-mask.png)`
  return (
    <div className={`device__photo ${kind === 'iphone' ? 'device__phone' : 'device__monitor'}`} style={{ aspectRatio: `${m.width} / ${m.height}` }}>
      <div className="device__photo-screen" style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <div className="device__photo-display" style={place}>
          {children}
        </div>
      </div>
      <img className="device__photo-frame" src={`/images/mockups/${kind}.webp`} alt="" width={m.width} height={m.height} loading="lazy" decoding="async" />
    </div>
  )
}
