import type { ReactNode } from 'react'
import type { Figure } from '../data/projects'
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
 * CSS-only device mockup on a soft studio backdrop. The laptop is seen from the front,
 * a little from above: thin graphite bezel and camera, the keyboard deck in perspective
 * and a silver front edge resting on a soft contact shadow. The phone has a thin bezel,
 * titanium band, Dynamic Island and side buttons. The tablet is a current iPad (thin, even
 * bezels, no home button) and the monitor an iMac 24" (thin bezel, a coloured chin and a
 * slim stand).
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
      ) : device === 'monitor' ? (
        <div className="device__monitor">
          <div className="device__monitor-face">
            {screen}
            <span className="device__chin" aria-hidden="true" />
          </div>
          <span className="device__stand" aria-hidden="true" />
        </div>
      ) : (
        <div className="device__phone">
          <span className="device__island" aria-hidden="true" />
          <span className="device__btn device__btn--action" aria-hidden="true" />
          <span className="device__btn device__btn--vol-up" aria-hidden="true" />
          <span className="device__btn device__btn--vol-down" aria-hidden="true" />
          <span className="device__btn device__btn--power" aria-hidden="true" />
          {screen}
        </div>
      )}
      {/* pass caption="" to hide the figure's own caption */}
      {(caption ?? figure?.caption) && <figcaption>{caption ?? figure?.caption}</figcaption>}
    </figure>
  )
}
