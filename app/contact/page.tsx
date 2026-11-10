'use client'

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, CornerDownLeft, Mail, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { EASE_OUT, Reveal, SplitText } from '@/components/fx/motion'
import { useI18n } from '@/lib/i18n-context'
import { socialLinks } from '@/lib/site'
import { cn } from '@/lib/utils'

const CONTACT_EMAIL = 'contact@zuzia.dev'
const HOST_TITLE = 'zuzia@portfolio:~/contact'
// Same rule the API applies, so the terminal rejects what the server would reject.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Step = 'command' | 'name' | 'email' | 'message' | 'confirm' | 'sending'
type Status = 'ready' | 'composing' | 'sending' | 'sent' | 'failed'

/** A piece of a line: literal text, or an i18n key resolved at render so the log follows the language. */
type Part = string | { k: string }

type Line = { id: number } & (
  | { kind: 'command' | 'output' | 'error' | 'success' | 'entry'; parts: Part[] }
  | { kind: 'link'; labelKey: string; href: string; text: string }
  | { kind: 'receipt'; name: string; email: string; length: number; at: number; reference?: string }
)

type NewLine = Line extends infer L ? (L extends { id: number } ? Omit<L, 'id'> : never) : never

const k = (key: string): Part => ({ k: key })
const out = (...parts: Part[]): NewLine => ({ kind: 'output', parts })
const err = (...parts: Part[]): NewLine => ({ kind: 'error', parts })
const ok = (...parts: Part[]): NewLine => ({ kind: 'success', parts })

const COMMAND_CHIPS = ['help', 'email', 'social', 'send', 'clear']

const stripProtocol = (href: string) => href.replace(/^https?:\/\//, '')

let lineId = 0
const withIds = (lines: NewLine[]): Line[] => lines.map((line) => ({ ...line, id: ++lineId }) as Line)

export default function ContactPage() {
  const { t, language } = useI18n()
  const reduced = useReducedMotion()

  const [lines, setLines] = useState<Line[]>(() =>
    withIds([out(k('contact.welcomeMessage')), out(k('contact.helpHint'))]),
  )
  const [step, setStep] = useState<Step>('command')
  const [status, setStatus] = useState<Status>('ready')
  const [input, setInput] = useState('')
  const [draft, setDraft] = useState({ name: '', email: '', message: '' })

  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const history = useRef<string[]>([])
  const historyIndex = useRef(-1)

  const print = (...next: NewLine[]) => setLines((prev) => [...prev, ...withIds(next)])
  const focusInput = () => (step === 'message' ? areaRef.current : inputRef.current)?.focus()

  // Keep the newest output in view.
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [lines])

  // Put the caret in the prompt for mouse and keyboard visitors; on touch that would open the keyboard unasked.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) {
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [])

  // The prompt swaps between an input and a textarea; keep focus across the swap.
  const previousStep = useRef<Step>(step)
  useEffect(() => {
    if (previousStep.current !== step) {
      previousStep.current = step
      ;(step === 'message' ? areaRef.current : inputRef.current)?.focus({ preventScroll: true })
    }
  }, [step])

  const cancelFlow = () => {
    setDraft({ name: '', email: '', message: '' })
    setStep('command')
    setStatus('ready')
    print(out(k('chrome.contact.cancelled')))
  }

  const deliver = async () => {
    setStep('sending')
    setStatus('sending')
    print(out(k('contact.sending')))

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; message?: string; id?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error || '')
      }

      print(
        {
          kind: 'receipt',
          name: draft.name,
          email: draft.email,
          length: draft.message.length,
          at: Date.now(),
          reference: payload?.id,
        },
        ok(k('contact.success')),
      )
      setDraft({ name: '', email: '', message: '' })
      setStep('command')
      setStatus('sent')
    } catch (error) {
      const detail = error instanceof Error && error.message && error.message !== 'Failed to fetch' ? error.message : ''
      print(err(detail || k('contact.error')), out(k('chrome.contact.retryHint')))
      // The draft is kept: back to the confirm step so "send" retries it.
      setStep('confirm')
      setStatus('failed')
    }
  }

  const runCommand = (raw: string) => {
    const command = raw.trim().toLowerCase()
    const echo: NewLine = { kind: 'command', parts: [raw.trim()] }

    switch (command) {
      case 'help':
        print(
          echo,
          out(k('contact.commandsTitle')),
          out(k('contact.commands.help')),
          out(k('contact.commands.email')),
          out(k('contact.commands.social')),
          out(k('contact.commands.contact')),
          out(k('contact.commands.send')),
          out(k('contact.commands.clear')),
        )
        break
      case 'email':
        print(echo, {
          kind: 'link',
          labelKey: 'contact.email',
          href: `mailto:${CONTACT_EMAIL}`,
          text: CONTACT_EMAIL,
        })
        break
      case 'social':
        print(
          echo,
          out(k('contact.socialLinksTitle')),
          ...socialLinks.map(
            ({ href, labelKey }): NewLine => ({ kind: 'link', labelKey, href, text: stripProtocol(href) }),
          ),
        )
        break
      case 'contact':
      case 'send':
        print(echo, ok(k('contact.openingForm')), out(k('contact.name'), ':'))
        setStep('name')
        setStatus('composing')
        break
      case 'clear':
        setLines([])
        setStatus('ready')
        break
      default:
        print(
          echo,
          err(k('contact.commandNotFoundPrefix'), raw.trim(), k('contact.commandNotFoundSuffix')),
        )
    }
  }

  /** One Enter press: routes the text to the command interpreter or the current step of the message flow. */
  const submit = (raw: string) => {
    if (step === 'sending') return
    const value = raw.trim()
    setInput('')
    historyIndex.current = -1

    if (step === 'command') {
      if (!value) return
      history.current = [value, ...history.current.filter((item) => item !== value)].slice(0, 50)
      runCommand(value)
      return
    }

    if (value.toLowerCase() === 'cancel') {
      cancelFlow()
      return
    }

    if (step === 'name') {
      if (!value) {
        print(err(k('chrome.contact.errName')))
        return
      }
      setDraft((prev) => ({ ...prev, name: value }))
      print({ kind: 'entry', parts: [k('contact.name'), ': ', value] }, out(k('contact.email'), ':'))
      setStep('email')
      return
    }

    if (step === 'email') {
      if (!EMAIL_PATTERN.test(value)) {
        print(err(k('chrome.contact.errEmail')))
        return
      }
      setDraft((prev) => ({ ...prev, email: value }))
      print(
        { kind: 'entry', parts: [k('contact.email'), ': ', value] },
        out(k('contact.message'), ':'),
        out(k('chrome.contact.messageHint')),
      )
      setStep('message')
      return
    }

    if (step === 'message') {
      if (!value) {
        print(err(k('chrome.contact.errMessage')))
        return
      }
      setDraft((prev) => ({ ...prev, message: value }))
      print({ kind: 'entry', parts: [k('contact.message'), ': ', value] }, out(k('chrome.contact.reviewHint')))
      setStep('confirm')
      return
    }

    // confirm
    if (value.toLowerCase() === 'send') {
      print({ kind: 'command', parts: ['send'] })
      void deliver()
    } else {
      print(err(k('chrome.contact.confirmUnknown')))
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit(input)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Escape' && step !== 'command' && step !== 'sending') {
      event.preventDefault()
      setInput('')
      cancelFlow()
      return
    }
    if (step === 'message') {
      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault()
        submit(input)
      }
      return
    }
    if (step !== 'command') return
    const items = history.current
    if (event.key === 'ArrowUp' && items.length) {
      event.preventDefault()
      historyIndex.current = Math.min(historyIndex.current + 1, items.length - 1)
      setInput(items[historyIndex.current])
    } else if (event.key === 'ArrowDown' && historyIndex.current >= 0) {
      event.preventDefault()
      historyIndex.current -= 1
      setInput(historyIndex.current >= 0 ? items[historyIndex.current] : '')
    }
  }

  const runChip = (command: string) => {
    submit(command)
    focusInput()
  }

  const sending = step === 'sending'
  const chips = step === 'command' ? COMMAND_CHIPS : step === 'confirm' ? ['send', 'cancel'] : ['cancel']

  const promptLabel =
    step === 'name'
      ? t('contact.name')
      : step === 'email'
        ? t('contact.email')
        : step === 'message'
          ? t('contact.message')
          : t('contact.commandPlaceholder')
  const placeholder =
    step === 'name'
      ? t('contact.namePlaceholder')
      : step === 'email'
        ? t('contact.emailPlaceholder')
        : step === 'message'
          ? t('contact.messagePlaceholder')
          : step === 'confirm'
            ? 'send'
            : sending
              ? t('contact.sending')
              : t('contact.commandPlaceholder')

  const resolve = (parts: Part[]) => parts.map((part) => (typeof part === 'string' ? part : t(part.k))).join('')

  const fieldClass =
    'min-w-0 flex-1 bg-transparent py-2.5 font-mono text-base text-foreground outline-none placeholder:text-muted-foreground/70 sm:text-sm'

  return (
    <>
      <Navbar />
      <main id="main" className="relative min-h-screen pb-24 pt-[calc(var(--nav-h)+3rem)] sm:pb-32">
        <div className="shell">
          <header className="max-w-3xl">
            <SplitText as="h1" text={t('contact.title')} trigger="mount" className="t-title" />
            <Reveal variant="unblur" delay={0.15}>
              <p className="t-lead mt-4">{t('contact.subtitle')}</p>
            </Reveal>
          </header>

          <div className="mt-12 grid gap-x-12 gap-y-14 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
            {/* Terminal */}
            <Reveal variant="rise" delay={0.2} className="min-w-0">
              <section aria-label={t('chrome.contact.terminalLabel')} className="surface surface-lift overflow-hidden">
                {/* Title strip: a title and the real state, nothing pretend. */}
                <div className="flex min-h-11 items-center justify-between gap-4 border-b border-border bg-secondary px-4">
                  <p className="t-data truncate text-muted-foreground">{HOST_TITLE}</p>
                  <p
                    role="status"
                    className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'size-2 rounded-[2px]',
                        status === 'sending' && 'flame animate-flicker',
                        status === 'sent' && 'bg-primary',
                        status === 'failed' && 'bg-destructive',
                        status === 'composing' && 'bg-heat',
                        status === 'ready' && 'bg-muted-foreground',
                      )}
                    />
                    {t(`chrome.contact.status.${status}`)}
                  </p>
                </div>

                {/* Output log */}
                <div
                  ref={logRef}
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions"
                  aria-label={t('chrome.contact.logLabel')}
                  tabIndex={0}
                  data-lenis-prevent=""
                  onClick={() => {
                    if (!window.getSelection()?.toString()) focusInput()
                  }}
                  className="h-[min(26rem,58vh)] min-h-64 cursor-text overflow-y-auto overscroll-contain bg-background px-4 py-4 font-mono text-[0.8125rem] leading-relaxed focus-visible:outline-offset-[-2px]"
                >
                  {lines.map((line) => (
                    <motion.div
                      key={line.id}
                      initial={reduced ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                    >
                      {line.kind === 'receipt' ? (
                        <Receipt line={line} language={language} t={t} reduced={Boolean(reduced)} />
                      ) : line.kind === 'link' ? (
                        <p className="whitespace-pre-wrap break-words text-muted-foreground">
                          {'  '}
                          {t(line.labelKey)}:{' '}
                          <a
                            href={line.href}
                            {...(line.href.startsWith('http')
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                            className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                          >
                            {line.text}
                          </a>
                        </p>
                      ) : (
                        <p
                          className={cn(
                            'whitespace-pre-wrap break-words',
                            line.kind === 'command' && 'text-foreground',
                            line.kind === 'entry' && 'text-foreground',
                            line.kind === 'output' && 'text-muted-foreground',
                            line.kind === 'error' && 'text-destructive',
                            line.kind === 'success' && 'text-foreground',
                          )}
                        >
                          {line.kind === 'command' ? (
                            <span aria-hidden="true" className="mr-2 text-primary">
                              $
                            </span>
                          ) : null}
                          {line.kind === 'error' ? (
                            <X aria-hidden="true" className="mr-1.5 inline size-3.5 align-[-0.15em]" />
                          ) : null}
                          {line.kind === 'success' ? (
                            <Check aria-hidden="true" className="mr-1.5 inline size-3.5 align-[-0.15em] text-primary" />
                          ) : null}
                          {resolve(line.parts)}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Prompt */}
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="flex items-start gap-2 border-t border-border bg-card pl-4 pr-1.5 focus-within:shadow-[inset_0_0_0_2px_var(--ring)]"
                >
                  <label
                    htmlFor="terminal-input"
                    className="shrink-0 py-2.5 font-mono text-base leading-6 text-primary sm:text-sm sm:leading-6"
                  >
                    <span aria-hidden="true">{step === 'command' || sending ? '$' : '>'}</span>
                    <span className="sr-only">{promptLabel}</span>
                  </label>
                  {step === 'message' ? (
                    <textarea
                      ref={areaRef}
                      id="terminal-input"
                      rows={3}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder={placeholder}
                      spellCheck
                      className={cn(fieldClass, 'resize-none leading-6')}
                    />
                  ) : (
                    <input
                      ref={inputRef}
                      id="terminal-input"
                      type={step === 'email' ? 'email' : 'text'}
                      inputMode={step === 'email' ? 'email' : 'text'}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder={placeholder}
                      readOnly={sending}
                      aria-busy={sending}
                      autoComplete={step === 'name' ? 'name' : step === 'email' ? 'email' : 'off'}
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className={cn(fieldClass, 'h-11 leading-6')}
                    />
                  )}
                  <button
                    type="submit"
                    aria-disabled={sending}
                    aria-label={t('chrome.contact.run')}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground aria-disabled:opacity-50"
                  >
                    <CornerDownLeft className="size-4" aria-hidden="true" />
                  </button>
                </form>

                {/* Shortcuts for people who would rather not type */}
                <div
                  role="group"
                  aria-label={t('chrome.contact.suggestions')}
                  className="flex flex-wrap gap-2 border-t border-border bg-card px-4 py-3"
                >
                  {chips.map((command) => (
                    <button
                      key={command}
                      type="button"
                      disabled={sending}
                      onClick={() => runChip(command)}
                      className="chip min-h-11 px-4 text-xs disabled:opacity-50"
                    >
                      {command}
                    </button>
                  ))}
                </div>
              </section>

              <p className="mt-4 max-w-[62ch] text-sm text-muted-foreground">{t('chrome.contact.keysHint')}</p>
            </Reveal>

            {/* Direct alternatives */}
            <Reveal variant="slide" delay={0.3} as="section" className="min-w-0">
              <h2 className="t-heading">{t('chrome.contact.directTitle')}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t('chrome.contact.directLead')}</p>
              <ul className="mt-6 border-t border-border">
                <li className="border-b border-border">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="group flex min-h-14 items-center gap-3 py-2">
                    <Mail aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{t('contact.email')}</span>
                      <span className="t-data block truncate text-muted-foreground">{CONTACT_EMAIL}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  </a>
                </li>
                {socialLinks.map(({ icon: Icon, href, labelKey }) => (
                  <li key={href} className="border-b border-border">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-14 items-center gap-3 py-2"
                    >
                      <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{t(labelKey)}</span>
                        <span className="t-data block truncate text-muted-foreground">{stripProtocol(href)}</span>
                      </span>
                      <span className="sr-only">({t('chrome.contact.opensNewTab')})</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

/** The confirmation, printed as an order ticket. */
function Receipt({
  line,
  language,
  t,
  reduced,
}: {
  line: Extract<Line, { kind: 'receipt' }>
  language: string
  t: (key: string) => string
  reduced: boolean
}) {
  const sentAt = new Date(line.at)
  const rows: [string, string][] = [
    [t('chrome.contact.receiptFrom'), line.name],
    [t('chrome.contact.receiptReply'), line.email],
    [t('chrome.contact.receiptLength'), `${line.length} ${t('chrome.contact.characters')}`],
    [
      t('chrome.contact.receiptSent'),
      new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(sentAt),
    ],
  ]
  if (line.reference) rows.push([t('chrome.contact.receiptRef'), line.reference])

  return (
    <motion.div
      className="ticket my-4 w-full max-w-sm"
      initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
    >
      <p className="font-display text-base font-semibold tracking-tight">{t('chrome.contact.receiptTitle')}</p>
      <hr className="ticket-rule" />
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-xs">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-sans text-muted-foreground">{label}</dt>
            <dd className="break-words text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <hr className="ticket-rule" />
      <p className="font-sans text-sm text-muted-foreground">{t('contact.successDetail')}</p>
    </motion.div>
  )
}
