'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'
import { SITE_NAME, socialLinks } from '@/lib/site'
import { EASE_OUT, Magnetic, SplitText } from '@/components/fx/motion'

// WebGL never renders on the server and is not needed for first paint of the headline.
const ParticleField = dynamic(() => import('@/components/three/particle-field'), { ssr: false })

/**
 * Pinned opening sequence. The section is 260svh tall with a sticky 100svh stage; scroll progress
 * drives the particle cloud (mark → sphere → burner flame → dust) and hands the headline over to
 * the short bio line before the page releases into About.
 */
export function Hero() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // act 1: the name
  const introOpacity = useTransform(scrollYProgress, [0, 0.22, 0.36], [1, 1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.36], ['0%', '-18%'])
  const introBlur = useTransform(scrollYProgress, [0.2, 0.36], ['blur(0px)', 'blur(10px)'])
  // act 2: the one-line bio, while the burner is lit
  const lineOpacity = useTransform(scrollYProgress, [0.4, 0.52, 0.8, 0.92], [0, 1, 1, 0])
  const lineY = useTransform(scrollYProgress, [0.4, 0.52, 0.8, 0.92], ['14%', '0%', '0%', '-14%'])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  const stageOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0.35])

  const [firstName, ...rest] = SITE_NAME.split(' ')
  const lastName = rest.join(' ')

  return (
    <section ref={ref} aria-label={SITE_NAME} className="relative h-[260svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh min-h-[34rem] flex-col overflow-hidden motion-reduce:relative">
        <motion.div className="absolute inset-0" style={reduced ? undefined : { opacity: stageOpacity }}>
          <ParticleField progress={scrollYProgress} className="absolute inset-0" />
        </motion.div>

        {/* Act 1 */}
        <motion.div
          className="shell relative z-10 flex flex-1 flex-col justify-end pb-28 pt-[calc(var(--nav-h)+2rem)] sm:pb-32 lg:justify-center lg:pb-24"
          style={reduced ? undefined : { opacity: introOpacity, y: introY, filter: introBlur }}
        >
          <div className="max-w-[46rem]">
            <motion.p
              className="mb-3 text-lg text-muted-foreground sm:text-xl"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
            >
              {t('hero.greeting')}
            </motion.p>

            <h1 className="t-display">
              <SplitText text={firstName} by="char" trigger="mount" delay={0.2} stagger={0.04} as="span" className="block" />
              {lastName ? (
                <SplitText text={lastName} by="char" trigger="mount" delay={0.42} stagger={0.04} as="span" className="block" />
              ) : null}
            </h1>

            <motion.p
              className="mt-6 max-w-[34rem] text-xl font-medium leading-snug text-foreground sm:text-2xl"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.85 }}
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 1 }}
            >
              <Magnetic>
                <Link href="/projects" className="btn btn-primary group">
                  {t('hero.viewProjects')}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Magnetic>
              <Link href="/contact" className="btn btn-ghost bg-background/60">
                {t('hero.contactMe')}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Act 2 */}
        {reduced ? null : (
          <motion.div
            aria-hidden="true"
            className="shell pointer-events-none absolute inset-x-0 bottom-[18%] z-10 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
            style={{ opacity: lineOpacity, y: lineY }}
          >
            <p className="t-title max-w-[18ch] sm:max-w-[20ch] lg:max-w-[16ch]">{t('about.intro')}</p>
          </motion.div>
        )}

        {/* Stage footer: status, socials, scroll cue */}
        <motion.div
          className="shell absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 pb-6"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-heat opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-heat" />
              </span>
              {t('hero.available')}
            </p>
            <ul className="-ml-2.5 flex items-center" aria-label={t('hero.findMeOn')}>
              {socialLinks.map(({ icon: Icon, href, labelKey }) => (
                <li key={labelKey}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(labelKey)}
                    className="flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
                  >
                    <Icon aria-hidden="true" className="size-[1.125rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <motion.a
            href="#about"
            aria-label={t('nav.about')}
            className="mb-1 hidden size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-foreground hover:text-foreground sm:flex motion-reduce:hidden"
            style={{ opacity: cueOpacity }}
          >
            <motion.span
              className="flex"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
            >
              <ArrowDown aria-hidden="true" className="size-4" />
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
