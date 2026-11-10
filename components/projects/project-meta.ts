/**
 * Helpers for the Projects page that are derived from lib/projects-data.ts without changing it.
 */

export type ArtKind = 'banner' | 'wide' | 'icon'

export interface ProjectArt {
  /** intrinsic pixel size of the file in /public */
  width: number
  height: number
  /** how the frame should treat it: 15:8-ish banner, 3:1 strip, or a small square icon */
  kind: ArtKind
}

const ART: Record<string, ProjectArt> = {
  '/neuroa_banner.png': { width: 750, height: 400, kind: 'banner' },
  '/neuroa.png': { width: 2048, height: 1152, kind: 'banner' },
  '/mirai.png': { width: 3072, height: 1024, kind: 'wide' },
  '/noteai.png': { width: 256, height: 256, kind: 'icon' },
}

const FALLBACK_ART: ProjectArt = { width: 1600, height: 900, kind: 'banner' }

export function artFor(image: string): ProjectArt {
  return ART[image] ?? FALLBACK_ART
}

/** Fill `{name}` placeholders in a translated string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

/** "https://patreon.com/NeuroaAI" -> "patreon.com/NeuroaAI" */
export function linkLabel(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    return `${hostname.replace(/^www\./, '')}${pathname.replace(/\/$/, '')}`
  } catch {
    return url
  }
}
