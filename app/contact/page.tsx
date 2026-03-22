'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n-context'

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'input'
  content: string
}

export default function ContactPage() {
  const { t } = useI18n()
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: t('contact.welcomeMessage') },
    { type: 'output', content: t('contact.helpHint') },
  ])
  const [input, setInput] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()
    const newLines: TerminalLine[] = [{ type: 'command', content: `$ ${cmd}` }]

    switch (command) {
      case 'help':
        newLines.push(
          { type: 'output', content: t('contact.commandsTitle') },
          { type: 'output', content: t('contact.commands.help') },
          { type: 'output', content: t('contact.commands.email') },
          { type: 'output', content: t('contact.commands.social') },
          { type: 'output', content: t('contact.commands.contact') },
          { type: 'output', content: t('contact.commands.send') },
          { type: 'output', content: t('contact.commands.clear') }
        )
        break
      case 'email':
        newLines.push({ type: 'success', content: 'contact@zuzia.dev' })
        break

      case 'social':
        newLines.push(
          { type: 'output', content: t('contact.socialLinksTitle') },
          { type: 'output', content: `  ${t('social.github')}:    github.com/ZuziaDev` },
          { type: 'output', content: `  ${t('social.discord')}:   discord.gg/gSfkTJkr5U` },
          { type: 'output', content: `  ${t('social.twitter')}:         twitter.com/ZuziaInc` },
          { type: 'output', content: `  ${t('social.youtube')}:   youtube.com/@ZuziaInc` },
          { type: 'output', content: `  ${t('social.instagram')}: instagram.com/ridvan.veli.0` }
        )
        break
      case 'contact':
      case 'send':
        setShowForm(true)
        newLines.push({ type: 'success', content: t('contact.openingForm') })
        break
      case 'clear':
        setLines([])
        return
      default:
        newLines.push({
          type: 'error',
          content: `${t('contact.commandNotFoundPrefix')}${cmd}${t('contact.commandNotFoundSuffix')}`,
        })
    }

    setLines((prev) => [...prev, ...newLines])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null

      if (response.ok) {
        setLines((prev) => [
          ...prev,
          {
            type: 'success',
            content: payload?.message || t('contact.success'),
          },
        ])
        setFormData({ name: '', email: '', message: '' })
        setShowForm(false)
      } else {
        throw new Error(payload?.error || t('contact.error'))
      }
    } catch (error) {
      setLines((prev) => [
        ...prev,
        {
          type: 'error',
          content: error instanceof Error ? error.message : t('contact.error'),
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      
      <section className="relative pt-32 pb-24 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                zuzia@portfolio:~/contact
              </span>
              <div className="w-16" />
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalRef}
              className="h-[400px] overflow-y-auto p-4 font-mono text-sm bg-black/90"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, index) => (
                <div
                  key={index}
                  className={`mb-1 ${
                    line.type === 'command'
                      ? 'text-cyan-400'
                      : line.type === 'error'
                      ? 'text-red-400'
                      : line.type === 'success'
                      ? 'text-green-400'
                      : 'text-gray-300'
                  }`}
                >
                  {line.content}
                </div>
              ))}

              {showForm ? (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="text-green-400">
                      {t('contact.name')}:
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full bg-transparent border-b border-gray-600 outline-none text-white py-1 focus:border-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-green-400">
                      {t('contact.email')}:
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full bg-transparent border-b border-gray-600 outline-none text-white py-1 focus:border-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-green-400">
                      {t('contact.message')}:
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      className="w-full bg-transparent border-b border-gray-600 outline-none text-white py-1 focus:border-green-400 resize-none"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {t('contact.send')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      {t('contact.cancel')}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && input.trim()) {
                        processCommand(input)
                        setInput('')
                      }
                    }}
                    className="flex-1 bg-transparent outline-none text-white caret-green-400"
                    autoFocus
                  />
                  <span className="animate-pulse text-green-400">_</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
