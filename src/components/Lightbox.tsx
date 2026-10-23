import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import type { Figure } from '../data/projects'

const LightboxContext = createContext<(figure: Figure) => void>(() => {})

type View = { scale: number; x: number; y: number }
const FIT: View = { scale: 1, x: 0, y: 0 }

/**
 * One shared image popup for the whole site, on a native modal <dialog>:
 * dims the page, traps focus, closes on Esc, the close button or a click outside
 * the image, and returns focus to the image that opened it.
 * Click (or tap) the image to zoom in on that spot, drag to pan, click again to fit.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [figure, setFigure] = useState<Figure | null>(null)
  const [view, setView] = useState<View>(FIT)
  const [dragging, setDragging] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null)

  useEffect(() => {
    const d = dialog.current
    if (figure && d && !d.open) d.showModal()
  }, [figure])

  const open = useCallback((f: Figure) => {
    setView(FIT)
    setFigure(f)
  }, [])
  const close = () => dialog.current?.close()

  /** Keeps the zoomed image covering the stage, so it can't be dragged off screen. */
  const clamp = useCallback((v: View): View => {
    const s = stage.current?.getBoundingClientRect()
    const i = img.current
    if (!s || !i) return v
    const maxX = Math.max(0, (i.offsetWidth * v.scale - s.width) / 2)
    const maxY = Math.max(0, (i.offsetHeight * v.scale - s.height) / 2)
    return { scale: v.scale, x: Math.min(maxX, Math.max(-maxX, v.x)), y: Math.min(maxY, Math.max(-maxY, v.y)) }
  }, [])

  /** Zoom factor: at least 2×, up to the image's real resolution (max 4×). */
  const zoomScale = () => {
    const i = img.current
    if (!i || !i.offsetWidth) return 2
    return Math.min(4, Math.max(2, i.naturalWidth / i.offsetWidth))
  }

  const toggleAt = (clientX?: number, clientY?: number) => {
    const i = img.current
    if (!i) return
    if (view.scale > 1) return setView(FIT)
    const scale = zoomScale()
    const r = i.getBoundingClientRect()
    // move the clicked point to the centre (defaults to the image centre)
    const dx = clientX === undefined ? 0 : clientX - (r.left + r.width / 2)
    const dy = clientY === undefined ? 0 : clientY - (r.top + r.height / 2)
    setView(clamp({ scale, x: -dx * scale, y: -dy * scale }))
  }

  const onDown = (e: ReactPointerEvent<HTMLImageElement>) => {
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
    if (view.scale > 1) {
      e.currentTarget.setPointerCapture(e.pointerId)
      setDragging(true)
    }
  }
  const onMove = (e: ReactPointerEvent<HTMLImageElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId || view.scale === 1) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true
    d.x = e.clientX
    d.y = e.clientY
    setView((v) => clamp({ ...v, x: v.x + dx, y: v.y + dy }))
  }
  const onUp = (e: ReactPointerEvent<HTMLImageElement>) => {
    const d = drag.current
    drag.current = null
    setDragging(false)
    // a press without dragging is a click: toggle zoom at that point
    if (d && !d.moved) toggleAt(e.clientX, e.clientY)
  }

  const zoomed = view.scale > 1

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className={`lightbox ${zoomed ? 'is-zoomed' : ''}`}
        aria-label={figure ? `Enlarged image: ${figure.caption ?? figure.alt}` : undefined}
        onClose={() => {
          setFigure(null)
          setView(FIT)
        }}
        onClick={(e) => {
          // anywhere outside the image, its caption and the controls closes the popup
          if (!(e.target as Element).closest('.lightbox__img, figcaption, .lightbox__tools')) close()
        }}
      >
        {figure && (
          <figure className="lightbox__figure">
            <div ref={stage} className="lightbox__stage">
              <img
                ref={img}
                className={`lightbox__img ${dragging ? 'is-dragging' : ''}`}
                src={figure.src}
                alt={figure.alt}
                width={figure.width}
                height={figure.height}
                draggable={false}
                style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={() => {
                  drag.current = null
                  setDragging(false)
                }}
              />
            </div>
            {figure.caption && <figcaption>{figure.caption}</figcaption>}
          </figure>
        )}
        <div className="lightbox__tools">
          <span className="lightbox__hint" aria-hidden="true">
            {zoomed ? 'Drag to look around · click to fit' : 'Click the image to zoom in'}
          </span>
          <button type="button" className="lightbox__btn" onClick={() => toggleAt()} aria-pressed={zoomed}>
            {zoomed ? 'Fit' : 'Zoom'}
          </button>
          <button type="button" className="lightbox__btn lightbox__btn--close" onClick={close} aria-label="Close enlarged image">
            ×
          </button>
        </div>
      </dialog>
    </LightboxContext.Provider>
  )
}

/** A photo that opens in the lightbox when clicked. */
export function ZoomImage({ figure, eager = false, className = '' }: { figure: Figure; eager?: boolean; className?: string }) {
  const open = useContext(LightboxContext)
  const onClick = useCallback(() => open(figure), [open, figure])
  return (
    <button type="button" className={`zoom ${className}`} onClick={onClick} aria-label={`Enlarge image: ${figure.caption ?? figure.alt}`}>
      <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      <span className="zoom__hint" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6" />
        </svg>
      </span>
    </button>
  )
}
