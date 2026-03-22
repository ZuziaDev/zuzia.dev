'use client'

import { motion } from 'framer-motion'
import {
  SiAnthropic,
  SiArkecosystem,
  SiBun,
  SiCloudinary,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlydotio,
  SiFramer,
  SiGit,
  SiJavascript,
  SiLinux,
  SiMeta,
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiOpenai,
  SiPenpot,
  SiPytorch,
  SiPython,
  SiRedis,
  SiRender,
  SiResend,
  SiSocketdotio,
  SiHtml5,
  SiCss,
  SiTypescript,
  SiTailwindcss,
  SiVercel,
} from 'react-icons/si'
import { GrGenai } from 'react-icons/gr'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n-context'

const skillCategories = [
  {
    key: 'languages',
    color: 'from-sky-500 to-blue-500',
    skills: [
      { name: 'JavaScript', icon: SiJavascript, level: 90 },
      { name: 'TypeScript', icon: SiTypescript, level: 85 },
      { name: 'Python', icon: SiPython, level: 45 },
      { name: 'Html', icon: SiHtml5, level: 45 },
      { name: 'Css', icon: SiCss, level: 45 },
    ],
  },
  {
    key: 'frontend',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React', icon: SiReact, level: 65 },
      { name: 'Next.js', icon: SiNextdotjs, level: 65 },
      { name: 'Tailwind CSS', icon: SiTailwindcss, level: 45 },
      { name: 'Ark UI', icon: SiArkecosystem, level: 40 },
      { name: 'Framer Motion', icon: SiFramer, level: 58 },
    ],
  },
  {
    key: 'aiMl',
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'OpenAI', icon: SiOpenai, level: 75 },
      { name: 'Anthropic', icon: SiAnthropic, level: 75 },
      { name: 'GenAI', icon: GrGenai, level: 75 },
      { name: 'Meta AI', icon: SiMeta, level: 68 },
      { name: 'PyTorch', icon: SiPytorch, level: 15 },
    ],
  },
  {
    key: 'backend',
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, level: 90 },
      { name: 'Bun.js', icon: SiBun, level: 65 },
      { name: 'Express.js', icon: SiExpress, level: 85 },
      { name: 'Socket.IO', icon: SiSocketdotio, level: 54 },
      { name: 'Resend', icon: SiResend, level: 60 },
    ],
  },
  {
    key: 'devops',
    color: 'from-orange-500 to-amber-500',
    skills: [
      { name: 'Vercel', icon: SiVercel, level: 78 },
      { name: 'Render', icon: SiRender, level: 55 },
      { name: 'Fly.io', icon: SiFlydotio, level: 20 },
    ],
  },
  {
    key: 'system',
    color: 'from-red-500 to-rose-500',
    skills: [
      { name: 'Git', icon: SiGit, level: 66 },
      { name: 'Redis', icon: SiRedis, level: 41 },
      { name: 'Linux', icon: SiLinux, level: 38 },
    ],
  },
  {
    key: 'design',
    color: 'from-indigo-500 to-violet-500',
    skills: [
      { name: 'Figma', icon: SiFigma, level: 67 },
      { name: 'Penpot', icon: SiPenpot, level: 34 },
      { name: 'Framer', icon: SiFramer, level: 35 },
    ],
  },
  {
    key: 'databaseCloud',
    color: 'from-cyan-500 to-teal-500',
    skills: [
      { name: 'Firebase Realtime', icon: SiFirebase, level: 82 },
      { name: 'Cloudinary', icon: SiCloudinary, level: 45 },
      { name: 'Firebase Storage', icon: SiFirebase, level: 45 },
    ],
  },
]

export default function SkillsPage() {
  const { t } = useI18n()

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      
      <section className="relative pt-32 pb-24 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="mb-8 gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('nav.home')}
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              {t('skills.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('skills.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="glass-card p-6 group hover:scale-[1.02] transition-transform"
              >
                <div
                  className={`inline-flex px-4 py-2 rounded-full bg-gradient-to-r ${category.color} mb-4`}
                >
                  <span className="text-sm font-semibold text-white">
                    {t(`skills.categories.${category.key}.name`)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {t(`skills.categories.${category.key}.description`)}
                </p>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <skill.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm text-foreground">{skill.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.1 }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
