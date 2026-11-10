'use client'

import { Search, X } from 'lucide-react'
import { useId, useRef } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { skillCategories, type SkillCategoryKey } from '@/lib/skills-data'
import { fill } from './format'

export type SkillSort = 'category' | 'level' | 'name'
export type SkillFilter = SkillCategoryKey | 'all'

const sortOptions: SkillSort[] = ['category', 'level', 'name']

export function SkillsToolbar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  shown,
  total,
}: {
  query: string
  onQueryChange: (value: string) => void
  category: SkillFilter
  onCategoryChange: (value: SkillFilter) => void
  sort: SkillSort
  onSortChange: (value: SkillSort) => void
  shown: number
  total: number
}) {
  const { t } = useI18n()
  const searchId = useId()
  const sortLabelId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const clear = () => {
    onQueryChange('')
    inputRef.current?.focus()
  }

  return (
    <div role="search" aria-label={t('skillsPage.toolbar.label')} className="shell py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
        <div className="relative lg:w-80">
          <label htmlFor={searchId} className="sr-only">
            {t('skillsPage.search.label')}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={inputRef}
            id={searchId}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            placeholder={t('skillsPage.search.placeholder')}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault()
                onQueryChange('')
              }
            }}
            className="h-11 w-full rounded-md border border-input bg-card pl-10 pr-11 text-base text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-foreground focus-visible:border-primary focus-visible:outline-offset-0"
          />
          {query ? (
            <button
              type="button"
              onClick={clear}
              aria-label={t('skillsPage.search.clear')}
              className="absolute right-0 top-0 grid size-11 place-items-center rounded-md text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>

        <p aria-live="polite" className="tabular text-sm text-muted-foreground lg:mr-auto">
          {fill(t('skillsPage.results.status'), { shown, total })}
        </p>

        <div className="flex items-center gap-3">
          <span id={sortLabelId} className="text-sm text-muted-foreground">
            {t('skillsPage.sort.label')}
          </span>
          <div
            role="group"
            aria-labelledby={sortLabelId}
            className="flex flex-1 rounded-md border border-border bg-card p-0.5 lg:flex-none"
          >
            {sortOptions.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={sort === option}
                aria-label={t(`skillsPage.sort.${option}Long`)}
                onClick={() => onSortChange(option)}
                className="min-h-10 flex-1 rounded-sm px-3.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:text-background lg:flex-none"
              >
                {t(`skillsPage.sort.${option}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        role="group"
        aria-label={t('skillsPage.filter.label')}
        className="no-scrollbar -mx-[var(--gutter)] mt-3 flex gap-2 overflow-x-auto px-[var(--gutter)] py-1.5 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:py-0"
      >
        <button
          type="button"
          className="chip min-h-11 shrink-0 px-4 lg:min-h-9 lg:px-3.5"
          aria-pressed={category === 'all'}
          onClick={() => onCategoryChange('all')}
        >
          {t('skillsPage.filter.all')}
          <span className="opacity-70">{total}</span>
        </button>
        {skillCategories.map((item) => (
          <button
            key={item.key}
            type="button"
            className="chip min-h-11 shrink-0 px-4 lg:min-h-9 lg:px-3.5"
            aria-pressed={category === item.key}
            onClick={() => onCategoryChange(category === item.key ? 'all' : item.key)}
          >
            {t(`skills.categories.${item.key}.name`)}
            <span className="opacity-70">{item.skills.length}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
