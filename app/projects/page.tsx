'use client'

import { ArrowDown } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GitHubProjects } from '@/components/github-projects'
import { MyProjects } from '@/components/my-projects'
import { Reveal, SplitText } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'

export default function ProjectsPage() {
  const { t } = useI18n()

  const jumps = [
    { href: '#work', label: t('projects.featured') },
    { href: '#repositories', label: t('projects.github') },
  ]

  return (
    <main id="main" className="relative min-h-screen">
      <Navbar />

      <header className="shell pb-12 pt-[calc(var(--nav-h)+3rem)] sm:pb-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <SplitText as="h1" trigger="mount" text={t('projects.title')} className="t-title" />
            <Reveal variant="unblur" delay={0.2}>
              <p className="t-lead mt-5">{t('projects.subtitle')}</p>
            </Reveal>
          </div>

          <Reveal variant="slide" delay={0.35}>
            <nav aria-label={t('projectsPage.jumpLabel')}>
              <ul className="flex flex-wrap gap-x-8 gap-y-1">
                {jumps.map((jump) => (
                  <li key={jump.href}>
                    <a
                      href={jump.href}
                      className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      <span className="link-draw">{jump.label}</span>
                      <ArrowDown
                        aria-hidden="true"
                        className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </header>

      <MyProjects />

      <div className="shell" aria-hidden="true">
        <div className="seam" />
      </div>

      <GitHubProjects />

      <Footer />
    </main>
  )
}
