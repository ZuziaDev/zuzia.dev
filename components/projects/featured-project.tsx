'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Reveal, SplitText, Tilt } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import type { Project } from '@/lib/projects-data'
import { ProjectActions, StackChips } from './project-actions'
import { fill, linkLabel } from './project-meta'

/**
 * The authored moment of the page: the featured project's artwork opens with the scroll,
 * tilts under the pointer, and carries its spec sheet as a ticket floating in front of it.
 */
export function FeaturedProject({ project }: { project: Project }) {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const artRef = useRef<HTMLDivElement>(null)

  // The art sits right under the page header, so the reveal runs while it travels up to the nav.
  const { scrollYProgress } = useScroll({ target: artRef, offset: ['start 0.62', 'start 0.14'] })
  const insetY = useTransform(scrollYProgress, [0, 1], [10, 0])
  const insetX = useTransform(scrollYProgress, [0, 1], [6, 0])
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round 0.625rem)`
  const scale = useTransform(scrollYProgress, [0, 1], [1.22, 1])
  const ticketY = useTransform(scrollYProgress, [0, 1], [40, 0])

  const title = t(`projects.items.${project.key}.title`)
  const links = [project.liveUrl, project.githubUrl, project.discordUrl].filter(
    (url): url is string => Boolean(url),
  )

  return (
    <article aria-label={title}>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-9">
          <Tilt max={5}>
            <motion.div
              ref={artRef}
              style={reduced ? undefined : { clipPath }}
              className="relative aspect-[15/8] overflow-hidden rounded-lg bg-secondary"
            >
              <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
                {project.video && !reduced ? (
                  <video
                    src={project.video}
                    poster={project.image}
                    aria-label={fill(t('projectsPage.artAlt'), { title })}
                    className="absolute inset-0 size-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={project.image}
                    alt={fill(t('projectsPage.artAlt'), { title })}
                    fill
                    priority
                    sizes="(min-width: 1280px) 900px, (min-width: 1024px) 72vw, 100vw"
                    className="object-cover"
                  />
                )}
              </motion.div>
            </motion.div>

            {/* Spec sheet: in the flow on small screens, lifted off the art in 3D from lg up */}
            <div className="mt-4 lg:absolute lg:bottom-8 lg:right-0 lg:mt-0 lg:w-[17rem] lg:translate-x-1/2 lg:[transform:translateZ(70px)]">
              <motion.div style={reduced ? undefined : { y: ticketY }}>
                <div className="ticket">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{t('projectsPage.spec.title')}</p>
                    <span className="chip" data-active="true">
                      {t('projects.featuredBadge')}
                    </span>
                  </div>
                  <hr className="ticket-rule" />
                  <p className="mb-2 text-xs text-muted-foreground">{t('projectsPage.spec.stack')}</p>
                  <StackChips stack={project.techStack} />
                  {links.length > 0 ? (
                    <>
                      <hr className="ticket-rule" />
                      <p className="mb-1.5 text-xs text-muted-foreground">{t('projectsPage.spec.links')}</p>
                      <ul className="t-data space-y-1">
                        {links.map((url) => (
                          <li key={url} className="truncate">
                            {linkLabel(url)}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              </motion.div>
            </div>
          </Tilt>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-12">
        <SplitText as="h2" by="char" stagger={0.03} text={title} className="t-display lg:col-span-7" />
        <div className="min-w-0 lg:col-span-5 lg:pt-2">
          <Reveal variant="unblur" delay={0.1}>
            <p className="t-lead">{t(`projects.items.${project.key}.description`)}</p>
          </Reveal>
          <Reveal variant="rise" delay={0.2} className="mt-8">
            <ProjectActions project={project} emphasis />
          </Reveal>
        </div>
      </div>
    </article>
  )
}
