'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Reveal, SplitText, Tilt } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import { projects, type Project } from '@/lib/projects-data'

/** Small square art (app icons) is shown whole instead of being cropped to the frame. */
const CONTAINED_ART = new Set(['/noteai.png'])

function StackList({ project, label }: { project: Project; label: string }) {
  return (
    <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="t-data min-w-0 text-foreground">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {project.techStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </dd>
    </dl>
  )
}

function FeaturedProject({ project }: { project: Project }) {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // The frame opens up as it enters, the art drifts inside it.
  const clipPath = useTransform(
    scrollYProgress,
    [0.05, 0.4],
    ['inset(14% 10% 14% 10% round 10px)', 'inset(0% 0% 0% 0% round 10px)'],
  )
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  const title = t(`projects.items.${project.key}.title`)

  return (
    <article
      ref={ref}
      className="grid items-end gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
    >
      <Tilt max={5} className="h-auto">
        <motion.div style={reduced ? undefined : { clipPath }} className="rounded-lg">
          <Link
            href="/projects"
            aria-label={title}
            className="group relative block aspect-[15/8] overflow-hidden rounded-lg border border-border bg-secondary"
          >
            <motion.div style={reduced ? undefined : { y }} className="absolute inset-0 scale-[1.16]">
              <Image
                src={project.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </Link>
        </motion.div>
      </Tilt>

      <div className="min-w-0 lg:pb-4">
        <span className="chip" data-active="true">
          {t('projects.featuredBadge')}
        </span>
        <SplitText as="h3" text={title} className="t-title mt-5" />
        <Reveal variant="rise" delay={0.1}>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-muted-foreground">
            {t(`projects.items.${project.key}.description`)}
          </p>
          <div className="mt-6 border-t border-border pt-5">
            <StackList project={project} label={t('home.work.stack')} />
          </div>
        </Reveal>
      </div>
    </article>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const { t } = useI18n()
  const contained = CONTAINED_ART.has(project.image)

  return (
    <li className="group relative grid items-center gap-x-12 gap-y-6 border-t border-border py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:py-10">
      <div className="min-w-0">
        <h3 className="t-heading">
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 after:absolute after:inset-0 after:content-['']"
          >
            {t(`projects.items.${project.key}.title`)}
            <ArrowUpRight
              aria-hidden="true"
              className="size-5 shrink-0 text-muted-foreground transition-[transform,color] duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
            />
          </Link>
        </h3>
        <p className="mt-2 max-w-[52ch] leading-relaxed text-muted-foreground">
          {t(`projects.items.${project.key}.description`)}
        </p>
        <div className="mt-5">
          <StackList project={project} label={t('home.work.stack')} />
        </div>
      </div>

      <Reveal variant="wipe" duration={1} className="min-w-0">
        <div className="relative aspect-[3/1] overflow-hidden rounded-lg border border-border bg-secondary">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className={
              contained
                ? 'object-contain p-4 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105 sm:p-6'
                : 'object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]'
            }
          />
        </div>
      </Reveal>
    </li>
  )
}

export function HomeWork() {
  const { t } = useI18n()
  const featured = projects.find((project) => project.featured) ?? projects[0]
  const rest = projects.filter((project) => project !== featured)

  if (!featured) return null

  return (
    <section className="relative pb-24 sm:pb-32">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <SplitText as="h2" text={t('home.work.title')} className="t-title" />
            <Reveal variant="slide" delay={0.1}>
              <p className="t-lead mt-4">{t('home.work.lead')}</p>
            </Reveal>
          </div>
          <Link href="/projects" className="btn btn-ghost group shrink-0 self-start sm:self-auto">
            {t('projects.viewAll')}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-12 sm:mt-16">
          <FeaturedProject project={featured} />
        </div>

        <ul className="mt-16 border-b border-border sm:mt-24">
          {rest.map((project) => (
            <ProjectRow key={project.key} project={project} />
          ))}
        </ul>
      </div>
    </section>
  )
}
