'use client'

import { FeaturedProject } from '@/components/projects/featured-project'
import { artFor } from '@/components/projects/project-meta'
import { ProjectRow } from '@/components/projects/project-row'
import { useI18n } from '@/lib/i18n-context'
import { projects } from '@/lib/projects-data'

/** Own projects: the featured one as the authored moment, the rest as an alternating editorial list. */
export function MyProjects() {
  const { t } = useI18n()
  const featured = projects.find((project) => project.featured) ?? projects[0]
  const rest = projects.filter((project) => project !== featured)

  // Only side-by-side rows alternate; a full-width strip does not consume a side.
  let sideBySide = 0
  const rows = rest.map((project) => {
    const wide = artFor(project.image).kind === 'wide'
    const flip = wide ? false : sideBySide++ % 2 === 1
    return { project, flip }
  })

  return (
    <section id="work" aria-label={t('projects.featured')} className="shell scroll-mt-[calc(var(--nav-h)+1.5rem)]">
      {featured ? <FeaturedProject project={featured} /> : null}

      {rows.length > 0 ? (
        <ul role="list" className="mt-24 sm:mt-32">
          {rows.map(({ project, flip }) => (
            <li key={project.key} className="border-t border-border py-16 sm:py-24">
              <ProjectRow project={project} flip={flip} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
