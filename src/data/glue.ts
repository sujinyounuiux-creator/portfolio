/**
 * Keeps a short article (a, an, the) on the same line as the word after it, so no line
 * ends with "the" or "a". It joins them with a non-breaking space. Applied to all the
 * site's text data (projects, site, about, volunteer).
 */
const ARTICLE = /(^|[\s(“"‘'])(a|an|the)\s+(?=\S)/gi

export const glue = (s: string) => s.replace(ARTICLE, '$1$2 ')

export function glueAll<T>(value: T): T {
  if (typeof value === 'string') return glue(value) as T
  if (Array.isArray(value)) return value.map(glueAll) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, glueAll(v)])) as T
  }
  return value
}
