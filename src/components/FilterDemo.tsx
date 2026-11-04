import { useId, useState } from 'react'
import type { Figure } from '../data/projects'
import { ZoomImage } from './Lightbox'

/**
 * The Cookpad search bar as a small working demo: clicking the filter icon in the bar slides
 * the filter panel open, and clicking it again closes it. The icon pulses until first used.
 */
export function FilterDemo({ bar, panel }: { bar: Figure; panel: Figure }) {
  const [open, setOpen] = useState(false)
  const [used, setUsed] = useState(false)
  const panelId = useId()

  return (
    <figure className={`filter-demo ${open ? 'is-open' : ''}`}>
      <div className="filter-demo__bar">
        <img src={bar.src} alt={bar.alt} width={bar.width} height={bar.height} loading="lazy" decoding="async" />
        <button
          type="button"
          className={`filter-demo__icon ${used ? '' : 'is-pulsing'}`}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Close the filter panel' : 'Open the filter panel'}
          onClick={() => {
            setOpen((o) => !o)
            setUsed(true)
          }}
        />
      </div>
      <figcaption>{open ? 'Click the filter icon again to close the panel.' : 'Click the filter icon to open the panel.'}</figcaption>
      <div className="filter-demo__reveal" id={panelId} inert={!open}>
        <div className="filter-demo__panel">
          <ZoomImage figure={panel} />
        </div>
      </div>
    </figure>
  )
}
