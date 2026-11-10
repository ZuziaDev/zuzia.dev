'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE_OUT, Reveal, SplitText } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import type { Project } from '@/lib/projects-data'
import { cn } from '@/lib/utils'
import { ProjectActions, StackChips } from './project-actions'
import { artFor, fill } from './project-meta'

type Origin = 'left' | 'right' | 'center'

const CLIPPED: Record<Origin, string> = {
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  center: 'inset(0% 50% 0% 50%)',
}
const OPEN = 'inset(0% 0% 0% 0%)'

/** A fixed-ratio frame: the art is uncovered from `origin` on entry and drifts against the scroll. */
function ArtFrame({
  src,
  alt,
  origin,
  sizes,
  className,
}: {
  src: string
  alt: string
  origin: Origin
  sizes: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden rounded-lg border border-border bg-secondary', className)}
      initial={reduced ? false : { clipPath: CLIPPED[origin] }}
      whileInView={{ clipPath: OPEN }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: EASE_OUT }}
    >
      <motion.div className="absolute inset-x-0 -inset-y-[7%]" style={reduced ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover/row:scale-[1.03]"
        />
      </motion.div>
    </motion.div>
  )
}

/** A small square icon is never upscaled: it sits at its own size on a raised tile, centred on a steel plate. */
function IconPlate({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion()
  return (
    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border border-border bg-secondary">
      <div aria-hidden="true" className="absolute inset-3 rounded-md border border-border" />
      <div aria-hidden="true" className="absolute inset-y-3 left-1/2 w-px bg-border" />
      <div aria-hidden="true" className="absolute inset-x-3 top-1/2 h-px bg-border" />
      <motion.div
        className="surface surface-lift relative rounded-xl p-5 sm:p-6"
        initial={reduced ? false : { opacity: 0, scale: 0.8, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        <Image src={src} alt={alt} width={128} height={128} className="size-24 sm:size-28" />
      </motion.div>
    </div>
  )
}

/**
 * One project in the editorial list. Banners and icons sit beside their text and swap sides
 * (`flip`); a 3:1 strip runs the full width with the text set underneath it.
 */
export function ProjectRow({ project, flip }: { project: Project; flip: boolean }) {
  const { t } = useI18n()
  const art = artFor(project.image)
  const title = t(`projects.items.${project.key}.title`)
  const description = t(`projects.items.${project.key}.description`)
  const alt = fill(t('projectsPage.artAlt'), { title })

  if (art.kind === 'wide') {
    return (
      <article className="group/row">
        <ArtFrame
          src={project.image}
          alt={alt}
          origin="center"
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="aspect-[2/1] sm:aspect-[3/1]"
        />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-12">
          <SplitText as="h2" text={title} className="t-title lg:col-span-5" />
          <div className="min-w-0 lg:col-span-7">
            <Reveal variant="slide" delay={0.1}>
              <p className="max-w-[58ch] text-muted-foreground">{description}</p>
            </Reveal>
            <Reveal variant="rise" delay={0.18} className="mt-6">
              <StackChips stack={project.techStack} />
              <ProjectActions project={project} className="mt-6" />
            </Reveal>
          </div>
        </div>
      </article>
    )
  }

  const icon = art.kind === 'icon'

  return (
    <article className="group/row grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-x-12">
      <div className={cn('min-w-0', icon ? 'lg:col-span-5' : 'lg:col-span-7', flip && 'lg:order-2')}>
        {icon ? (
          <IconPlate src={project.image} alt={alt} />
        ) : (
          <ArtFrame
            src={project.image}
            alt={alt}
            origin={flip ? 'right' : 'left'}
            sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 100vw"
            className="aspect-[15/8]"
          />
        )}
      </div>
      <div
        className={cn(
          'min-w-0',
          icon ? 'lg:col-span-6' : 'lg:col-span-5',
          flip ? 'lg:order-1' : icon && 'lg:col-start-7',
        )}
      >
        <SplitText as="h2" text={title} className="t-title" />
        <Reveal variant="rise" delay={0.1}>
          <p className="mt-5 max-w-[52ch] text-muted-foreground">{description}</p>
        </Reveal>
        <Reveal variant="rise" delay={0.18} className="mt-6">
          <StackChips stack={project.techStack} />
          <ProjectActions project={project} className="mt-6" />
        </Reveal>
      </div>
    </article>
  )
}
