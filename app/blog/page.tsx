'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n-context'

export default function BlogPage() {
  const { t } = useI18n()

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />

      <section className="relative pt-32 pb-24 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
              {t('blog.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('blog.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card px-8 py-16 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">!</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">{t('blog.comingSoon')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('blog.temporaryNotice')}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
