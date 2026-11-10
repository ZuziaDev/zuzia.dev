'use client'

import { motion } from 'framer-motion'
import { CountUp, EASE_OUT, Gauge } from '@/components/fx/motion'
import { cn } from '@/lib/utils'
import { skillRowId, type Skill } from '@/lib/skills-data'

/**
 * One line of the spec sheet: brand mark, name, flame gauge, percentage.
 * Rendered inside an <AnimatePresence>, so it owns its enter / exit / reorder motion.
 */
export function SkillRow({
  skill,
  gaugeLabel,
  rank,
  meta,
  highlighted = false,
}: {
  skill: Skill
  gaugeLabel: string
  /** Position in a ranked list. Only passed when the order itself is information. */
  rank?: number
  /** Secondary line under the name (the category, in the flat lists). */
  meta?: string
  highlighted?: boolean
}) {
  const Icon = skill.icon
  return (
    <motion.li
      layout="position"
      id={skillRowId(skill.id)}
      tabIndex={-1}
      data-highlighted={highlighted || undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.2, ease: EASE_OUT },
        layout: { duration: 0.28, ease: EASE_OUT },
      }}
      className={cn(
        'group relative -mx-3 grid min-h-16 items-center gap-x-4 gap-y-2 rounded-md px-3 py-3.5',
        'grid-cols-[1.25rem_minmax(0,1fr)_3rem] sm:grid-cols-[1.25rem_minmax(0,13rem)_minmax(0,1fr)_3rem] sm:gap-x-5',
        'transition-colors duration-200 hover:bg-accent data-[highlighted]:bg-primary/10',
      )}
    >
      <Icon
        aria-hidden="true"
        className="col-start-1 row-start-1 size-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary group-data-[highlighted]:text-primary"
      />

      <div className="col-start-2 row-start-1 flex min-w-0 items-baseline gap-3">
        {rank !== undefined ? (
          <span className="t-data w-5 shrink-0 text-muted-foreground">{rank}</span>
        ) : null}
        <div className="min-w-0">
          <p className="truncate font-medium leading-snug">{skill.name}</p>
          {meta ? <p className="truncate text-sm leading-snug text-muted-foreground">{meta}</p> : null}
        </div>
      </div>

      <Gauge
        value={skill.level}
        label={gaugeLabel}
        className="col-span-2 col-start-2 row-start-2 sm:col-span-1 sm:col-start-3 sm:row-start-1"
      />

      <CountUp
        value={skill.level}
        suffix="%"
        className="t-data col-start-3 row-start-1 text-right sm:col-start-4"
      />
    </motion.li>
  )
}
