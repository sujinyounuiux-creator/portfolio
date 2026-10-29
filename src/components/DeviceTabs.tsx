import { useState } from 'react'
import type { Figure } from '../data/projects'
import { DeviceFrame, type Device } from './DeviceFrame'

type Item = { label: string; device: Device; figure: Figure }

/**
 * One device at a time, its name underneath as tabs (Phone, Tablet, Laptop, Desktop).
 * Each screen sits in a current device frame drawn in CSS (see DeviceFrame), sized so
 * every device takes about the same height and switching doesn't make the page jump.
 */
export function DeviceTabs({ items }: { items: Item[] }) {
  const [i, setI] = useState(0)
  const item = items[i]

  return (
    <figure className="device-tabs">
      <div className="device-tabs__stage">
        <DeviceFrame key={item.figure.src} device={item.device} figure={{ ...item.figure, zoom: false }} caption="" className={`device-tabs__device device-tabs__device--${item.device}`} />
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
