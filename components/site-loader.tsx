'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n-context'

const MIN_VISIBLE_MS = 900
const FALLBACK_HIDE_MS = 3200

export function SiteLoader() {
  const { t } = useI18n()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const startedAt = Date.now()
    let hideTimeout: number | undefined
    let fallbackTimeout: number | undefined
    let isDone = false

    const finishLoading = () => {
      if (isDone) {
        return
      }

      isDone = true
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed)

      hideTimeout = window.setTimeout(() => {
        setIsVisible(false)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      finishLoading()
    } else {
      window.addEventListener('load', finishLoading, { once: true })
      fallbackTimeout = window.setTimeout(finishLoading, FALLBACK_HIDE_MS)
    }

    return () => {
      isDone = true
      window.removeEventListener('load', finishLoading)

      if (hideTimeout) {
        window.clearTimeout(hideTimeout)
      }

      if (fallbackTimeout) {
        window.clearTimeout(fallbackTimeout)
      }
    }
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (isVisible) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-[120] overflow-hidden bg-[#08080d]"
          aria-live="polite"
          aria-label={t('loader.title')}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(167,139,250,0.12),transparent_28%)]" />
            <div className="loader-grid absolute inset-0 opacity-30" />
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.28, 0.42, 0.28] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]"
            />
          </div>

          <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full max-w-sm rounded-[28px] border border-white/10 bg-white/[0.04] px-8 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-primary/25"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border border-accent/20"
                />
                <motion.div
                  animate={{ scale: [0.95, 1.06, 0.95], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-4 rounded-full bg-primary/10 blur-xl"
                />
                <Image
                  src="https://raw.githubusercontent.com/ZuziaDev/branding/main/logo/Zuzia_Inc_Logo_Transparant.png"
                  alt="Zuzia Inc. Logo"
                  width={76}
                  height={76}
                  priority
                  className="relative h-16 w-16 object-contain drop-shadow-[0_0_24px_rgba(139,92,246,0.7)]"
                />
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary/70">
                  Zuzia Inc.
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {t('loader.title')}
                </h2>
                <p className="text-sm leading-6 text-white/65">
                  {t('loader.subtitle')}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2">
                {[0, 1, 2].map((index) => (
                  <motion.span
                    key={index}
                    animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      delay: index * 0.16,
                      ease: 'easeInOut',
                    }}
                    className="h-2.5 w-2.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
