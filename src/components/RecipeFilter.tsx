import { useEffect, useId, useRef, useState } from 'react'
import { FilterPanel } from './FilterDemo'

// Places on the Cookpad recipe page image (1600 x 1765), as percentages of it.
const ICON = { x: 71.875, y: 4.59 } // the filter icon at the end of the search bar
const PANEL = { left: 12.94, top: 6.75 } // under the search field, not the Search button
const BASE = 985 // the panel is laid out at the search field's width (at 1600 px), then scaled

/**
 * The filter icon in the Cookpad recipe page's search bar, working: clicking it opens the real
 * filter panel just under the bar, scaled to the screenshot, and clicking it again closes it.
 * It sits inside the scrolling page, so it moves with the page like the rest of it.
 */
export function RecipeFilter() {
  const [open, setOpen] = useState(false)
  const [used, setUsed] = useState(false)
  const [scale, setScale] = useState(1)
  const box = useRef<HTMLDivElement>(null)
  const panelId = useId()

  // the page image changes size with the laptop, so the panel follows it
  useEffect(() => {
    const el = box.current?.parentElement
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1600))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div ref={box} className="recipe-filter">
      <button
        type="button"
        className={`recipe-filter__icon ${used ? '' : 'is-pulsing'}`}
        style={{ left: `${ICON.x}%`, top: `${ICON.y}%` }}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close the filter panel' : 'Open the filter panel'}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
          setUsed(true)
        }}
      />
      <div
        id={panelId}
        className={`recipe-filter__panel ${open ? 'is-open' : ''}`}
        style={{ left: `${PANEL.left}%`, top: `${PANEL.top}%`, width: BASE, transform: `scale(${scale})` }}
        inert={!open}
        onClick={(e) => e.stopPropagation()}
      >
        <FilterPanel />
      </div>
    </div>
  )
}
