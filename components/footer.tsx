'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { SiGithub, SiDiscord, SiYoutube, SiInstagram } from 'react-icons/si'
import { FaXTwitter } from 'react-icons/fa6'
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n-context'

const socialLinks = [
  { icon: SiInstagram, href: 'https://instagram.com/ridvan.veli.0', labelKey: 'social.instagram', color: 'hover:text-pink-500' },
  { icon: SiGithub, href: 'https://github.com/ZuziaDev', labelKey: 'social.github', color: 'hover:text-white'  },
  { icon: SiDiscord, href: 'https://discord.gg/gSfkTJkr5U', labelKey: 'social.discord', color: 'hover:text-indigo-500' },
  { icon: SiYoutube, href: 'https://youtube.com/@ZuziaInc', labelKey: 'social.youtube', color: 'hover:text-red-500' },
  { icon: FaXTwitter, href: 'https://twitter.com/ZuziaInc', labelKey: 'social.twitter', color: 'hover:text-white' },
]

export function Footer() {
  const { t } = useI18n()

  const navLinks = [
    { name: t('nav.about'), href: '/#about' },
    { name: t('nav.skills'), href: '/skills' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/contact' },
  ]

  return (
    <footer className="relative py-12 overflow-hidden border-t border-border/50">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://raw.githubusercontent.com/ZuziaDev/branding/main/logo/Zuzia_Inc_Logo_Transparant.png"
                alt="Zuzia Inc. Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="font-[family-name:var(--font-pacifico)] text-xl text-gradient">
                Zuziâ RodzeN
              </span>
            </Link>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </motion.nav>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            {socialLinks.map(({ icon: Icon, href, labelKey, color }) => (
              <a
                key={labelKey}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-xl hover:bg-secondary/50 transition-all ${color}`}
                aria-label={t(labelKey)}
              >
                <Icon className="w-5 h-5 text-muted-foreground transition-colors" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-8 border-t border-border/30 text-center"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            {t('footer.builtWith')} <Heart className="w-4 h-4 text-red-400 fill-red-400" /> {t('footer.by')} Zuziâ RodzeN
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} {t('footer.rights')}.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
