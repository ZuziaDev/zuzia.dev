'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Reveal, SplitText } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'

const onward = [
  { href: '/projects', key: 'chrome.blog.toProjects' },
  { href: '/contact', key: 'chrome.blog.toContact' },
]

export default function BlogPage() {
  const { t } = useI18n()

  return (
    <>
      <Navbar />
      <main id="main" className="relative min-h-screen pb-24 pt-[calc(var(--nav-h)+3rem)] sm:pb-32">
        <div className="shell">
          <header className="max-w-3xl">
            <SplitText as="h1" text={t('blog.title')} trigger="mount" className="t-title" />
            <Reveal variant="unblur" delay={0.15}>
              <p className="t-lead mt-4">{t('blog.subtitle')}</p>
            </Reveal>
          </header>

          <Reveal variant="wipe" delay={0.25} duration={1.1}>
            <div className="seam mt-12 sm:mt-16" />
          </Reveal>

          <section className="grid gap-x-16 gap-y-10 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
            <SplitText
              as="h2"
              by="char"
              stagger={0.03}
              delay={0.3}
              trigger="mount"
              text={t('blog.comingSoon')}
              className="t-display"
            />

            <div className="max-w-[52ch]">
              <Reveal variant="rise" delay={0.5}>
                <p className="text-lg leading-relaxed">{t('blog.temporaryNotice')}</p>
              </Reveal>

              <Reveal variant="rise" delay={0.62}>
                <h3 className="mt-10 text-sm font-medium text-muted-foreground font-sans">
                  {t('chrome.blog.onward')}
                </h3>
                <ul className="mt-3 border-t border-border">
                  {onward.map(({ href, key }) => (
                    <li key={href} className="border-b border-border">
                      <Link
                        href={href}
                        className="group flex min-h-14 items-center justify-between gap-4 py-3 font-display text-lg font-semibold tracking-[-0.02em]"
                      >
                        {t(key)}
                        <ArrowRight
                          aria-hidden="true"
                          className="size-5 shrink-0 text-muted-foreground transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-primary"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
