import { SiGithub, SiDiscord, SiYoutube, SiInstagram } from 'react-icons/si'
import { FaXTwitter } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

export const SITE_NAME = 'Zuziâ RodzeN'
export const LOGO_URL =
  'https://raw.githubusercontent.com/ZuziaDev/branding/main/logo/Zuzia_Inc_Logo_Transparant.png'

/** labelKey resolves through useI18n().t */
export const socialLinks: { icon: IconType; href: string; labelKey: string }[] = [
  { icon: SiInstagram, href: 'https://instagram.com/ridvan.veli.0', labelKey: 'social.instagram' },
  { icon: SiGithub, href: 'https://github.com/ZuziaDev', labelKey: 'social.github' },
  { icon: SiDiscord, href: 'https://discord.gg/gSfkTJkr5U', labelKey: 'social.discord' },
  { icon: SiYoutube, href: 'https://youtube.com/@ZuziaInc', labelKey: 'social.youtube' },
  { icon: FaXTwitter, href: 'https://twitter.com/ZuziaInc', labelKey: 'social.twitter' },
]

/** nameKey resolves through useI18n().t */
export const navLinks: { nameKey: string; href: string }[] = [
  { nameKey: 'nav.about', href: '/#about' },
  { nameKey: 'nav.skills', href: '/skills' },
  { nameKey: 'nav.projects', href: '/projects' },
  { nameKey: 'nav.blog', href: '/blog' },
  { nameKey: 'nav.contact', href: '/contact' },
]
