'use client'

import { useRef, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Moon, SlidersHorizontal, Sun } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EASE_OUT } from '@/components/fx/motion'
import { colorThemes, useTheme, type ColorTheme, type Mode } from '@/lib/theme-context'
import { languages, useI18n } from '@/lib/i18n-context'
import { cn } from '@/lib/utils'

const MODES: Mode[] = ['light', 'dark']
const THEME_IDS = Object.keys(colorThemes) as ColorTheme[]

/** Resolves the display name of a colour pair. `flame` is newer than the base dictionary. */
export function themeLabel(t: (key: string) => string, id: ColorTheme) {
  return id === 'flame' ? t('chrome.themeFlame') : t(`settings.themeNames.${id}`)
}

/**
 * The colour pair as an object: flame core + flame tip for the given mode.
 * `split` is one dot cut in two, `dots` is two overlapping dots.
 */
export function ThemeSwatch({
  id,
  mode,
  variant = 'split',
  className,
}: {
  id: ColorTheme
  mode: Mode
  variant?: 'split' | 'dots'
  className?: string
}) {
  const primary = colorThemes[id].primary[mode]
  const heat = colorThemes[id].heat[mode]
  if (variant === 'dots') {
    return (
      <span aria-hidden="true" className={cn('inline-flex shrink-0 items-center', className)}>
        <span className="size-3.5 rounded-full" style={{ backgroundColor: primary }} />
        <span
          className="-ml-1 size-3.5 rounded-full ring-2 ring-popover"
          style={{ backgroundColor: heat }}
        />
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex size-6 shrink-0 rotate-45 overflow-hidden rounded-full', className)}
    >
      <span className="h-full w-1/2" style={{ backgroundColor: primary }} />
      <span className="h-full w-1/2" style={{ backgroundColor: heat }} />
    </span>
  )
}

/** Arrow-key movement inside a radiogroup: selection follows focus, as the pattern expects. */
function useRadioKeys<T>(items: readonly T[], current: T, select: (item: T) => void) {
  const ref = useRef<HTMLDivElement>(null)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.indexOf(current)
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    select(items[next])
    const radios = ref.current?.querySelectorAll<HTMLElement>('[role="radio"]')
    radios?.[next]?.focus()
  }
  return { ref, onKeyDown }
}

export function SettingsPanel({
  onOpenChange,
  className,
}: {
  onOpenChange?: (open: boolean) => void
  className?: string
}) {
  const { mode, colorTheme, setMode, setColorTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const reduced = useReducedMotion()

  const languageCodes = languages.map((l) => l.code)
  const modeKeys = useRadioKeys(MODES, mode, setMode)
  const themeKeys = useRadioKeys(THEME_IDS, colorTheme, setColorTheme)
  const languageKeys = useRadioKeys(languageCodes, language, setLanguage)

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t('settings.open')}
          className={cn(
            'inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground',
            className,
          )}
        >
          <SlidersHorizontal className="size-5" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        collisionPadding={16}
        data-lenis-prevent=""
        className="z-[80] max-h-[var(--radix-popover-content-available-height)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border-border bg-popover p-0 shadow-[var(--shadow-lift)]"
      >
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-display text-sm font-semibold tracking-tight">{t('settings.title')}</h2>
        </div>

        <div className="space-y-5 p-4">
          {/* Mode */}
          <div>
            <p id="settings-mode" className="mb-2 text-sm font-medium">
              {t('settings.mode')}
            </p>
            <div
              ref={modeKeys.ref}
              role="radiogroup"
              aria-labelledby="settings-mode"
              onKeyDown={modeKeys.onKeyDown}
              className="grid grid-cols-2 gap-1 rounded-md bg-secondary p-1"
            >
              {MODES.map((m) => {
                const selected = mode === m
                const Icon = m === 'light' ? Sun : Moon
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setMode(m)}
                    className={cn(
                      'relative inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-3 text-sm transition-colors duration-150',
                      selected
                        ? 'font-semibold text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="settings-mode-thumb"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-sm border border-border bg-card"
                        transition={{ duration: reduced ? 0 : 0.28, ease: EASE_OUT }}
                      />
                    ) : null}
                    <Icon className="relative size-4" aria-hidden="true" />
                    <span className="relative">{t(`settings.${m}`)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Colour pair */}
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p id="settings-colour" className="text-sm font-medium">
                {t('settings.colorTheme')}
              </p>
              <p className="truncate text-sm text-muted-foreground">{themeLabel(t, colorTheme)}</p>
            </div>
            <div
              ref={themeKeys.ref}
              role="radiogroup"
              aria-labelledby="settings-colour"
              onKeyDown={themeKeys.onKeyDown}
              className="flex flex-wrap gap-2"
            >
              {THEME_IDS.map((id) => {
                const selected = colorTheme === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={themeLabel(t, id)}
                    title={themeLabel(t, id)}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setColorTheme(id)}
                    className={cn(
                      'relative inline-flex size-11 items-center justify-center rounded-md border transition-colors duration-150',
                      selected
                        ? 'border-foreground bg-accent'
                        : 'border-transparent hover:border-border hover:bg-accent',
                    )}
                  >
                    <ThemeSwatch id={id} mode={mode} />
                    {selected ? (
                      <span
                        aria-hidden="true"
                        className="absolute inline-flex size-3.5 items-center justify-center rounded-full bg-background text-foreground"
                      >
                        <Check className="size-2.5" strokeWidth={3.5} />
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Language */}
          <div>
            <p id="settings-language" className="mb-2 text-sm font-medium">
              {t('settings.language')}
            </p>
            <div
              ref={languageKeys.ref}
              role="radiogroup"
              aria-labelledby="settings-language"
              onKeyDown={languageKeys.onKeyDown}
              className="grid grid-cols-2 gap-1"
            >
              {languages.map((lang) => {
                const selected = language === lang.code
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      'inline-flex min-h-11 items-center justify-between gap-2 rounded-md px-3 text-left text-sm transition-colors duration-150',
                      selected
                        ? 'bg-accent font-semibold text-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    <span lang={lang.code} className="truncate">
                      {lang.nativeName}
                    </span>
                    {selected ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
