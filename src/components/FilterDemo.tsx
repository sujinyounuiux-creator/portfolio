import { useId, useState } from 'react'
import type { Figure } from '../data/projects'

/** The filter options from the Cookpad design. */
const GROUPS = [
  { title: 'Cooking Time', options: ['Within 10 minutes', 'Within 20 minutes', 'Within 30 minutes', 'Within 1 hour', '1 hour or more'] },
  { title: 'Difficulty', options: ['Easy', 'Usually', 'A little difficult', 'Difficulty'] },
  { title: 'Types of Dishes', options: ['Morning', 'Lunch', 'Dinner', 'Snack'] },
]
const RECENT = ['Rice', 'Tofu']

/**
 * The Cookpad search bar as a small working demo: clicking the filter icon in the bar slides
 * the filter panel open, and clicking it again closes it. The icon pulses until first used.
 * The panel is real: options can be picked (and clicked again to clear) and the allergy field
 * can be typed in.
 */
export function FilterDemo({ bar }: { bar: Figure }) {
  const [open, setOpen] = useState(false)
  const [used, setUsed] = useState(false)
  const [picked, setPicked] = useState<Record<string, string>>({})
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
      <figcaption>{open ? 'Try the filters, or click the icon again to close the panel.' : 'Click the filter icon to open the panel.'}</figcaption>
      <div className="filter-demo__reveal" id={panelId} inert={!open}>
        <div className="filter-demo__panel">
          <form className="filter-panel" aria-label="Filter panel" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-panel__col">
              <p className="filter-panel__title filter-panel__title--icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="7" />
                  <path d="m16 16 5 5" />
                </svg>
                Keywords (Ingredients)
              </p>
              <ul className="filter-panel__recent" aria-label="Recent keywords">
                {RECENT.map((k) => (
                  <li key={k}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            {GROUPS.map((g) => (
              <fieldset key={g.title} className="filter-panel__col">
                <legend className="filter-panel__title">{g.title}</legend>
                {g.options.map((o) => (
                  <label key={o} className="filter-panel__option">
                    <input
                      type="radio"
                      name={`${panelId}-${g.title}`}
                      checked={picked[g.title] === o}
                      onChange={() => setPicked((p) => ({ ...p, [g.title]: o }))}
                      onClick={() => {
                        // clicking the chosen option again clears it
                        if (picked[g.title] === o) setPicked((p) => ({ ...p, [g.title]: '' }))
                      }}
                    />
                    {o}
                  </label>
                ))}
              </fieldset>
            ))}
            <div className="filter-panel__col">
              <label className="filter-panel__title" htmlFor={`${panelId}-allergy`}>
                Allergy-related
              </label>
              <input id={`${panelId}-allergy`} className="filter-panel__input" type="text" placeholder="Enter any ingredients" autoComplete="off" />
            </div>
          </form>
        </div>
      </div>
    </figure>
  )
}
