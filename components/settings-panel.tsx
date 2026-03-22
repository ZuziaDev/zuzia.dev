'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, Sun, Moon, Check, Globe, Palette, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme, type ColorTheme, type Mode } from '@/lib/theme-context'
import { useI18n, languages, type Language } from '@/lib/i18n-context'

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { mode, colorTheme, setMode, setColorTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const portalTarget = typeof document !== 'undefined' ? document.body : null

  const themeColors: { id: ColorTheme; color: string }[] = [
    { id: 'purple', color: '#8B5CF6' },
    { id: 'blue', color: '#3B82F6' },
    { id: 'green', color: '#10B981' },
    { id: 'red', color: '#EF4444' },
    { id: 'orange', color: '#F97316' },
    { id: 'pink', color: '#EC4899' },
    { id: 'cyan', color: '#06B6D4' },
    { id: 'amber', color: '#F59E0B' },
  ]

  const currentLang = languages.find((l) => l.code === language)
  const closePanel = () => {
    setIsOpen(false)
    setColorOpen(false)
    setLangOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        closePanel()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />

          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="text-base font-semibold">{t('settings.title')}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closePanel}
                  className="h-8 w-8 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3 p-4">
                {/* Mode Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  {(['light', 'dark'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                        mode === m
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {m === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {t(`settings.${m}`)}
                      {mode === m && <Check className="ml-auto w-3 h-3 text-primary" />}
                    </button>
                  ))}
                </div>

                {/* Color Theme Accordion */}
                <div className="overflow-hidden rounded-xl border border-border">
                  <button
                    onClick={() => setColorOpen(!colorOpen)}
                    className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Palette className="w-4 h-4 text-muted-foreground" />
                      {t('settings.colorTheme')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-border"
                        style={{
                          backgroundColor: themeColors.find((c) => c.id === colorTheme)?.color,
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {t(`settings.themeNames.${colorTheme}`)}
                      </span>
                      <motion.div animate={{ rotate: colorOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {colorOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border px-4 pb-4 pt-2">
                          <div className="grid grid-cols-4 gap-2.5">
                            {themeColors.map((theme) => (
                              <button
                                key={theme.id}
                                onClick={() => setColorTheme(theme.id)}
                                className={`relative flex aspect-square items-center justify-center rounded-xl border-2 transition-all ${
                                  colorTheme === theme.id
                                    ? 'scale-105 border-foreground'
                                    : 'border-transparent hover:scale-105'
                                }`}
                                style={{ backgroundColor: theme.color }}
                                aria-label={t(`settings.themeNames.${theme.id}`)}
                              >
                                {colorTheme === theme.id && (
                                  <Check className="w-4 h-4 text-white drop-shadow-md" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Language Accordion */}
                <div className="overflow-hidden rounded-xl border border-border">
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      {t('settings.language')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{currentLang?.nativeName}</span>
                      <motion.div animate={{ rotate: langOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {langOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="max-h-52 overflow-y-auto border-t border-border">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code as Language)
                                setLangOpen(false)
                              }}
                              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                                language === lang.code
                                  ? 'bg-primary/10 text-foreground'
                                  : 'text-muted-foreground hover:bg-secondary/50'
                              }`}
                            >
                              <span className="font-medium">{lang.nativeName}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs opacity-60">
                                  {t(`settings.languageNames.${lang.code}`)}
                                </span>
                                {language === lang.code && (
                                  <Check className="w-3.5 h-3.5 text-primary" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-xl hover:bg-secondary"
        aria-label={t('settings.open')}
      >
        <Settings className="w-5 h-5" />
      </Button>

      {portalTarget ? createPortal(modal, portalTarget) : null}
    </>
  )
}
