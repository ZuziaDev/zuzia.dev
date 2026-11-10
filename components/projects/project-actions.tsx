'use client'

import { ArrowUpRight } from 'lucide-react'
import { SiDiscord, SiGithub } from 'react-icons/si'
import { Magnetic } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import type { Project } from '@/lib/projects-data'
import { cn } from '@/lib/utils'

/**
 * The outbound links of one project. `emphasis` turns the first link into the primary,
 * magnetic action; use it once per view.
 */
export function ProjectActions({
  project,
  emphasis = false,
  className,
}: {
  project: Project
  emphasis?: boolean
  className?: string
}) {
  const { t } = useI18n()
  const title = t(`projects.items.${project.key}.title`)
  const name = (label: string) => `${label}, ${title} (${t('projectsPage.newTab')})`

  const links = [
    project.liveUrl
      ? {
          id: 'live',
          href: project.liveUrl,
          label: t('projects.liveDemo'),
          icon: (
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          ),
          iconAfter: true,
        }
      : null,
    project.githubUrl
      ? {
          id: 'source',
          href: project.githubUrl,
          label: t('projects.source'),
          icon: <SiGithub aria-hidden="true" className="size-4" />,
          iconAfter: false,
        }
      : null,
    project.discordUrl
      ? {
          id: 'discord',
          href: project.discordUrl,
          label: t('projects.discord'),
          icon: <SiDiscord aria-hidden="true" className="size-4" />,
          iconAfter: false,
        }
      : null,
  ].filter((link) => link !== null)

  if (links.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map((link, index) => {
        const primary = emphasis && index === 0
        const anchor = (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name(link.label)}
            className={cn('btn group/btn', primary ? 'btn-primary' : 'btn-ghost')}
          >
            {link.iconAfter ? null : link.icon}
            {link.label}
            {link.iconAfter ? link.icon : null}
          </a>
        )
        return primary ? <Magnetic key={link.id}>{anchor}</Magnetic> : <span key={link.id}>{anchor}</span>
      })}
    </div>
  )
}

/** Tech stack as mono chips: stack names are data. */
export function StackChips({ stack, className }: { stack: string[]; className?: string }) {
  const { t } = useI18n()
  return (
    <ul aria-label={t('projectsPage.spec.stack')} className={cn('flex flex-wrap gap-2', className)}>
      {stack.map((tech) => (
        <li key={tech} className="chip t-data">
          {tech}
        </li>
      ))}
    </ul>
  )
}
