'use client'

import { motion } from 'framer-motion'
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiPytorch,
  SiOpenai,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiVercel,
  SiFigma,
  SiFirebase
} from 'react-icons/si'
import { useI18n } from '@/lib/i18n-context'

const skillCategories = [
  {
    labelKey: 'skills.frontend',
    color: 'from-[oklch(0.75_0.15_200)] to-[oklch(0.65_0.2_220)]',
    skills: [
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
    ],
  },
  {
    labelKey: 'skills.ai',
    color: 'from-[oklch(0.65_0.28_280)] to-[oklch(0.6_0.25_300)]',
    skills: [
      { name: 'Python', icon: SiPython },
      { name: 'PyTorch', icon: SiPytorch },
      { name: 'OpenAI', icon: SiOpenai },
    ],
  },
  {
    labelKey: 'skills.backend',
    color: 'from-[oklch(0.7_0.18_150)] to-[oklch(0.6_0.2_170)]',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'FireBase', icon: SiFirebase },
      { name: 'Docker', icon: SiDocker },
    ],
  },
  {
    labelKey: 'skills.tools',
    color: 'from-[oklch(0.75_0.2_50)] to-[oklch(0.65_0.22_30)]',
    skills: [
      { name: 'Git', icon: SiGit },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Figma', icon: SiFigma },
    ],
  },
]

export function Skills() {
  const { t } = useI18n()

  return (
    <section id="skills" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t('skills.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="glass-card p-6 group"
            >
              <div
                className={`inline-flex px-3 py-1.5 rounded-full bg-gradient-to-r ${category.color} mb-6`}
              >
                <span className="text-sm font-semibold text-white">{t(category.labelKey)}</span>
              </div>

              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/30 transition-colors cursor-default"
                  >
                    <skill.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-mono text-sm text-foreground">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">{t('skills.extraExperience')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'GraphQL',
              'Redis',
              'Kubernetes',
              'CI/CD',
              'Jest',
              'Playwright',
              'Prisma',
              'tRPC',
              'Langchain',
              'RAG',
            ].map((skill) => (
              <motion.span
                key={skill}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 text-xs font-mono glass-card text-muted-foreground hover:text-foreground transition-colors cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
