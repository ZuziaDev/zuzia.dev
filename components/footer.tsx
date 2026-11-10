'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { animate, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUp, Heart } from 'lucide-react'
import { EASE_OUT } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import { SITE_NAME, navLinks, socialLinks } from '@/lib/site'

const drawOnGroup =
  'link-draw group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]'

/**
 * Sets the wordmark's font size so the name spans the container exactly, at any width and in
 * any fallback font. Until it runs (and without JS) the CSS clamp below is a close estimate.
 */
function useFitText() {
  const boxRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const box = boxRef.current
    const text = textRef.current
    if (!box || !text) return

    const fit = () => {
      const available = box.clientWidth
      const current = parseFloat(getComputedStyle(text).fontSize)
      const natural = text.scrollWidth
      if (!available || !current || !natural) return
      text.style.fontSize = `${(current * available) / natural}px`
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    document.fonts?.ready.then(fit).catch(() => {})
    return () => observer.disconnect()
  }, [])

  return { boxRef, textRef }
}

export function Footer() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const footerRef = useRef<HTMLElement>(null)
  const { boxRef, textRef } = useFitText()

  // The one scroll-linked moment: the name rises out of the floor as the footer arrives.
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0.25, 1], ['62%', '0%'])

  const toTop = () => {
    if (reduced) {
      window.scrollTo(0, 0)
      return
    }
    animate(window.scrollY, 0, {
      duration: 0.9,
      ease: EASE_OUT,
      onUpdate: (value) => window.scrollTo(0, value),
    })
  }

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-border bg-background">
      <div className="shell pt-20 sm:pt-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="t-title max-w-[18ch]">{t('chrome.footer.signoff')}</h2>
          <Link href="/contact" className="group inline-flex min-h-11 items-center gap-2 self-start font-semibold lg:self-auto">
            <span className={drawOnGroup}>{t('chrome.footer.openTerminal')}</span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 text-primary transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="seam mt-12 sm:mt-16" />

        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <nav aria-label={t('chrome.footer.navLabel')}>
            <ul className="-mx-3 flex flex-wrap">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex min-h-11 items-center px-3 text-sm">
                    <span className={drawOnGroup}>{t(link.nameKey)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button type="button" onClick={toTop} className="btn btn-ghost group self-start sm:self-auto">
            {t('chrome.footer.backToTop')}
            <ArrowUp
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </button>
        </div>

        <div className="seam" />

        <ul aria-label={t('chrome.footer.socialLabel')} className="-mx-3 flex flex-wrap py-4">
          {socialLinks.map(({ icon: Icon, href, labelKey }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 px-3 text-sm"
              >
                <Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
                />
                <span className={drawOnGroup}>{t(labelKey)}</span>
                <span className="sr-only">({t('chrome.contact.opensNewTab')})</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="seam" />

        <div className="flex flex-col gap-1 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="inline-flex flex-wrap items-center gap-x-1.5">
            {t('footer.builtWith')}
            <Heart aria-hidden="true" className="size-4 fill-current text-heat" />
            <span className="sr-only">{t('chrome.footer.love')}</span>
            {t('footer.by')}
            <span className="font-semibold text-foreground">{SITE_NAME}</span>
          </p>
          <p>
            © <span className="tabular">{new Date().getFullYear()}</span> {t('footer.rights')}.
          </p>
        </div>
      </div>

      {/* The sign-off. Deliberately cut by the bottom edge of the page. */}
      <div aria-hidden="true" className="shell select-none overflow-hidden pt-[3vw]">
        <div ref={boxRef}>
          <motion.span
            ref={textRef}
            style={reduced ? undefined : { y }}
            className="-mb-[0.13em] inline-block whitespace-nowrap font-display text-[clamp(1.75rem,10.4vw,9.5rem)] font-extrabold leading-[0.82] tracking-[-0.04em] will-change-transform"
          >
            {SITE_NAME}
          </motion.span>
        </div>
      </div>
    </footer>
  )
}
