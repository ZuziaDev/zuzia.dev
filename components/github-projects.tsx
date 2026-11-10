'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowUpRight, CloudOff, GitFork, Hourglass, RotateCw, Search, SearchX, Star, X } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { CountUp, EASE_OUT, Reveal, SplitText } from '@/components/fx/motion'
import { fill } from '@/components/projects/project-meta'
import { useI18n } from '@/lib/i18n-context'
import { GITHUB_USERNAME } from '@/lib/projects-data'
import { cn } from '@/lib/utils'

const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=100`
// The profile README repository is not a project.
const IGNORED_REPO_FULL_NAMES = new Set([`${GITHUB_USERNAME}/${GITHUB_USERNAME}`])
/** Rows shown before "Show all". */
const PAGE_SIZE = 12

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics?: string[]
  updated_at: string
  fork: boolean
  archived: boolean
}

type SortKey = 'stars' | 'updated' | 'name'
const SORT_KEYS: SortKey[] = ['stars', 'updated', 'name']

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; repos: Repository[] }
  | { status: 'error'; kind: 'network' }
  | { status: 'error'; kind: 'rateLimit'; resetAt: number | null }
  | { status: 'error'; kind: 'http'; code: number }

/*
 * GitHub's own language colours (github-linguist), so a dot here matches the dot on github.com.
 * This is the one sanctioned place for raw hex in the Projects area; anything not listed
 * falls back to var(--muted-foreground).
 */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#663399',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Astro: '#ff5a03',
  MDX: '#fcb32c',
  EJS: '#a91e50',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Lua: '#000080',
  Shell: '#89e051',
  PowerShell: '#012456',
  Batchfile: '#C1F12E',
  Dockerfile: '#384d54',
  'Jupyter Notebook': '#DA5B0B',
}

function LanguageDot({ language }: { language: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-2.5 shrink-0 rounded-full ring-1 ring-border"
      style={{ background: LANGUAGE_COLORS[language] ?? 'var(--muted-foreground)' }}
    />
  )
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
]

function relativeTime(iso: string, now: number, formatter: Intl.RelativeTimeFormat): string {
  const seconds = (new Date(iso).getTime() - now) / 1000
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)
  }
  return formatter.format(0, 'minute')
}

/** Column template shared by the header, the rows and the skeleton, from lg up. */
const COLUMNS =
  'lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)_8.5rem_4rem_4rem_7.5rem] lg:items-center lg:gap-x-6'

function SkeletonRows() {
  const bar = 'h-3 animate-pulse rounded-sm bg-secondary'
  return (
    <ul role="list" aria-hidden="true" className="border-t border-border">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className={cn('border-b border-border px-3 py-4 lg:py-3.5', COLUMNS)}>
          <div className={cn(bar, 'h-3.5', i % 2 === 0 ? 'w-40' : 'w-28')} />
          <div className={cn(bar, 'mt-3 w-full max-w-md lg:mt-0', i % 3 === 0 && 'max-w-xs')} />
          <div className="mt-4 flex items-center gap-5 lg:contents">
            <div className={cn(bar, 'w-20')} />
            <div className={cn(bar, 'w-8 lg:justify-self-end')} />
            <div className={cn(bar, 'w-8 lg:justify-self-end')} />
            <div className={cn(bar, 'w-16 lg:justify-self-end')} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function GitHubProjects() {
  const { t, language: locale } = useI18n()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [query, setQuery] = useState('')
  const [languageFilter, setLanguageFilter] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('stars')
  const [hideForks, setHideForks] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [now] = useState(() => Date.now())

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          // Unauthenticated calls are rate limited per IP; GitHub answers 403 or 429 when it is spent.
          if (response.status === 403 || response.status === 429) {
            const reset = Number(response.headers.get('x-ratelimit-reset'))
            setState({
              status: 'error',
              kind: 'rateLimit',
              resetAt: Number.isFinite(reset) && reset > 0 ? reset * 1000 : null,
            })
          } else {
            setState({ status: 'error', kind: 'http', code: response.status })
          }
          return
        }
        const data = (await response.json()) as Repository[]
        setState({
          status: 'ready',
          repos: data.filter((repo) => !IGNORED_REPO_FULL_NAMES.has(repo.full_name)),
        })
      } catch {
        if (controller.signal.aborted) return
        setState({ status: 'error', kind: 'network' })
      }
    }

    load()
    return () => controller.abort()
  }, [attempt])

  const retry = () => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }

  const repos = state.status === 'ready' ? state.repos : null

  const formatters = useMemo(
    () => ({
      relative: new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
      date: new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
      time: new Intl.DateTimeFormat(locale, { timeStyle: 'short' }),
      number: new Intl.NumberFormat(locale),
    }),
    [locale],
  )

  const summary = useMemo(() => {
    if (!repos) return null
    return {
      repos: repos.length,
      stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      languages: new Set(repos.map((repo) => repo.language).filter(Boolean)).size,
    }
  }, [repos])

  const pool = useMemo(
    () => (repos ? (hideForks ? repos.filter((repo) => !repo.fork) : repos) : []),
    [repos, hideForks],
  )

  const languages = useMemo(() => {
    const counts = new Map<string, number>()
    for (const repo of pool) {
      if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [pool])

  // A language can vanish from the pool when forks are hidden; then the filter no longer applies.
  const activeLanguage =
    languageFilter && languages.some((entry) => entry.name === languageFilter) ? languageFilter : null

  const matches = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    const filtered = pool.filter((repo) => {
      if (activeLanguage && repo.language !== activeLanguage) return false
      if (terms.length === 0) return true
      const haystack = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase()
      return terms.every((term) => haystack.includes(term))
    })
    return filtered.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'updated') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
      return b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name)
    })
  }, [pool, activeLanguage, query, sort])

  const rows = expanded ? matches : matches.slice(0, PAGE_SIZE)
  const filtersActive = query.trim() !== '' || activeLanguage !== null || hideForks

  const clearFilters = () => {
    setQuery('')
    setLanguageFilter(null)
    setHideForks(false)
  }

  const errorMessage = () => {
    if (state.status !== 'error') return ''
    if (state.kind === 'network') return t('projectsPage.repos.error.network')
    if (state.kind === 'http') return fill(t('projectsPage.repos.error.http'), { status: state.code })
    return state.resetAt
      ? fill(t('projectsPage.repos.error.rateLimitUntil'), {
          time: formatters.time.format(new Date(state.resetAt)),
        })
      : t('projectsPage.repos.error.rateLimit')
  }

  const hitArea = 'relative after:absolute after:inset-x-0 after:-inset-y-1.5'

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="repositories"
        aria-labelledby="repositories-title"
        className="shell scroll-mt-[calc(var(--nav-h)+1.5rem)] py-24 sm:py-32"
      >
        {/* Heading and numbers computed from the fetched data */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <h2 id="repositories-title" className="t-title">
              <SplitText text={t('projectsPage.repos.title')} />
            </h2>
            <Reveal variant="slide" delay={0.1}>
              <p className="t-lead mt-5">{t('projectsPage.repos.lead')}</p>
            </Reveal>
            <Reveal variant="slide" delay={0.18}>
              <a
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('projectsPage.repos.profile')}, @${GITHUB_USERNAME} (${t('projectsPage.newTab')})`}
                className="group mt-3 inline-flex min-h-11 items-center gap-2 font-mono text-sm"
              >
                <SiGithub aria-hidden="true" className="size-4" />
                <span className="link-draw">@{GITHUB_USERNAME}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Reveal>
          </div>

          {state.status !== 'error' ? (
            <dl className="grid grid-cols-3 gap-4 border-t border-border pt-5 sm:gap-8 lg:col-span-5">
              {(['repos', 'stars', 'languages'] as const).map((key) => (
                <div key={key} className="flex min-w-0 flex-col-reverse gap-1">
                  <dt className="text-xs text-muted-foreground sm:text-sm">
                    {t(`projectsPage.repos.summary.${key}`)}
                  </dt>
                  <dd className="font-mono text-2xl font-medium sm:text-3xl">
                    {summary ? (
                      <CountUp key={`${key}-${summary[key]}`} value={summary[key]} />
                    ) : (
                      <span aria-hidden="true" className="block h-[1em] w-12 animate-pulse rounded-sm bg-secondary" />
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {state.status === 'error' ? (
          <div role="alert" className="mt-12 border-y border-border py-10 sm:py-14">
            {state.kind === 'rateLimit' ? (
              <Hourglass aria-hidden="true" className="size-6 text-heat" />
            ) : (
              <CloudOff aria-hidden="true" className="size-6 text-heat" />
            )}
            <h3 className="t-heading mt-4">{t('projectsPage.repos.error.title')}</h3>
            <p className="mt-2 max-w-[60ch] text-muted-foreground">{errorMessage()}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={retry} className="btn btn-primary">
                <RotateCw aria-hidden="true" className="size-4" />
                {t('projectsPage.repos.error.retry')}
              </button>
              <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <SiGithub aria-hidden="true" className="size-4" />
                {t('projectsPage.repos.profile')}
                <span className="sr-only">({t('projectsPage.newTab')})</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-12 sm:mt-16" aria-busy={state.status === 'loading'}>
            {/* Controls */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <div className="relative min-w-0 lg:flex-1">
                <label htmlFor="repo-search" className="sr-only">
                  {t('projectsPage.repos.searchLabel')}
                </label>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="repo-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('projectsPage.repos.searchPlaceholder')}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={!repos}
                  className="h-11 w-full rounded-md border border-input bg-card pl-10 pr-11 text-[0.9375rem] text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-foreground focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60 [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t('projectsPage.repos.clearSearch')}
                    className="absolute right-0 top-0 grid size-11 place-items-center text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <div
                  role="group"
                  aria-label={t('projectsPage.repos.sortLabel')}
                  className="inline-flex h-11 items-stretch rounded-md border border-border bg-card p-1"
                >
                  {SORT_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={sort === key}
                      disabled={!repos}
                      onClick={() => setSort(key)}
                      className={cn(
                        hitArea,
                        'rounded-sm px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 disabled:cursor-not-allowed aria-pressed:text-background aria-[pressed=false]:hover:text-foreground',
                      )}
                    >
                      {sort === key ? (
                        <motion.span
                          layoutId="repo-sort-indicator"
                          className="absolute inset-0 rounded-sm bg-foreground"
                          transition={{ duration: 0.24, ease: EASE_OUT }}
                        />
                      ) : null}
                      <span className="relative">{t(`projectsPage.repos.sort.${key}`)}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={hideForks}
                  disabled={!repos}
                  onClick={() => setHideForks((value) => !value)}
                  className="inline-flex min-h-11 items-center gap-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200',
                      hideForks ? 'border-foreground bg-foreground' : 'border-border bg-secondary',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-1/2 size-3.5 -translate-y-1/2 rounded-full transition-[translate,background-color] duration-200 ease-[var(--ease-out)]',
                        hideForks ? 'translate-x-4 bg-background' : 'bg-muted-foreground',
                      )}
                    />
                  </span>
                  {t('projectsPage.repos.hideForks')}
                </button>
              </div>
            </div>

            {/* Language filter: scrolls sideways inside its own strip on small screens */}
            {repos && languages.length > 0 ? (
              <div
                role="group"
                aria-label={t('projectsPage.repos.languageLabel')}
                className="no-scrollbar -mx-[var(--gutter)] mt-3 flex gap-2 overflow-x-auto px-[var(--gutter)] py-2 lg:mx-0 lg:flex-wrap lg:px-0"
              >
                <button
                  type="button"
                  aria-pressed={activeLanguage === null}
                  onClick={() => setLanguageFilter(null)}
                  className={cn('chip min-h-8! shrink-0 px-3!', hitArea)}
                >
                  {t('projectsPage.repos.allLanguages')}
                  <span className="opacity-70">{pool.length}</span>
                </button>
                {languages.map((entry) => (
                  <button
                    key={entry.name}
                    type="button"
                    aria-pressed={activeLanguage === entry.name}
                    onClick={() => setLanguageFilter(activeLanguage === entry.name ? null : entry.name)}
                    className={cn('chip min-h-8! shrink-0 px-3!', hitArea)}
                  >
                    <LanguageDot language={entry.name} />
                    {entry.name}
                    <span className="opacity-70">{entry.count}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {/* Live result count */}
            <div className="mt-4 flex min-h-11 flex-wrap items-center justify-between gap-x-6">
              <p aria-live="polite" className="tabular text-sm text-muted-foreground">
                {repos
                  ? fill(t('projectsPage.repos.count'), {
                      shown: formatters.number.format(matches.length),
                      total: formatters.number.format(repos.length),
                    })
                  : t('projectsPage.repos.loading')}
              </p>
              {repos && filtersActive && matches.length > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium"
                >
                  <X aria-hidden="true" className="size-4" />
                  <span className="link-draw">{t('projectsPage.repos.empty.clear')}</span>
                </button>
              ) : null}
            </div>

            {/* Column heads, table layout only */}
            <div
              aria-hidden="true"
              className={cn('hidden px-3 pb-3 text-xs font-medium text-muted-foreground', COLUMNS)}
            >
              <span>{t('projectsPage.repos.col.name')}</span>
              <span>{t('projectsPage.repos.col.description')}</span>
              <span>{t('projectsPage.repos.col.language')}</span>
              <span className="text-right">{t('projectsPage.repos.col.stars')}</span>
              <span className="text-right">{t('projectsPage.repos.col.forks')}</span>
              <span className="text-right">{t('projectsPage.repos.col.updated')}</span>
            </div>

            {!repos ? (
              <SkeletonRows />
            ) : matches.length === 0 ? (
              <div className="border-y border-border py-12 sm:py-16">
                <SearchX aria-hidden="true" className="size-6 text-muted-foreground" />
                <h3 className="t-heading mt-4">{t('projectsPage.repos.empty.title')}</h3>
                <p className="mt-2 text-muted-foreground">{t('projectsPage.repos.empty.body')}</p>
                <button type="button" onClick={clearFilters} className="btn btn-ghost mt-6">
                  <X aria-hidden="true" className="size-4" />
                  {t('projectsPage.repos.empty.clear')}
                </button>
              </div>
            ) : (
              <motion.ul
                role="list"
                className="relative border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {rows.map((repo) => (
                    <motion.li
                      key={repo.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.26, ease: EASE_OUT }}
                      className="border-b border-border bg-background"
                    >
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'group block px-3 py-4 transition-colors duration-200 hover:bg-accent focus-visible:bg-accent lg:py-3.5',
                          COLUMNS,
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-mono text-sm font-medium">{repo.name}</span>
                          {repo.fork ? (
                            <span className="chip shrink-0">
                              <GitFork aria-hidden="true" className="size-3" />
                              {t('projectsPage.repos.fork')}
                            </span>
                          ) : null}
                          {repo.archived ? (
                            <span className="chip shrink-0">{t('projectsPage.repos.archived')}</span>
                          ) : null}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="ml-auto size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-200 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                          />
                        </span>

                        <span className="mt-1.5 block text-sm text-muted-foreground max-lg:line-clamp-2 lg:mt-0 lg:truncate">
                          {repo.description || t('projectsPage.repos.noDescription')}
                        </span>

                        <span className="t-data mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-muted-foreground lg:contents">
                          <span
                            className={cn(
                              'inline-flex min-w-0 items-center gap-1.5',
                              !repo.language && 'max-lg:hidden',
                            )}
                          >
                            {repo.language ? (
                              <>
                                <LanguageDot language={repo.language} />
                                <span className="sr-only">{t('projectsPage.repos.col.language')}:</span>
                                <span className="truncate">{repo.language}</span>
                              </>
                            ) : null}
                          </span>
                          <span className="inline-flex items-center gap-1 lg:justify-end">
                            <Star aria-hidden="true" className="size-3.5" />
                            <span className="sr-only">{t('projectsPage.repos.col.stars')}:</span>
                            {formatters.number.format(repo.stargazers_count)}
                          </span>
                          <span className="inline-flex items-center gap-1 lg:justify-end">
                            <GitFork aria-hidden="true" className="size-3.5" />
                            <span className="sr-only">{t('projectsPage.repos.col.forks')}:</span>
                            {formatters.number.format(repo.forks_count)}
                          </span>
                          <time
                            dateTime={repo.updated_at}
                            title={formatters.date.format(new Date(repo.updated_at))}
                            className="lg:text-right"
                          >
                            <span className="sr-only">{t('projectsPage.repos.col.updated')}:</span>
                            {relativeTime(repo.updated_at, now, formatters.relative)}
                          </time>
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}

            {repos && matches.length > PAGE_SIZE ? (
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
                className="btn btn-ghost mt-8"
              >
                {expanded
                  ? t('projectsPage.repos.showFewer')
                  : fill(t('projectsPage.repos.showAll'), {
                      count: formatters.number.format(matches.length),
                    })}
              </button>
            ) : null}
          </div>
        )}
      </section>
    </MotionConfig>
  )
}
