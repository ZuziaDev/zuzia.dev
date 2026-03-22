import type { Metadata, Viewport } from 'next'
import { Pacifico, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/lib/theme-context'
import { I18nProvider } from '@/lib/i18n-context'
import { DynamicTitle } from '@/components/dynamic-title'
import { SiteLoader } from '@/components/site-loader'
import './globals.css'

const pacifico = Pacifico({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
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
  themeColor: '#8B5CF6',
  colorScheme: 'dark light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${pacifico.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <I18nProvider>
            <SiteLoader />
            <DynamicTitle />
            {children}
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
