'use client'

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CountUp, EASE_OUT, Reveal, SplitText } from '@/components/fx/motion'
import { fill } from '@/components/skills/format'
import { HeatBoard } from '@/components/skills/heat-board'
import { SkillRow } from '@/components/skills/skill-row'
import { SkillsToolbar, type SkillFilter, type SkillSort } from '@/components/skills/skills-toolbar'
import { useI18n } from '@/lib/i18n-context'
import { allSkills, skillCategories, skillRowId } from '@/lib/skills-data'

const totalSkills = allSkills.length
const totalCategories = skillCategories.length
const averageLevel = totalSkills
  ? Math.round(allSkills.reduce((sum, skill) => sum + skill.level, 0) / totalSkills)
  : 0

const SPLIT = 'grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]'
const STICKY_ASIDE = 'lg:sticky lg:top-[calc(var(--nav-h)+var(--bar-h)+2rem)] lg:self-start'
const FADE = { duration: 0.22, ease: EASE_OUT }

export default function SkillsPage() {
  const { t } = useI18n()
  const reduced = useReducedMotion()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SkillFilter>('all')
  const [sort, setSort] = useState<SkillSort>('category')
  const [target, setTarget] = useState<{ id: string; at: number } | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const needle = query.trim().toLowerCase()

  const visible = useMemo(
    () =>
      allSkills.filter(
        (skill) =>
          (category === 'all' || skill.category === category) &&
          (needle === '' || skill.name.toLowerCase().includes(needle)),
      ),
    [category, needle],
  )
  const visibleIds = useMemo(() => new Set(visible.map((skill) => skill.id)), [visible])

  const groups = useMemo(
    () =>
      skillCategories
        .map((group) => ({ key: group.key, skills: group.skills.filter((skill) => visibleIds.has(skill.id)) }))
        .filter((group) => group.skills.length > 0),
    [visibleIds],
  )

  const flat = useMemo(() => {
    const list = [...visible]
    if (sort === 'level') list.sort((a, b) => b.level - a.level || a.name.localeCompare(b.name, 'en'))
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'en'))
    return list
  }, [visible, sort])

  // The sticky category column sits under the sticky toolbar, whatever height the toolbar wraps to.
  useEffect(() => {
    const bar = barRef.current
    const list = listRef.current
    if (!bar || !list) return
    const sync = () => list.style.setProperty('--bar-h', `${bar.offsetHeight}px`)
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [])

  // A heat-board cell was selected: bring its row into view, then let the highlight fade.
  useEffect(() => {
    if (!target) return
    const frame = requestAnimationFrame(() => {
      const row = document.getElementById(skillRowId(target.id))
      if (!row) return
      row.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
      row.focus({ preventScroll: true })
    })
    const timer = window.setTimeout(() => setHighlightId(null), 2800)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [target, reduced])

  const revealSkill = (id: string) => {
    if (!visibleIds.has(id)) {
      setQuery('')
      setCategory('all')
    }
    setHighlightId(id)
    setTarget({ id, at: Date.now() })
  }

  const categoryName = (key: string) => t(`skills.categories.${key}.name`)
  const countWord = (count: number) => t(count === 1 ? 'skillsPage.count.one' : 'skillsPage.count.other')
  const gaugeLabel = (name: string) => fill(t('skillsPage.row.gauge'), { name })

  const view = visible.length === 0 ? 'empty' : sort
  const summary = [
    { label: t('skillsPage.summary.technologies'), value: totalSkills, suffix: '' },
    { label: t('skillsPage.summary.categories'), value: totalCategories, suffix: '' },
    { label: t('skillsPage.summary.average'), value: averageLevel, suffix: '%' },
  ]

  return (
    <MotionConfig reducedMotion="user">
      <main id="main" className="relative min-h-screen">
        <Navbar />

        <header className="shell pt-[calc(var(--nav-h)+3rem)]">
          <div className="grid items-end gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,9fr)_minmax(0,5fr)]">
            <div>
              <SplitText as="h1" text={t('skills.title')} trigger="mount" className="t-title" />
              <Reveal variant="unblur" delay={0.25} as="p" className="t-lead mt-5">
                {t('skills.subtitle')}
              </Reveal>
            </div>

            <dl aria-label={t('skillsPage.summary.label')} className="border-t border-border">
              {summary.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between gap-6 border-b border-border py-3"
                >
                  <dt className="text-sm text-muted-foreground">{item.label}</dt>
                  <dd className="font-mono text-lg leading-none">
                    <CountUp value={item.value} suffix={item.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <HeatBoard visibleIds={visibleIds} selectedId={highlightId} onSelect={revealSkill} />

        <div ref={listRef} className="mt-12 [--bar-h:8rem] sm:mt-16">
          <div
            ref={barRef}
            className="z-30 border-b border-border bg-background lg:sticky lg:top-[var(--nav-h)]"
          >
            <SkillsToolbar
              query={query}
              onQueryChange={setQuery}
              category={category}
              onCategoryChange={setCategory}
              sort={sort}
              onSortChange={setSort}
              shown={visible.length}
              total={totalSkills}
            />
          </div>

          <div className="shell min-h-[60vh] pb-24 sm:pb-32">
            <AnimatePresence mode="wait" initial={false}>
              {view === 'empty' ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={FADE}
                  className="max-w-xl py-16 sm:py-24"
                >
                  <h2 className="t-heading">{fill(t('skillsPage.empty.title'), { query: query.trim() })}</h2>
                  <p className="mt-3 text-muted-foreground">
                    {category === 'all'
                      ? t('skillsPage.empty.body')
                      : fill(t('skillsPage.empty.bodyInCategory'), { category: categoryName(category) })}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" className="btn btn-primary" onClick={() => setQuery('')}>
                      {t('skillsPage.empty.clear')}
                    </button>
                    {category !== 'all' ? (
                      <button type="button" className="btn btn-ghost" onClick={() => setCategory('all')}>
                        {t('skillsPage.empty.showAll')}
                      </button>
                    ) : null}
                  </div>
                </motion.div>
              ) : view === 'category' ? (
                <motion.div
                  key="category"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={FADE}
                >
                  <AnimatePresence initial={false}>
                    {groups.map((group) => (
                      <motion.section
                        key={group.key}
                        layout="position"
                        aria-labelledby={`category-${group.key}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: FADE, layout: { duration: 0.28, ease: EASE_OUT } }}
                        className={`${SPLIT} border-t border-border py-12 first:border-t-0 lg:py-16`}
                      >
                        <div className={STICKY_ASIDE}>
                          <h2 id={`category-${group.key}`} className="t-heading">
                            {categoryName(group.key)}
                          </h2>
                          <p className="mt-3 max-w-[40ch] text-muted-foreground">
                            {t(`skills.categories.${group.key}.description`)}
                          </p>
                          <p className="mt-5 text-sm text-muted-foreground">
                            <span className="t-data mr-1.5 text-foreground">{group.skills.length}</span>
                            {countWord(group.skills.length)}
                          </p>
                        </div>
                        <ul className="divide-y divide-border">
                          <AnimatePresence initial={false}>
                            {group.skills.map((skill) => (
                              <SkillRow
                                key={skill.id}
                                skill={skill}
                                gaugeLabel={gaugeLabel(skill.name)}
                                highlighted={highlightId === skill.id}
                              />
                            ))}
                          </AnimatePresence>
                        </ul>
                      </motion.section>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.section
                  key={view}
                  aria-labelledby="flat-list-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={FADE}
                  className={`${SPLIT} py-12 lg:py-16`}
                >
                  <div className={STICKY_ASIDE}>
                    <h2 id="flat-list-title" className="t-heading">
                      {t(view === 'level' ? 'skillsPage.flat.levelTitle' : 'skillsPage.flat.nameTitle')}
                    </h2>
                    <p className="mt-3 max-w-[40ch] text-muted-foreground">
                      {t(view === 'level' ? 'skillsPage.flat.levelDescription' : 'skillsPage.flat.nameDescription')}
                    </p>
                    <p className="mt-5 text-sm text-muted-foreground">
                      <span className="t-data mr-1.5 text-foreground">{flat.length}</span>
                      {countWord(flat.length)}
                    </p>
                  </div>
                  <ol className="divide-y divide-border">
                    <AnimatePresence initial={false}>
                      {flat.map((skill, index) => (
                        <SkillRow
                          key={skill.id}
                          skill={skill}
                          gaugeLabel={gaugeLabel(skill.name)}
                          rank={view === 'level' ? index + 1 : undefined}
                          meta={categoryName(skill.category)}
                          highlighted={highlightId === skill.id}
                        />
                      ))}
                    </AnimatePresence>
                  </ol>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Footer />
      </main>
    </MotionConfig>
  )
}
