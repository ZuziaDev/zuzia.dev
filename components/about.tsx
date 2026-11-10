'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { BrainCircuit, ChefHat, Code2, HeartHandshake } from 'lucide-react'
import { Reveal, SplitText } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'

/** A paragraph that goes from dim to full strength as it travels up the viewport. */
function LitParagraph({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.55'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1])

  return (
    <motion.p
      ref={ref}
      style={reduced ? undefined : { opacity }}
      className="max-w-[62ch] text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed"
    >
      {children}
    </motion.p>
  )
}

export function About() {
  const { t } = useI18n()
  const paragraphs = [
    t('about.paragraph1'),
    t('about.paragraph2'),
    t('about.paragraph3'),
    t('about.paragraph4'),
  ]

  const highlights = [
    {
      icon: ChefHat,
      title: t('about.highlights.aiSpecialist'),
      description: t('about.highlights.aiSpecialistDesc'),
    },
    {
      icon: Code2,
      title: t('about.highlights.fullStackDev'),
      description: t('about.highlights.fullStackDevDesc'),
    },
    {
      icon: BrainCircuit,
      title: t('about.highlights.productFocused'),
      description: t('about.highlights.productFocusedDesc'),
    },
    {
      icon: HeartHandshake,
      title: t('about.highlights.performanceDriven'),
      description: t('about.highlights.performanceDrivenDesc'),
    },
  ]

  const traits = [
    t('about.traits.problemSolver'),
    t('about.traits.teamPlayer'),
    t('about.traits.lifelongLearner'),
    t('about.traits.openSource'),
  ]

  const renderParagraph = (content: string) =>
    content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={`${part}-${index}`} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </span>
        )
      }

      return part
    })

  return (
    <section id="about" className="relative scroll-mt-[var(--nav-h)] py-24 sm:py-32">
      <div className="shell grid gap-x-12 gap-y-14 lg:grid-cols-12">
        {/* Left: stays put while the bio scrolls past */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <SplitText as="h2" text={t('about.title')} className="t-title" />
            <Reveal variant="unblur" delay={0.15}>
              <p className="t-lead mt-6">{t('about.intro')}</p>
            </Reveal>
            <Reveal variant="rise" delay={0.25}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {traits.map((trait) => (
                  <li key={trait} className="chip">
                    {trait}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Right: the bio, lit by scroll, then the four highlights as rows */}
        <div className="min-w-0 lg:col-span-7">
          <p className="t-heading text-foreground">{t('about.greeting')}</p>
          <div className="mt-6 space-y-7">
            {paragraphs.map((paragraph, index) => (
              <LitParagraph key={`${index}-${paragraph}`}>{renderParagraph(paragraph)}</LitParagraph>
            ))}
          </div>

          <dl className="mt-16 border-b border-border sm:mt-20">
            {highlights.map((item, index) => (
              <Reveal
                key={item.title}
                variant="slide"
                delay={index * 0.06}
                className="grid gap-x-8 gap-y-2 border-t border-border py-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
              >
                <dt className="flex items-start gap-3 font-display text-base font-semibold leading-snug tracking-tight text-foreground">
                  <item.icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                  {item.title}
                </dt>
                <dd className="pl-8 text-[0.9375rem] leading-relaxed text-muted-foreground sm:pl-0">
                  {item.description}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
