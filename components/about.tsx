'use client'

import { motion } from 'framer-motion'
import { BrainCircuit, ChefHat, Code2, HeartHandshake } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

export function About() {
  const { t } = useI18n()
  const paragraphs = [
    t('about.paragraph1'),
    t('about.paragraph2'),
    t('about.paragraph3'),
    t('about.paragraph4'),
  ]

  const highlights = [
    {
      icon: ChefHat,
      title: t('about.highlights.aiSpecialist'),
      description: t('about.highlights.aiSpecialistDesc'),
    },
    {
      icon: Code2,
      title: t('about.highlights.fullStackDev'),
      description: t('about.highlights.fullStackDevDesc'),
    },
    {
      icon: BrainCircuit,
      title: t('about.highlights.productFocused'),
      description: t('about.highlights.productFocusedDesc'),
    },
    {
      icon: HeartHandshake,
      title: t('about.highlights.performanceDriven'),
      description: t('about.highlights.performanceDrivenDesc'),
    },
  ]

  const traits = [
    t('about.traits.problemSolver'),
    t('about.traits.teamPlayer'),
    t('about.traits.lifelongLearner'),
    t('about.traits.openSource'),
  ]

  const renderParagraph = (content: string) =>
    content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={`${part}-${index}`} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </span>
        )
      }

      return part
    })

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
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
            <span className="text-gradient">{t('about.title')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('about.intro')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph}`} className="text-lg">
                  {index === 0 ? (
                    <span className="mr-3 inline-block align-middle font-[family-name:var(--font-pacifico)] text-3xl leading-none text-gradient sm:text-4xl">
                      {t('about.greeting')}
                    </span>
                  ) : null}
                  {renderParagraph(paragraph)}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {traits.map((trait) => (
                <span
                  key={trait}
                  className="px-4 py-2 text-sm font-mono glass-card text-muted-foreground"
                >
                  {trait}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="glass-card p-6 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:glow-violet transition-all duration-300">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
