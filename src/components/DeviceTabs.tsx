import { useState } from 'react'
import type { Figure } from '../data/projects'

type Item = { label: string; figure: Figure }

/**
 * One device at a time on a studio backdrop, with the device names underneath as tabs
 * (Phone, Tablet, Laptop, Desktop). Each device keeps its own proportions and is scaled
 * to one shared height, so switching doesn't make the page jump.
 */
export function DeviceTabs({ items }: { items: Item[] }) {
  const [i, setI] = useState(0)
  const item = items[i]

  return (
    <figure className="device-tabs">
      <div className="device-tabs__stage">
        <img key={item.figure.src} src={item.figure.src} alt={item.figure.alt} width={item.figure.width} height={item.figure.height} loading="lazy" decoding="async" />
      </div>
      <div className="device-tabs__list" role="tablist" aria-label="Devices">
        {items.map((it, n) => (
          <button key={it.label} type="button" role="tab" aria-selected={n === i} className="device-tabs__tab" onClick={() => setI(n)}>
            {it.label}
          </button>
        ))}
      </div>
    </figure>
  )
}
