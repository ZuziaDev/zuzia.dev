'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { SettingsPanel } from '@/components/settings-panel'
import { openCommandPalette } from '@/components/command-palette'
import { EASE_OUT } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import { LOGO_URL, SITE_NAME, navLinks, socialLinks } from '@/lib/site'
import { cn } from '@/lib/utils'

const MENU_ID = 'site-menu'

/** "/#about" belongs to the home page; every other link owns its route and anything beneath it. */
function isActive(href: string, pathname: string) {
  const path = href.split('#')[0] || '/'
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(`${path}/`)
}

function Brand({ onClick, label }: { onClick?: () => void; label: string }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${SITE_NAME}, ${label}`}
      className="flex min-h-11 min-w-0 items-center gap-2.5"
    >
      <Image
        src={LOGO_URL}
        alt=""
        width={32}
        height={32}
        priority
        className="size-8 shrink-0 object-contain"
      />
      <span className="truncate font-display text-[0.9375rem] font-bold tracking-[-0.02em]">
        {SITE_NAME}
      </span>
    </Link>
  )
}

const iconButton =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground'

export function Navbar() {
  const { t } = useI18n()
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent))
    setScrolled(window.scrollY > 8)
  }, [])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 8)
    if (latest < 96) {
      setHidden(false)
      return
    }
    const delta = latest - previous
    if (delta > 6) {
      // Never slide away from under the keyboard user or an open panel.
      const focusInside = headerRef.current?.contains(document.activeElement) ?? false
      if (!focusInside) setHidden(true)
    } else if (delta < -6) {
      setHidden(false)
    }
  })

  // The sheet is a small-screen pattern: close it if the viewport grows past the breakpoint.
  useEffect(() => {
    if (!menuOpen) return
    const query = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (query.matches) setMenuOpen(false)
    }
    query.addEventListener('change', onChange)
    // Smooth scroll (Lenis) ignores the wheel while this is set, so the page behind stays put.
    document.body.setAttribute('data-lenis-prevent', '')
    return () => {
      query.removeEventListener('change', onChange)
      document.body.removeAttribute('data-lenis-prevent')
    }
  }, [menuOpen])

  const visible = !hidden || menuOpen || settingsOpen || Boolean(reduced)

  const openPalette = () => {
    setMenuOpen(false)
    openCommandPalette()
  }

  return (
    <motion.header
      ref={headerRef}
      initial={false}
      animate={{ y: visible ? '0%' : '-100%' }}
      transition={{ duration: reduced ? 0 : 0.42, ease: EASE_OUT }}
      onFocusCapture={() => setHidden(false)}
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] border-b bg-background transition-[border-color] duration-200',
        scrolled ? 'border-border' : 'border-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-10 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-primary focus:px-4 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        {t('chrome.nav.skip')}
      </a>

      <nav
        aria-label={t('chrome.nav.primary')}
        className="shell flex h-full items-center justify-between gap-3 lg:gap-6"
      >
        <Brand label={t('chrome.nav.home')} />

        {/* Desktop links */}
        <ul className="hidden items-center lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex h-11 items-center whitespace-nowrap px-3 text-sm transition-colors duration-150 xl:px-4',
                    active
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(link.nameKey)}
                  {active ? (
                    <motion.span
                      layoutId="nav-flame"
                      aria-hidden="true"
                      className="flame absolute inset-x-3 bottom-1 h-0.5 rounded-full xl:inset-x-4"
                      transition={{ duration: reduced ? 0 : 0.5, ease: EASE_OUT }}
                    />
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={openPalette}
            aria-label={t('chrome.nav.openPalette')}
            aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-transparent px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground xl:border-border xl:hover:border-foreground"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden xl:inline">{t('chrome.nav.search')}</span>
            <kbd className="t-data hidden h-6 items-center rounded-sm border border-border bg-secondary px-1.5 xl:inline-flex">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>
          <SettingsPanel onOpenChange={setSettingsOpen} />
          <Link href="/contact" className="btn btn-primary ml-1">
            {t('hero.contactMe')}
          </Link>
        </div>

        {/* Small screens */}
        <div className="flex shrink-0 items-center lg:hidden">
          <button
            type="button"
            onClick={openPalette}
            aria-label={t('chrome.nav.openPalette')}
            className={iconButton}
          >
            <Search className="size-5" aria-hidden="true" />
          </button>

          <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogPrimitive.Trigger asChild>
              <button
                type="button"
                aria-label={t('chrome.nav.openMenu')}
                aria-controls={MENU_ID}
                aria-expanded={menuOpen}
                className={cn(iconButton, '-mr-2 text-foreground')}
              >
                <Menu className="size-6" aria-hidden="true" />
              </button>
            </DialogPrimitive.Trigger>

            <AnimatePresence>
              {menuOpen ? (
                <DialogPrimitive.Portal forceMount>
                  <DialogPrimitive.Content
                    asChild
                    forceMount
                    id={MENU_ID}
                    aria-describedby={undefined}
                  >
                    <motion.div
                      data-lenis-prevent=""
                      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-background text-foreground"
                      initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
                      animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
                      exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
                      transition={{ duration: reduced ? 0.12 : 0.5, ease: EASE_OUT }}
                    >
                      <div className="shell flex h-[var(--nav-h)] shrink-0 items-center justify-between gap-3 border-b border-border">
                        <Brand label={t('chrome.nav.home')} onClick={() => setMenuOpen(false)} />
                        <div className="flex shrink-0 items-center">
                          <SettingsPanel />
                          <DialogPrimitive.Close asChild>
                            <button
                              type="button"
                              aria-label={t('chrome.nav.closeMenu')}
                              className={cn(iconButton, '-mr-2 text-foreground')}
                            >
                              <X className="size-6" aria-hidden="true" />
                            </button>
                          </DialogPrimitive.Close>
                        </div>
                      </div>

                      <DialogPrimitive.Title className="sr-only">
                        {t('chrome.nav.menuTitle')}
                      </DialogPrimitive.Title>

                      <nav aria-label={t('chrome.nav.primary')} className="shell flex-1 py-6">
                        <ul>
                          {navLinks.map((link, index) => {
                            const active = isActive(link.href, pathname)
                            return (
                              <li key={link.href} className="overflow-hidden border-b border-border">
                                <motion.div
                                  initial={reduced ? false : { y: '105%' }}
                                  animate={{ y: '0%' }}
                                  transition={{
                                    duration: 0.7,
                                    delay: 0.12 + index * 0.055,
                                    ease: EASE_OUT,
                                  }}
                                >
                                  <Link
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    aria-current={active ? 'page' : undefined}
                                    className="group flex min-h-16 items-center justify-between gap-4 py-3"
                                  >
                                    <span className="font-display text-[clamp(1.75rem,8.5vw,3rem)] font-bold leading-none tracking-[-0.03em]">
                                      {t(link.nameKey)}
                                    </span>
                                    {active ? (
                                      <span
                                        aria-hidden="true"
                                        className="flame h-1 w-10 shrink-0 rounded-full"
                                      />
                                    ) : (
                                      <ArrowUpRight
                                        aria-hidden="true"
                                        className="size-6 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                      />
                                    )}
                                  </Link>
                                </motion.div>
                              </li>
                            )
                          })}
                        </ul>
                      </nav>

                      <motion.div
                        className="shell shrink-0 pb-8"
                        initial={reduced ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.45, ease: EASE_OUT }}
                      >
                        <p className="mb-2 text-sm text-muted-foreground">{t('chrome.nav.findMe')}</p>
                        <ul className="-mx-2 flex flex-wrap">
                          {socialLinks.map(({ icon: Icon, href, labelKey }) => (
                            <li key={href}>
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm hover:bg-accent"
                              >
                                <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
                                {t(labelKey)}
                                <span className="sr-only">({t('chrome.contact.opensNewTab')})</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/contact"
                          onClick={() => setMenuOpen(false)}
                          className="btn btn-primary mt-5 w-full"
                        >
                          {t('hero.contactMe')}
                        </Link>
                      </motion.div>
                    </motion.div>
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              ) : null}
            </AnimatePresence>
          </DialogPrimitive.Root>
        </div>
      </nav>
    </motion.header>
  )
}
