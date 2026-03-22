'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Sparkles } from 'lucide-react'
import { SiDiscord } from 'react-icons/si'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n-context'

interface Project {
  key: string
  image: string
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  discordUrl?: string
  featured?: boolean
}

// EDIT YOUR PROJECTS HERE
const projects: Project[] = [
  {
    key: 'neuroa',
    image: 'neuroa_banner.png',
    techStack: ["JavaScript", 'Next.js', "Firebase", "Redis"],
    liveUrl: 'https://patreon.com/NeuroaAI',
    githubUrl: 'https://github.com',
    discordUrl: 'https://discord.gg/gSfkTJkr5U',
    featured: true,
  },
  {
    key: 'noteai',
    image: 'noteai.png',
    techStack: ['TypeScript', 'OpenAI', "Electron", "Vite", "React", "Firebase"],
    githubUrl: 'https://github.com/ZuziaDev/NoteAI',
  },
  {
    key: 'mirai',
    image: 'mirai.png',
    techStack: ['Python', "GenAI"],
    githubUrl: 'https://github.com/ZuziaDev/Mirai-2.0',
  },
  {
    key: 'neuroaBot',
    image: 'neuroa_banner.png',
    techStack: ['JavaScript', "Node.JS", "Firebase", "NeuroaAI",],
    liveUrl: 'https://neuroa.pro',
    discordUrl: 'https://discord.gg/gSfkTJkr5U',
  },
]

export function MyProjects() {
  const { t } = useI18n()
  const featuredProject = projects.find((p) => p.featured)
  const regularProjects = projects.filter((p) => !p.featured)

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <Sparkles className="w-6 h-6 text-accent" />
        <h3 className="text-2xl font-bold">{t('projects.featuredWork')}</h3>
      </motion.div>

      {/* Featured Project */}
      {featuredProject && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card overflow-hidden mb-8 group"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-video md:aspect-auto overflow-hidden">
              <img
                src={featuredProject.image}
                alt={t(`projects.items.${featuredProject.key}.title`)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r" />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold w-fit mb-4">
                <Sparkles className="w-3 h-3" />
                {t('projects.featuredBadge')}
              </div>
              <h4 className="text-2xl font-bold mb-3">
                {t(`projects.items.${featuredProject.key}.title`)}
              </h4>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t(`projects.items.${featuredProject.key}.description`)}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs font-mono bg-secondary/50 rounded-lg text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {featuredProject.liveUrl && (
                  <Button asChild size="sm" className="rounded-xl">
                    <a href={featuredProject.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t('projects.liveDemo')}
                    </a>
                  </Button>
                )}
                {featuredProject.githubUrl && (
                  <Button asChild size="sm" variant="outline" className="rounded-xl">
                    <a href={featuredProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      {t('projects.source')}
                    </a>
                  </Button>
                )}
                {featuredProject.discordUrl && (
                  <Button asChild size="sm" variant="outline" className="rounded-xl">
                    <a href={featuredProject.discordUrl} target="_blank" rel="noopener noreferrer">
                      <SiDiscord className="w-4 h-4 mr-2" />
                      {t('projects.discord')}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Regular Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularProjects.map((project, index) => (
          <motion.div
            key={project.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={t(`projects.items.${project.key}.title`)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            </div>
            <div className="p-5">
              <h4 className="text-lg font-semibold mb-2">
                {t(`projects.items.${project.key}.title`)}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                {t(`projects.items.${project.key}.description`)}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs font-mono bg-secondary/50 rounded text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    aria-label={t('projects.liveDemo')}
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    aria-label={t('projects.source')}
                  >
                    <Github className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
                {project.discordUrl && (
                  <a
                    href={project.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    aria-label={t('projects.discord')}
                  >
                    <SiDiscord className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
