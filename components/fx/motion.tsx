'use client'

/**
 * Shared motion primitives for the whole site. See DESIGN.md § Motion.
 * Every primitive renders its final state when the visitor prefers reduced motion.
 */

import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

/* ------------------------------------------------------------------ */
/* Reveal: one element entering the viewport. Pick the variant on purpose. */
/* ------------------------------------------------------------------ */

type RevealVariant = 'rise' | 'wipe' | 'unblur' | 'slide'

const revealFrom: Record<RevealVariant, Record<string, string | number>> = {
  rise: { opacity: 0, y: 28 },
  wipe: { clipPath: 'inset(0 100% 0 0)' },
  unblur: { opacity: 0, filter: 'blur(14px)' },
  slide: { opacity: 0, x: -36 },
}
const revealTo: Record<RevealVariant, Record<string, string | number>> = {
  rise: { opacity: 1, y: 0 },
  wipe: { clipPath: 'inset(0 0% 0 0)' },
  unblur: { opacity: 1, filter: 'blur(0px)' },
  slide: { opacity: 1, x: 0 },
}

export function Reveal({
  children,
  variant = 'rise',
  delay = 0,
  duration = 0.8,
  className,
  as = 'div',
  once = true,
}: {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  as?: 'div' | 'li' | 'span' | 'section' | 'article' | 'p'
  once?: boolean
}) {
  const reduced = useReducedMotion()
  const Tag = motion[as] as typeof motion.div
  if (reduced) {
    const Plain = as as ElementType
    return <Plain className={className}>{children}</Plain>
  }
  return (
    <Tag
      className={className}
      initial={revealFrom[variant]}
      whileInView={revealTo[variant]}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* SplitText: words (or characters) rise out of a mask, staggered.     */
/* ------------------------------------------------------------------ */

export function SplitText({
  text,
  by = 'word',
  className,
  delay = 0,
  stagger = 0.045,
  as = 'span',
  trigger = 'view',
}: {
  text: string
  by?: 'word' | 'char'
  className?: string
  delay?: number
  stagger?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div'
  /** 'view' animates when scrolled into view, 'mount' animates on first paint */
  trigger?: 'view' | 'mount'
}) {
  const reduced = useReducedMotion()
  const Tag = as as ElementType
  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }
  const words = text.split(' ')
  let index = 0
  const piece = (content: string, key: string) => {
    const i = index++
    const anim = { y: '0%' }
    const transition = { duration: 0.9, delay: delay + i * stagger, ease: EASE_OUT }
    return (
      <span key={key} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
        <motion.span
          className="inline-block will-change-transform"
          initial={{ y: '110%' }}
          {...(trigger === 'mount'
            ? { animate: anim }
            : { whileInView: anim, viewport: { once: true, margin: '0px 0px -10% 0px' } })}
          transition={transition}
        >
          {content}
        </motion.span>
      </span>
    )
  }
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={`${word}-${w}`} aria-hidden="true" className="inline-block whitespace-nowrap">
          {by === 'char'
            ? Array.from(word).map((ch, c) => piece(ch, `${w}-${c}`))
            : piece(word, `${w}`)}
          {w < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Tilt: pointer-driven 3D tilt with a moving highlight. Fine pointers only. */
/* ------------------------------------------------------------------ */

export function Tilt({
  children,
  className,
  max = 9,
  glare = true,
  style,
}: {
  children: ReactNode
  className?: string
  /** max rotation in degrees */
  max?: number
  glare?: boolean
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18, mass: 0.6 })
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18, mass: 0.6 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 })
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, color-mix(in oklab, var(--foreground) 14%, transparent), transparent 60%)`

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 2 * max)
    rx.set(-(py - 0.5) * 2 * max)
    gx.set(px * 100)
    gy.set(py * 100)
    glareOpacity.set(1)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    glareOpacity.set(0)
  }

  return (
    <div style={{ perspective: 1100 }} className={cn('h-full', className)}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', ...style }}
        className="relative h-full will-change-transform"
      >
        {children}
        {glare ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, opacity: glareOpacity }}
          />
        ) : null}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Magnetic: the element leans toward the pointer. For primary actions only. */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 })
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 })
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/* CountUp: a number that counts to its value once it is on screen.    */
/* ------------------------------------------------------------------ */

export function CountUp({
  value,
  suffix = '',
  duration = 1.2,
  className,
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || !inView) return
    if (reduced) {
      node.textContent = `${value}${suffix}`
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, suffix, duration, reduced])

  return (
    <span ref={ref} className={cn('tabular', className)}>
      {`${value}${suffix}`}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Gauge: the flame bar. Fills to `value` percent when scrolled into view. */
/* ------------------------------------------------------------------ */

export function Gauge({
  value,
  delay = 0,
  className,
  label,
}: {
  value: number
  delay?: number
  className?: string
  label?: string
}) {
  const reduced = useReducedMotion()
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={label}
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-secondary', className)}
    >
      <motion.div
        className="flame absolute inset-0 origin-left rounded-full"
        style={{ width: `${value}%` }}
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        transition={{ duration: 1.1, delay, ease: EASE_OUT }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Marquee: endless horizontal strip. Pauses on hover and for reduced motion. */
/* ------------------------------------------------------------------ */

export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
}: {
  children: ReactNode
  /** seconds per loop */
  duration?: number
  reverse?: boolean
  className?: string
}) {
  return (
    <div className={cn('marquee-mask group overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={
          {
            '--marquee-duration': `${duration}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          } as CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Parallax: translate a block against scroll. Decorative layers only. */
/* ------------------------------------------------------------------ */

export function Parallax({
  children,
  offset = 60,
  className,
}: {
  children: ReactNode
  /** total travel in px across the element's pass through the viewport */
  offset?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  return (
    <motion.div ref={ref} className={className} style={reduced ? undefined : { y }}>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* ScrollProgress: the flame bar under the nav. Mounted once in layout. */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })
  return (
    <motion.div
      aria-hidden="true"
      className="flame fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
      style={{ scaleX }}
    />
  )
}

export type { MotionValue }
