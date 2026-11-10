'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion'
import {
  ArrowRight,
  Award,
  Bot,
  Brain,
  CodeXml,
  CreditCard,
  Cross,
  GraduationCap,
  Heart,
  HeartCrack,
  Image,
  Rocket,
  School,
  type LucideIcon,
} from 'lucide-react'
import { Reveal, SplitText } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'

type TimelineEvent = {
  year: string
  titleKey: string
  companyKey: string
  descriptionKey: string
  icon: LucideIcon
  type: 'work' | 'achievement' | 'education'
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2026',
    titleKey: 'timeline.events.plans2026.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.plans2026.description',
    icon: CreditCard,
    type: 'work',
  },
  {
    year: '2026',
    titleKey: 'timeline.events.bot2026.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.bot2026.description',
    icon: Bot,
    type: 'work',
  },
  {
    year: '2025',
    titleKey: 'timeline.events.neuroa2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.neuroa2025.description',
    icon: CodeXml,
    type: 'work',
  },
  {
    year: '2025',
    titleKey: 'timeline.events.separation2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.separation2025.description',
    icon: HeartCrack,
    type: 'work',
  },
  {
    year: '2025',
    titleKey: 'timeline.events.love2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.love2025.description',
    icon: Heart,
    type: 'work',
  },
  {
    year: '2025',
    titleKey: 'timeline.events.break2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.break2025.description',
    icon: Rocket,
    type: 'work',
  },
  {
    year: '2025',
    titleKey: 'timeline.events.aiAdvance2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.aiAdvance2025.description',
    icon: Brain,
    type: 'work',
  },
  {
    year: '2024',
    titleKey: 'timeline.events.firstModel2024.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.firstModel2024.description',
    icon: Brain,
    type: 'work',
  },
  {
    year: '2023',
    titleKey: 'timeline.events.design2023.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.design2023.description',
    icon: Image,
    type: 'work',
  },
  {
    year: '2023',
    titleKey: 'timeline.events.api2023.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.api2023.description',
    icon: GraduationCap,
    type: 'work',
  },
  {
    year: '2023',
    titleKey: 'timeline.events.frontend2023.title',
    companyKey: 'timeline.companies.portNature',
    descriptionKey: 'timeline.events.frontend2023.description',
    icon: Award,
    type: 'achievement',
  },
  {
    year: '2022',
    titleKey: 'timeline.events.aiIntro2022.title',
    companyKey: 'timeline.companies.portNature',
    descriptionKey: 'timeline.events.aiIntro2022.description',
    icon: Brain,
    type: 'education',
  },
  {
    year: '2022',
    titleKey: 'timeline.events.graduation2022.title',
    companyKey: '',
    descriptionKey: 'timeline.events.graduation2022.description',
    icon: School,
    type: 'achievement',
  },
  {
    year: '2021',
    titleKey: 'timeline.events.languages2021.title',
    companyKey: '',
    descriptionKey: 'timeline.events.languages2021.description',
    icon: GraduationCap,
    type: 'education',
  },
  {
    year: '2021',
    titleKey: 'timeline.events.discord2021.title',
    companyKey: '',
    descriptionKey: 'timeline.events.discord2021.description',
    icon: GraduationCap,
    type: 'education',
  },
  {
    year: '2020',
    titleKey: 'timeline.events.pandemic2020.title',
    companyKey: '',
    descriptionKey: 'timeline.events.pandemic2020.description',
    icon: Cross,
    type: 'education',
  },
]

const TOTAL = timelineEvents.length
/** Chronological order number: the oldest event is 01. */
const orderNumber = (index: number) => String(TOTAL - index).padStart(2, '0')

/* ------------------------------------------------------------------ */
/* The ticket itself, shared by the rail and the list.                 */
/* ------------------------------------------------------------------ */

function Ticket({ event, index }: { event: TimelineEvent; index: number }) {
  const { t } = useI18n()
  const Icon = event.icon

  return (
    <article className="ticket drop-shadow-md">
      <div className="flex items-center justify-between gap-4">
        <p className="t-data flex items-baseline gap-3 text-muted-foreground">
          <time dateTime={event.year} className="text-sm font-medium text-foreground">
            {event.year}
          </time>
          <span aria-hidden="true">#{orderNumber(index)}</span>
        </p>
        <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
      </div>
      <h3 className="t-heading mt-4">{t(event.titleKey)}</h3>
      {event.companyKey ? (
        <p className="mt-1.5 text-sm text-muted-foreground">{t(event.companyKey)}</p>
      ) : null}
      <hr className="ticket-rule" />
      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {t(event.descriptionKey)}
      </p>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop: tickets hanging from a steel rail, moved by vertical scroll. */
/* ------------------------------------------------------------------ */

const DROPS = ['1.5rem', '4.5rem', '2.75rem'] as const

function HangingTicket({
  event,
  index,
  sway,
}: {
  event: TimelineEvent
  index: number
  sway: MotionValue<number>
}) {
  const rest = index % 2 === 0 ? -1.1 : 1.3
  // Lighter pull on every other ticket so the row does not swing as one board.
  const pull = 0.75 + (index % 3) * 0.2
  const rotate = useTransform(sway, (value) => rest + value * pull)
  const startsYear = index === 0 || timelineEvents[index - 1].year !== event.year

  return (
    <li className="relative w-[21rem] shrink-0">
      {startsYear ? (
        <div aria-hidden="true" className="absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center">
          <span className="t-data text-sm text-foreground">{event.year}</span>
          <span className="mt-1.5 h-3 w-px bg-foreground" />
        </div>
      ) : null}
      <motion.div style={{ rotate, transformOrigin: '50% 0%' }} className="will-change-transform">
        {/* clip on the rail, then the string down to the ticket */}
        <div aria-hidden="true" className="flex flex-col items-center">
          <span className="h-4 w-3 rounded-sm bg-muted-foreground" />
          <span className="w-px bg-muted-foreground" style={{ height: DROPS[index % DROPS.length] }} />
        </div>
        <Ticket event={event} index={index} />
      </motion.div>
    </li>
  )
}

function TimelineRail() {
  const { t } = useI18n()
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const [travel, setTravel] = useState(0)
  const [active, setActive] = useState(0)
  const travelValue = useMotionValue(0)

  // Horizontal distance the track has to cover = its real width minus the stage.
  useEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return
    const measure = () => {
      const distance = Math.max(0, track.scrollWidth - stage.clientWidth)
      setTravel(distance)
      travelValue.set(distance)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    observer.observe(track)
    return () => observer.disconnect()
  }, [travelValue])

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  const x = useTransform(() => -scrollYProgress.get() * travelValue.get())
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  // Tickets lag behind the rail: sway follows scroll velocity and settles on a spring.
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(velocity, { stiffness: 110, damping: 16, mass: 0.7 })
  const sway = useTransform(smoothVelocity, [-3200, 3200], [4.5, -4.5], { clamp: true })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setActive(Math.min(TOTAL - 1, Math.max(0, Math.round(progress * (TOTAL - 1)))))
  })

  return (
    // Wrapper height = one screen + the horizontal travel, so vertical scroll maps 1:1 to X.
    <div ref={wrapRef} className="relative" style={{ height: `calc(100svh + ${travel}px)` }}>
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[calc(var(--nav-h)+2rem)]"
      >
        <div className="shell flex items-end justify-between gap-10">
          <div className="min-w-0">
            <SplitText as="h2" text={t('timeline.title')} className="t-title" />
            <p className="t-lead mt-3">{t('timeline.subtitle')}</p>
          </div>
          <p aria-hidden="true" className="flex shrink-0 items-baseline gap-4 font-mono tabular">
            <span className="text-5xl font-medium leading-none tracking-tight text-foreground">
              {timelineEvents[active].year}
            </span>
            <span className="t-data text-muted-foreground">
              {orderNumber(active)} / {String(TOTAL).padStart(2, '0')}
            </span>
          </p>
        </div>

        <div className="relative mt-16 min-h-0 flex-1">
          {/* The rail: fixed steel bar, flame shows how far along you are */}
          <div aria-hidden="true" className="absolute inset-x-0 top-1 h-2 border-y border-border bg-secondary">
            <motion.div className="flame absolute inset-0 origin-left" style={{ scaleX: scrollYProgress }} />
          </div>
          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="relative flex w-max items-start gap-7 px-[max(var(--gutter),calc((100vw-var(--shell))/2+var(--gutter)))] will-change-transform"
          >
            {timelineEvents.map((event, index) => (
              <HangingTicket key={`${event.year}-${event.titleKey}`} event={event} index={index} sway={sway} />
            ))}
          </motion.ol>
        </div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="shell pointer-events-none absolute inset-x-0 bottom-6 flex items-center gap-2 text-sm text-muted-foreground"
        >
          {t('home.journey.hint')}
          <ArrowRight aria-hidden="true" className="size-4" />
        </motion.p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile, touch, short screens, reduced motion: plain list by year.   */
/* ------------------------------------------------------------------ */

function TimelineList() {
  const { t } = useI18n()
  const groups: { year: string; items: { event: TimelineEvent; index: number }[] }[] = []
  timelineEvents.forEach((event, index) => {
    const last = groups[groups.length - 1]
    if (last && last.year === event.year) last.items.push({ event, index })
    else groups.push({ year: event.year, items: [{ event, index }] })
  })

  return (
    <div className="shell py-24 sm:py-32">
      <SplitText as="h2" text={t('timeline.title')} className="t-title" />
      <p className="t-lead mt-4">{t('timeline.subtitle')}</p>

      <ol className="mt-12 sm:mt-16">
        {groups.map((group) => (
          <li
            key={group.year}
            className="grid gap-x-10 gap-y-6 border-t border-border py-8 md:grid-cols-[7rem_minmax(0,1fr)] md:py-10"
          >
            <p className="font-mono text-2xl font-medium leading-none tabular text-foreground md:sticky md:top-[calc(var(--nav-h)+1.5rem)] md:self-start">
              {group.year}
            </p>
            <ol className="grid items-start gap-5 sm:grid-cols-2">
              {group.items.map(({ event, index }, position) => (
                <Reveal as="li" key={event.titleKey} variant="rise" delay={(position % 2) * 0.08} className="min-w-0">
                  <Ticket event={event} index={index} />
                </Reveal>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Pinned rail only where it works: wide, tall enough, fine pointer, motion allowed. */
function useRailMode() {
  const reduced = useReducedMotion()
  const [capable, setCapable] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (min-height: 700px) and (pointer: fine)')
    const update = () => setCapable(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return capable && !reduced
}

export function Timeline() {
  const rail = useRailMode()

  return (
    <section id="journey" className="relative scroll-mt-[var(--nav-h)]">
      <div aria-hidden="true" className="seam" />
      {rail ? <TimelineRail /> : <TimelineList />}
    </section>
  )
}
