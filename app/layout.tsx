import type { Metadata, Viewport } from 'next'
import { Unbounded, Onest, Martian_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/lib/theme-context'
import { I18nProvider } from '@/lib/i18n-context'
import { DynamicTitle } from '@/components/dynamic-title'
import { SiteLoader } from '@/components/site-loader'
import { CommandPalette } from '@/components/command-palette'
import { SmoothScroll } from '@/components/fx/smooth-scroll'
import { ScrollProgress } from '@/components/fx/motion'
import './globals.css'

const unbounded = Unbounded({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-unbounded',
  display: 'swap',
})

const onest = Onest({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
})

const martianMono = Martian_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-martian',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zuzia | Engineering AI, Emotion & Imagination',
  description: 'Engineering AI, Emotion & Imagination. Premium portfolio showcasing cutting-edge AI solutions and innovative software development.',
  generator: 'SIGMA-CORE/ALPHA-ZU5IA',
  icons: {
    icon: 'https://raw.githubusercontent.com/ZuziaDev/branding/main/logo/favicon.ico',
    apple: 'https://raw.githubusercontent.com/ZuziaDev/branding/main/logo/Zuzia_Inc_Logo_Transparant.png',
  },
  openGraph: {
    title: 'Zuzia Inc. | Engineering AI, Emotion & Imagination',
    description: 'Engineering AI, Emotion & Imagination. Premium portfolio showcasing cutting-edge AI solutions and innovative software development.',
    images: ['https://raw.githubusercontent.com/ZuziaDev/branding/main/banner/banner-main.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zuzia Inc. | Engineering AI, Emotion & Imagination',
    description: 'Engineering AI, Emotion & Imagination.',
    images: ['https://raw.githubusercontent.com/ZuziaDev/branding/main/banner/banner-main.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f141b' },
    { media: '(prefers-color-scheme: light)', color: '#f2f4f6' },
  ],
  colorScheme: 'dark light',
}

// Applies the saved mode before first paint so the page never flashes the wrong surface.
const themeBootScript = `try{var m=localStorage.getItem('theme-mode');document.documentElement.classList.add(m==='light'?'light':'dark')}catch(e){document.documentElement.classList.add('dark')}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className={`${unbounded.variable} ${onest.variable} ${martianMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <I18nProvider>
            <SmoothScroll />
            <ScrollProgress />
            <SiteLoader />
            <CommandPalette />
            <DynamicTitle />
            {children}
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
