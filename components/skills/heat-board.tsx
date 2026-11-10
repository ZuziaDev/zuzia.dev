'use client'

import { motion } from 'framer-motion'
import { useRef, useState, type KeyboardEvent } from 'react'
import { EASE_OUT } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import { allSkills, heatColor, skillCategories } from '@/lib/skills-data'
import { cn } from '@/lib/utils'
import { fill } from './format'

/**
 * The heat board: every technology as one cell, coloured from flame core (low) to flame tip (high).
 * One tab stop; arrow keys move between cells. Selecting a cell asks the page to reveal that row.
 */
export function HeatBoard({
  visibleIds,
  selectedId,
  onSelect,
}: {
  /** Cells outside the current search / filter are dimmed, not removed. */
  visibleIds: ReadonlySet<string>
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { t } = useI18n()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tabId, setTabId] = useState(allSkills[0]?.id ?? '')
  const cells = useRef(new Map<string, HTMLButtonElement>())

  const active = activeId ? allSkills.find((skill) => skill.id === activeId) : undefined
  const categoryName = (key: string) => t(`skills.categories.${key}.name`)

  const focusCell = (id: string | undefined) => {
    if (!id) return
    setTabId(id)
    cells.current.get(id)?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = allSkills.findIndex((skill) => skill.id === tabId)
    if (index === -1) return
    const groupIndex = skillCategories.findIndex((c) => c.key === allSkills[index].category)
    let next: string | undefined
    switch (event.key) {
      case 'ArrowRight':
        next = allSkills[Math.min(index + 1, allSkills.length - 1)].id
        break
      case 'ArrowLeft':
        next = allSkills[Math.max(index - 1, 0)].id
        break
      case 'ArrowDown':
        next = skillCategories[Math.min(groupIndex + 1, skillCategories.length - 1)].skills[0]?.id
        break
      case 'ArrowUp':
        next = skillCategories[Math.max(groupIndex - 1, 0)].skills[0]?.id
        break
      case 'Home':
        next = allSkills[0].id
        break
      case 'End':
        next = allSkills[allSkills.length - 1].id
        break
      default:
        return
    }
    event.preventDefault()
    focusCell(next)
  }

  let order = 0

  return (
    <section aria-labelledby="heat-board-title" className="shell mt-16 sm:mt-24">
      <div className="grid gap-x-16 gap-y-10 border-y border-border py-10 sm:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
        <div>
          <h2 id="heat-board-title" className="t-heading">
            {t('skillsPage.board.title')}
          </h2>
          <p className="mt-3 max-w-[42ch] text-muted-foreground">{t('skillsPage.board.description')}</p>

          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{t('skillsPage.board.legendLow')}</span>
            <span aria-hidden="true" className="flame h-1.5 w-28 rounded-full" />
            <span>{t('skillsPage.board.legendHigh')}</span>
          </div>

          <p className="mt-6 max-w-[42ch] text-sm text-muted-foreground">{t('skillsPage.note')}</p>
        </div>

        <div className="min-w-0">
          <div
            role="toolbar"
            aria-label={t('skillsPage.board.groupLabel')}
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-x-8 gap-y-6"
          >
            {skillCategories.map((category) => (
              <div key={category.key} role="group" aria-label={categoryName(category.key)}>
                <p aria-hidden="true" className="mb-2 text-sm text-muted-foreground">
                  {categoryName(category.key)}
                </p>
                <div className="flex flex-wrap gap-1">
                  {category.skills.map((skill) => {
                    const Icon = skill.icon
                    const i = order++
                    const dimmed = !visibleIds.has(skill.id)
                    const selected = selectedId === skill.id
                    return (
                      <button
                        key={skill.id}
                        ref={(node) => {
                          if (node) cells.current.set(skill.id, node)
                          else cells.current.delete(skill.id)
                        }}
                        type="button"
                        tabIndex={tabId === skill.id ? 0 : -1}
                        aria-label={fill(t('skillsPage.board.cellLabel'), {
                          name: skill.name,
                          level: skill.level,
                          category: categoryName(skill.category),
                        })}
                        onClick={() => {
                          setTabId(skill.id)
                          onSelect(skill.id)
                        }}
                        onFocus={() => {
                          setTabId(skill.id)
                          setActiveId(skill.id)
                        }}
                        onBlur={() => setActiveId((id) => (id === skill.id ? null : id))}
                        onPointerEnter={() => setActiveId(skill.id)}
                        onPointerLeave={() => setActiveId((id) => (id === skill.id ? null : id))}
                        className={cn(
                          'relative size-11 rounded-sm transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          'hover:-translate-y-1 focus-visible:-translate-y-1',
                          dimmed && 'opacity-30 hover:opacity-100 focus-visible:opacity-100',
                          selected && 'outline-2 outline-offset-2 outline-foreground',
                        )}
                      >
                        <motion.span
                          aria-hidden="true"
                          className="grid size-full place-items-center rounded-sm text-primary-foreground"
                          style={{ backgroundColor: heatColor(skill.level) }}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.25 + i * 0.022, ease: EASE_OUT }}
                        >
                          <Icon className="size-[1.125rem]" />
                        </motion.span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex min-h-12 items-center border-t border-border pt-4">
            {active ? (
              <p className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium">{active.name}</span>
                <span className="t-data">{active.level}%</span>
                <span className="text-sm text-muted-foreground">{categoryName(active.category)}</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{t('skillsPage.board.hint')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
