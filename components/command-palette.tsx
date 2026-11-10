'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  CornerDownLeft,
  FolderOpen,
  Gauge,
  House,
  Languages,
  Link2,
  Milestone,
  Moon,
  PenLine,
  Sun,
  Terminal,
  User,
  type LucideIcon,
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ThemeSwatch, themeLabel } from '@/components/settings-panel'
import { colorThemes, useTheme, type ColorTheme } from '@/lib/theme-context'
import { languages, useI18n } from '@/lib/i18n-context'
import { projects } from '@/lib/projects-data'
import { socialLinks } from '@/lib/site'

/** Fired on `window` to open the palette from anywhere (the navbar trigger uses it). */
export const COMMAND_EVENT = 'zuzia:command'

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(COMMAND_EVENT))
}

const THEME_IDS = Object.keys(colorThemes) as ColorTheme[]

const destinations: { key: string; href: string; icon: LucideIcon }[] = [
  { key: 'nav.home', href: '/', icon: House },
  { key: 'nav.about', href: '/#about', icon: User },
  { key: 'chrome.palette.journey', href: '/#journey', icon: Milestone },
  { key: 'nav.skills', href: '/skills', icon: Gauge },
  { key: 'nav.projects', href: '/projects', icon: FolderOpen },
  { key: 'nav.blog', href: '/blog', icon: PenLine },
  { key: 'nav.contact', href: '/contact', icon: Terminal },
]

const itemClass =
  'min-h-11 cursor-pointer gap-3 rounded-md px-3 py-2 text-sm data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground'

const groupClass =
  'p-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="t-data inline-flex h-6 min-w-6 items-center justify-center rounded-sm border border-border bg-secondary px-1.5 text-muted-foreground">
      {children}
    </kbd>
  )
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const closeTimer = useRef<number | undefined>(undefined)
  const router = useRouter()
  const { mode, colorTheme, setMode, setColorTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(COMMAND_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(COMMAND_EVENT, onOpen)
    }
  }, [])

  // Smooth scroll (Lenis) ignores the wheel while this attribute is on the body,
  // so the page behind the palette does not move.
  useEffect(() => {
    if (!open) return
    document.body.setAttribute('data-lenis-prevent', '')
    return () => document.body.removeAttribute('data-lenis-prevent')
  }, [open])

  useEffect(() => {
    if (open) return
    window.clearTimeout(closeTimer.current)
    setCopyState('idle')
  }, [open])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  /** Every action closes the palette once it has run. */
  const run = useCallback((action: () => void) => {
    setOpen(false)
    action()
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    // Stay open just long enough for the confirmation to be read, then close.
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 900)
  }

  const copyLabel =
    copyState === 'copied'
      ? t('chrome.palette.copied')
      : copyState === 'failed'
        ? t('chrome.palette.copyFailed')
        : t('chrome.palette.copyLink')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent=""
        className="top-[max(1rem,12vh)] translate-y-0 gap-0 overflow-hidden rounded-lg border-border bg-popover p-0 text-popover-foreground shadow-[var(--shadow-lift)] sm:max-w-xl"
      >
        <DialogTitle className="sr-only">{t('chrome.palette.title')}</DialogTitle>
        <DialogDescription className="sr-only">{t('chrome.palette.description')}</DialogDescription>

        <Command
          loop
          label={t('chrome.palette.title')}
          className="rounded-none bg-transparent **:data-[slot=command-input-wrapper]:h-14 **:data-[slot=command-input-wrapper]:gap-3 **:data-[slot=command-input-wrapper]:px-4"
        >
          <CommandInput placeholder={t('chrome.palette.placeholder')} className="h-14 text-base" />

          <CommandList className="max-h-[min(58vh,26rem)] scroll-py-2">
            <CommandEmpty className="px-6 py-10 text-center text-sm text-muted-foreground">
              {t('chrome.palette.empty')}
            </CommandEmpty>

            <CommandGroup heading={t('chrome.palette.goTo')} className={groupClass}>
              {destinations.map(({ key, href, icon: Icon }) => (
                <CommandItem
                  key={href}
                  value={`go ${href}`}
                  keywords={[t(key), t('chrome.palette.goTo')]}
                  onSelect={() => run(() => router.push(href))}
                  className={itemClass}
                >
                  <Icon aria-hidden="true" />
                  <span>{t(key)}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading={t('chrome.palette.projects')} className={groupClass}>
              {projects.map((project) => (
                <CommandItem
                  key={project.key}
                  value={`project ${project.key}`}
                  keywords={[t(`projects.items.${project.key}.title`), ...project.techStack]}
                  onSelect={() => run(() => router.push('/projects'))}
                  className={itemClass}
                >
                  <FolderOpen aria-hidden="true" />
                  <span className="truncate">{t(`projects.items.${project.key}.title`)}</span>
                  <span className="t-data ml-auto hidden truncate text-muted-foreground sm:inline">
                    {project.techStack.slice(0, 2).join(', ')}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading={t('chrome.palette.appearance')} className={groupClass}>
              <CommandItem
                value="appearance light"
                keywords={[t('chrome.palette.switchLight'), t('settings.light'), t('settings.mode')]}
                onSelect={() => run(() => setMode('light'))}
                className={itemClass}
              >
                <Sun aria-hidden="true" />
                <span>{t('chrome.palette.switchLight')}</span>
                {mode === 'light' ? <CurrentMark label={t('chrome.palette.current')} /> : null}
              </CommandItem>
              <CommandItem
                value="appearance dark"
                keywords={[t('chrome.palette.switchDark'), t('settings.dark'), t('settings.mode')]}
                onSelect={() => run(() => setMode('dark'))}
                className={itemClass}
              >
                <Moon aria-hidden="true" />
                <span>{t('chrome.palette.switchDark')}</span>
                {mode === 'dark' ? <CurrentMark label={t('chrome.palette.current')} /> : null}
              </CommandItem>
              {THEME_IDS.map((id) => (
                <CommandItem
                  key={id}
                  value={`colour ${id}`}
                  keywords={[themeLabel(t, id), t('chrome.palette.colour'), t('settings.colorTheme')]}
                  onSelect={() => run(() => setColorTheme(id))}
                  className={itemClass}
                >
                  <span className="inline-flex w-4 justify-center">
                    <ThemeSwatch id={id} mode={mode} variant="dots" />
                  </span>
                  <span className="pl-1">
                    <span className="text-muted-foreground">{t('chrome.palette.colour')}</span>{' '}
                    {themeLabel(t, id)}
                  </span>
                  {colorTheme === id ? <CurrentMark label={t('chrome.palette.current')} /> : null}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading={t('chrome.palette.language')} className={groupClass}>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={`language ${lang.code}`}
                  keywords={[lang.nativeName, lang.name, t(`settings.languageNames.${lang.code}`)]}
                  onSelect={() => run(() => setLanguage(lang.code))}
                  className={itemClass}
                >
                  <Languages aria-hidden="true" />
                  <span lang={lang.code}>{lang.nativeName}</span>
                  {language === lang.code ? (
                    <CurrentMark label={t('chrome.palette.current')} />
                  ) : (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {t(`settings.languageNames.${lang.code}`)}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading={t('chrome.palette.links')} className={groupClass}>
              {socialLinks.map(({ icon: Icon, href, labelKey }) => (
                <CommandItem
                  key={href}
                  value={`link ${href}`}
                  keywords={[t(labelKey), t('chrome.palette.links')]}
                  onSelect={() => run(() => window.open(href, '_blank', 'noopener,noreferrer'))}
                  className={itemClass}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                  <span>{t(labelKey)}</span>
                  <span className="sr-only">({t('chrome.contact.opensNewTab')})</span>
                  <ArrowUpRight aria-hidden="true" className="ml-auto" />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading={t('chrome.palette.site')} className={groupClass}>
              <CommandItem
                value="copy site link"
                keywords={[t('chrome.palette.copyLink')]}
                onSelect={copyLink}
                className={itemClass}
              >
                {copyState === 'copied' ? (
                  <Check aria-hidden="true" className="text-primary" />
                ) : (
                  <Link2 aria-hidden="true" />
                )}
                <span aria-live="polite">{copyLabel}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>

          <div className="hidden items-center gap-5 border-t border-border px-4 py-2.5 text-xs text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <Key>
                <ArrowUp className="size-3" aria-hidden="true" />
              </Key>
              <Key>
                <ArrowDown className="size-3" aria-hidden="true" />
              </Key>
              {t('chrome.palette.navigate')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Key>
                <CornerDownLeft className="size-3" aria-hidden="true" />
              </Key>
              {t('chrome.palette.select')}
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5">
              <Key>Esc</Key>
              {t('chrome.palette.close')}
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CurrentMark({ label }: { label: string }) {
  return (
    <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Check aria-hidden="true" className="size-3.5" />
      {label}
    </span>
  )
}
