'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SiGithub, SiDiscord, SiYoutube, SiInstagram } from 'react-icons/si'
import { FaXTwitter } from "react-icons/fa6";
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n-context'

const socialLinks = [
  { icon: SiInstagram, href: 'https://instagram.com/ridvan.veli.0', labelKey: 'social.instagram' },
  { icon: SiGithub, href: 'https://github.com/ZuziaDev', labelKey: 'social.github' },
  { icon: SiDiscord, href: 'https://discord.gg/gSfkTJkr5U', labelKey: 'social.discord' },
  { icon: SiYoutube, href: 'https://youtube.com/@ZuziaInc', labelKey: 'social.youtube' },
  { icon: FaXTwitter, href: 'https://twitter.com/ZuziaInc', labelKey: 'social.twitter' },
]

export function Hero() {
  const { t } = useI18n()

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-[rgba(11,11,15,0.5)] before:to-background"
      style={{
        backgroundImage: 'url(https://raw.githubusercontent.com/ZuziaDev/branding/refs/heads/main/banner/banner_transparant.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--primary) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Primary Glow Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 40%, transparent) 0%, transparent 70%)' }}
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.4, 0.25]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] rounded-full blur-[180px]"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 50%, transparent) 0%, transparent 70%)' }}
        />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/60"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 border-glow"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">{t('hero.available')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">{t('hero.greeting')}</span>
              <br />
              <span className="font-[family-name:var(--font-pacifico)] text-gradient text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
                Zuziâ RodzeN
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              <span className="text-primary font-semibold">{t('hero.description')}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-base px-8 group"
              >
                <Link href="/projects">
                  {t('hero.viewProjects')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl border-primary/30 bg-primary/10 hover:bg-primary/20 text-base px-8"
              >
                <Link href="/contact">{t('hero.contactMe')}</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <span className="text-sm text-muted-foreground">{t('hero.findMeOn')}</span>
              <div className="flex items-center gap-2">
                {socialLinks.map(({ icon: Icon, href, labelKey }) => (
                  <a
                    key={labelKey}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl glass hover:bg-primary/20 transition-colors group"
                    aria-label={t(labelKey)}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-96 h-96">
              {/* Outer Glow Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, var(--primary), var(--accent), var(--primary))',
                  opacity: 0.3,
                  filter: 'blur(40px)',
                }}
              />
              
              {/* Inner Glow */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-transparent animate-pulse-glow" />
              
              {/* Logo with Neon Glow */}
              <div className="absolute inset-12 flex items-center justify-center">
                <Image
                  src="https://raw.githubusercontent.com/ZuziaDev/branding/main/logo/Zuzia_Inc_Logo_Transparant.png"
                  alt="Zuzia Inc. Logo"
                  width={220}
                  height={220}
                  className="object-contain drop-shadow-[0_0_25px_var(--primary)] drop-shadow-[0_0_50px_var(--primary)] drop-shadow-[0_0_80px_var(--accent)] animate-pulse-glow"
                  style={{
                    filter: 'drop-shadow(0 0 20px var(--primary)) drop-shadow(0 0 40px var(--primary)) drop-shadow(0 0 60px var(--accent))',
                  }}
                />
              </div>
              
              {/* Floating Tech Labels */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 right-12 glass-card px-4 py-2"
              >
                <span className="font-mono text-sm text-primary">AI/ML</span>
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/4 -right-8 glass-card px-4 py-2"
              >
                <span className="font-mono text-sm text-accent">Next.js</span>
              </motion.div>
              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-1/4 -left-4 glass-card px-4 py-2"
              >
                <span className="font-mono text-sm text-primary">Python</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-primary/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
