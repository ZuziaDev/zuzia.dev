'use client'

import Link from 'next/link'
import { ArrowUpRight, Terminal } from 'lucide-react'
import { Magnetic, Reveal, SplitText } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import { socialLinks } from '@/lib/site'

export function HomeContact() {
  const { t } = useI18n()

  return (
    <section className="relative">
      <div aria-hidden="true" className="seam" />
      <div className="shell grid gap-x-12 gap-y-14 py-24 sm:py-32 lg:grid-cols-12 lg:items-end">
        <div className="min-w-0 lg:col-span-7">
          <SplitText as="h2" text={t('home.contact.title')} className="t-title max-w-[20ch]" stagger={0.035} />
          <Reveal variant="unblur" delay={0.2}>
            <p className="t-lead mt-6">{t('home.contact.lead')}</p>
          </Reveal>
          <Reveal variant="rise" delay={0.3} className="mt-9">
            <Magnetic>
              <Link href="/contact" className="btn btn-primary min-h-12 px-6">
                <Terminal aria-hidden="true" className="size-4" />
                {t('home.contact.cta')}
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        <div className="min-w-0 lg:col-span-4 lg:col-start-9">
          <p className="text-sm text-muted-foreground">{t('hero.findMeOn')}</p>
          <ul className="mt-3 border-b border-border">
            {socialLinks.map((social, index) => (
              <Reveal as="li" key={social.href} variant="slide" delay={index * 0.05} className="border-t border-border">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-12 items-center gap-3 py-2 text-foreground transition-colors duration-200 ease-[var(--ease-out)] hover:text-primary"
                >
                  <social.icon aria-hidden="true" className="size-4 shrink-0" />
                  <span className="font-medium">{t(social.labelKey)}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
