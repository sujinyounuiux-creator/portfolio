/**
 * Keeps a short word (a, an, the, to, of, in, on, at, by, for, and, or, with, my, I) on the
 * same line as the word after it, so no line ends with a dangling "a", "the" or "to". It
 * joins them with a non-breaking space. Applied to all the site's text data (projects,
 * site, about, volunteer, asclo).
 */
const SHORT = /(?<=^|[\s(“"‘'])(a|an|the|to|of|in|on|at|by|for|and|or|with|my|I)\s+(?=\S)/gi

export const glue = (s: string) => s.replace(SHORT, '$1 ')

export function glueAll<T>(value: T): T {
  if (typeof value === 'string') return glue(value) as T
  if (Array.isArray(value)) return value.map(glueAll) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, glueAll(v)])) as T
  }
  return value
}
