import { isPlaceholder } from '../data/site'

/** Renders text, or a highlighted chip if the value is a "[PLACEHOLDER]". */
export function Editable({ value }: { value: string }) {
  if (isPlaceholder(value)) {
    return (
      <span className="placeholder" title="Placeholder: edit in src/data">
        {value || '[TO DO]'}
      </span>
    )
  }
  return <>{value}</>
}

export function PlaceholderBlock({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="placeholder-block" role="note">
      <strong>{label}</strong>
      {hint && <span>{hint}</span>}
    </div>
  )
}
