'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Award, Rocket, Brain, Image, Heart, HeartCrack, CodeXml, Bot, CreditCard, School, Cross } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

const timelineEvents = [
  {
    year: '2026',
    titleKey: 'timeline.events.plans2026.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.plans2026.description',
    icon: CreditCard,
    type: 'work',
  }, {
    year: '2026',
    titleKey: 'timeline.events.bot2026.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.bot2026.description',
    icon: Bot,
    type: 'work',
  }, {
    year: '2025',
    titleKey: 'timeline.events.neuroa2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.neuroa2025.description',
    icon: CodeXml,
    type: 'work',
  }, {
    year: '2025',
    titleKey: 'timeline.events.separation2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.separation2025.description',
    icon: HeartCrack,
    type: 'work',
  }, {
    year: '2025',
    titleKey: 'timeline.events.love2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.love2025.description',
    icon: Heart,
    type: 'work',
  }, {
    year: '2025',
    titleKey: 'timeline.events.break2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.break2025.description',
    icon: Rocket,
    type: 'work',
  }, {
    year: '2025',
    titleKey: 'timeline.events.aiAdvance2025.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.aiAdvance2025.description',
    icon: Brain,
    type: 'work',
  }, {
    year: '2024',
    titleKey: 'timeline.events.firstModel2024.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.firstModel2024.description',
    icon: Brain,
    type: 'work',
  }, {
    year: '2023',
    titleKey: 'timeline.events.design2023.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.design2023.description',
    icon: Image,
    type: 'work',
  }, {
    year: '2023',
    titleKey: 'timeline.events.api2023.title',
    companyKey: 'timeline.companies.zuziaPortNature',
    descriptionKey: 'timeline.events.api2023.description',
    icon: GraduationCap,
    type: 'work',
  }, {  
    year: '2023',
    titleKey: 'timeline.events.frontend2023.title',
    companyKey: 'timeline.companies.portNature',
    descriptionKey: 'timeline.events.frontend2023.description',
    icon: Award,
    type: 'achievement',
  },
  {
    year: '2022',
    titleKey: 'timeline.events.aiIntro2022.title',
    companyKey: 'timeline.companies.portNature',
    descriptionKey: 'timeline.events.aiIntro2022.description',
    icon: Brain,
    type: 'education',
  },
  {
    year: '2022',
    titleKey: 'timeline.events.graduation2022.title',
    companyKey: '',
    descriptionKey: 'timeline.events.graduation2022.description',
    icon: School,
    type: 'achievement',
  },
  {
    year: '2021',
    titleKey: 'timeline.events.languages2021.title',
    companyKey: '',
    descriptionKey: 'timeline.events.languages2021.description',
    icon: GraduationCap,
    type: 'education',
  },
  {
    year: '2021',
    titleKey: 'timeline.events.discord2021.title',
    companyKey: '',
    descriptionKey: 'timeline.events.discord2021.description',
    icon: GraduationCap,
    type: 'education',
  },
  {
    year: '2020',
    titleKey: 'timeline.events.pandemic2020.title',
    companyKey: '',
    descriptionKey: 'timeline.events.pandemic2020.description',
    icon: Cross,
    type: 'education',
  },
]

export function Timeline() {
  const { t } = useI18n()

  return (
    <section id="journey" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient">{t('timeline.title')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('timeline.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-transparent" />

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={`${event.year}-${event.titleKey}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* Timeline Node */}
                <div className="absolute left-4 top-6 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-violet">
                  <event.icon className="w-4 h-4 text-white" />
                </div>

                {/* Content Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 cursor-default"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-3 py-1 text-xs font-mono bg-primary/20 text-primary rounded-full">
                      {event.year}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {event.companyKey ? t(event.companyKey) : ''}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t(event.titleKey)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t(event.descriptionKey)}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
