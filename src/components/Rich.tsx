/** Text with **bold** key words: each pair of double asterisks becomes <strong>. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p))}</>
}
