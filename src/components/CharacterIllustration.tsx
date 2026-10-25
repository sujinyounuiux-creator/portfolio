// Sujin's illustrated character (provided artwork, background removed with
// scripts/prepare-character.mjs, and the drawn star and heart erased with
// scripts/erase-character-doodles.mjs). To swap the art, replace
// design-exports/character-source.webp and re-run those scripts.

type Props = {
  className?: string
  /** Provide a label only where the illustration carries meaning; otherwise it is decorative. */
  label?: string
  eager?: boolean
}

export function CharacterIllustration({ className = '', label, eager = false }: Props) {
  return (
    <img
      className={`character ${className}`}
      src="/images/character.webp"
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      width={900}
      height={817}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
