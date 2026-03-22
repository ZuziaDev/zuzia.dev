'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/lib/i18n-context'

type SubmitState = false | 'form' | 'sent'

export function Contact() {
  const { t } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<SubmitState>(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [terminalOutput, setTerminalOutput] = useState([
    `$ ${t('contact.welcomeMessage')}`,
    `$ ${t('contact.helpHint')}`,
  ])
  const [command, setCommand] = useState('')

  const handleTerminalCommand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!command.trim()) return

    const cmd = command.toLowerCase().trim()
    const newOutput = [...terminalOutput, `$ ${command}`]

    if (cmd === 'help') {
      newOutput.push(
        `> ${t('contact.commandsTitle')}`,
        t('contact.commands.send'),
        t('contact.commands.email'),
        t('contact.commands.clear'),
        t('contact.commands.contact')
      )
    } else if (cmd === 'email') {
      newOutput.push(`> ${t('contact.email')}: contact@zuzia.dev`)
    } else if (cmd === 'clear') {
      setTerminalOutput([`$ ${t('contact.welcomeMessage')}`])
      setCommand('')
      return
    } else if (cmd === 'contact') {
      newOutput.push(
        `> ${t('contact.contactInfoTitle')}`,
        `  ${t('contact.email')}: contact@zuzia.dev`,
        `  ${t('contact.availability')}: ${t('contact.availabilityValue')}`,
        `  ${t('contact.typeSendHint')}`
      )
    } else if (cmd === 'send') {
      setFormError(null)
      setSubmitted('form')
    } else {
      newOutput.push(
        `$ ${t('contact.commandNotFoundPrefix')}"${command}"${t('contact.commandNotFoundSuffix')}`
      )
    }

    setTerminalOutput(newOutput)
    setCommand('')
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      subject: String(form.get('subject') || '').trim(),
      message: String(form.get('message') || '').trim(),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(result?.error || t('contact.error'))
      }

      e.currentTarget.reset()
      setTerminalOutput((prev) => [...prev, `$ ${t('contact.success')}`])
      setSubmitted('sent')
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : t('contact.error')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#1E3A8A]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {submitted === 'form' ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {formError ? (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {formError}
                </div>
              ) : null}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#10B981]">
                    {t('contact.name')}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t('contact.namePlaceholder')}
                    required
                    className="rounded-lg bg-[#0B0B0F]/80 border-[#8B5CF6]/30 focus:border-[#8B5CF6] focus:bg-[#0B0B0F] font-mono text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#10B981]">
                    {t('contact.email')}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('contact.emailPlaceholder')}
                    required
                    className="rounded-lg bg-[#0B0B0F]/80 border-[#8B5CF6]/30 focus:border-[#8B5CF6] focus:bg-[#0B0B0F] font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-[#10B981]">
                  {t('contact.subject')}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder={t('contact.subjectPlaceholder')}
                  required
                  className="rounded-lg bg-[#0B0B0F]/80 border-[#8B5CF6]/30 focus:border-[#8B5CF6] focus:bg-[#0B0B0F] font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#10B981]">
                  {t('contact.message')}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t('contact.messagePlaceholder')}
                  rows={5}
                  required
                  className="rounded-lg bg-[#0B0B0F]/80 border-[#8B5CF6]/30 focus:border-[#8B5CF6] focus:bg-[#0B0B0F] font-mono text-sm resize-none"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#1E3A8A] hover:opacity-90 transition-opacity font-mono"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('contact.sending')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {t('contact.send')}
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setFormError(null)
                    setSubmitted(false)
                  }}
                  variant="outline"
                  className="rounded-lg border-[#8B5CF6]/30 bg-[#1E3A8A]/20 hover:bg-[#1E3A8A]/40 font-mono"
                >
                  {t('contact.backToTerminal')}
                </Button>
              </div>
            </form>
          ) : submitted === 'sent' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border-2 border-[#10B981] rounded-lg bg-[#0B0B0F]/90 backdrop-blur p-8 text-center font-mono"
            >
              <div className="mb-4">
                <div className="text-3xl mb-4 animate-pulse">✓</div>
                <span className="text-[#10B981]">$ {t('contact.success')}</span>
              </div>
              <p className="text-[#8B5CF6] text-sm mb-6">{t('contact.successDetail')}</p>
              <Button
                onClick={() => setSubmitted(false)}
                className="rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#1E3A8A] hover:opacity-90 transition-opacity font-mono"
              >
                {t('contact.backToTerminal')}
              </Button>
            </motion.div>
          ) : (
            <div className="border-2 border-[#8B5CF6]/50 rounded-lg bg-[#0B0B0F]/90 backdrop-blur overflow-hidden font-mono text-sm">
              {/* Terminal Header */}
              <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/20 border-b border-[#8B5CF6]/30 px-4 py-2 flex items-center gap-2">
                <span className="text-[#8B5CF6]">zuzia@portfolio</span>
                <span className="text-[#8B5CF6]/50">~</span>
                <span className="text-[#10B981]">/Contact</span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 h-96 overflow-y-auto space-y-1 scrollbar-thin scrollbar-track-[#0B0B0F] scrollbar-thumb-[#8B5CF6]/30">
                {terminalOutput.map((line, idx) => (
                  <div key={idx} className="text-[#10B981]">
                    {line.startsWith('$') ? (
                      <span>
                        <span className="text-[#10B981]">{line}</span>
                      </span>
                    ) : (
                      <span className="text-[#8B5CF6]/80">{line}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Terminal Input */}
              <form onSubmit={handleTerminalCommand} className="border-t border-[#8B5CF6]/30 px-6 py-4 flex items-center gap-2 bg-[#0B0B0F]/50">
                <span className="text-[#10B981]">$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder={t('contact.commandPlaceholder')}
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-[#10B981] placeholder-[#8B5CF6]/50 font-mono"
                />
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
