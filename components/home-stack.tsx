'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { IconType } from 'react-icons'
import {
  SiAnthropic,
  SiArkecosystem,
  SiBun,
  SiCloudinary,
  SiCss,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlydotio,
  SiFramer,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMeta,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPenpot,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiRender,
  SiResend,
  SiRust,
  SiSocketdotio,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'
import { GrGenai } from 'react-icons/gr'
import { Marquee, Reveal, SplitText } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'

type Tech = { name: string; icon: IconType }

// Same technologies as app/skills/page.tsx, without the levels.
const rowOne: Tech[] = [
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'Python', icon: SiPython },
  { name: 'Rust', icon: SiRust },
  { name: 'HTML', icon: SiHtml5 },
  { name: 'CSS', icon: SiCss },
  { name: 'React', icon: SiReact },
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'Ark UI', icon: SiArkecosystem },
  { name: 'Framer Motion', icon: SiFramer },
  { name: 'OpenAI', icon: SiOpenai },
  { name: 'Anthropic', icon: SiAnthropic },
  { name: 'GenAI', icon: GrGenai },
  { name: 'Meta AI', icon: SiMeta },
  { name: 'PyTorch', icon: SiPytorch },
]

const rowTwo: Tech[] = [
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'Bun.js', icon: SiBun },
  { name: 'Express.js', icon: SiExpress },
  { name: 'Socket.IO', icon: SiSocketdotio },
  { name: 'Resend', icon: SiResend },
  { name: 'Vercel', icon: SiVercel },
  { name: 'Render', icon: SiRender },
  { name: 'Fly.io', icon: SiFlydotio },
  { name: 'Git', icon: SiGit },
  { name: 'Redis', icon: SiRedis },
  { name: 'Linux', icon: SiLinux },
  { name: 'Figma', icon: SiFigma },
  { name: 'Penpot', icon: SiPenpot },
  { name: 'Firebase', icon: SiFirebase },
  { name: 'Cloudinary', icon: SiCloudinary },
]

function TechRow({ items }: { items: Tech[] }) {
  return (
    <ul className="flex items-center">
      {items.map((tech) => (
        <li key={tech.name} className="flex items-center gap-3 px-6 py-5 sm:px-8 sm:py-6">
          <tech.icon aria-hidden="true" className="size-6 shrink-0 text-muted-foreground" />
          <span className="t-data whitespace-nowrap text-sm text-foreground">{tech.name}</span>
        </li>
      ))}
    </ul>
  )
}

export function HomeStack() {
  const { t } = useI18n()

  return (
    <section className="relative pt-8 pb-24 sm:pb-32">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <SplitText as="h2" text={t('home.stack.title')} className="t-title max-w-[18ch]" />
          <Reveal variant="unblur" delay={0.1}>
            <p className="t-lead mt-5">{t('home.stack.lead')}</p>
          </Reveal>
        </div>
        <Link href="/skills" className="btn btn-ghost group shrink-0 self-start md:self-auto">
          {t('home.stack.link')}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Full-bleed strip: two rows running against each other */}
      <Reveal variant="wipe" duration={1.1} className="mt-12 border-y border-border bg-card sm:mt-16">
        <Marquee duration={70}>
          <TechRow items={rowOne} />
        </Marquee>
        <div aria-hidden="true" className="h-px bg-border" />
        <Marquee duration={62} reverse>
          <TechRow items={rowTwo} />
        </Marquee>
      </Reveal>
    </section>
  )
}
