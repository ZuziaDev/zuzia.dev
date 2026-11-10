import type { Language, Translations } from '@/lib/i18n-context'

/**
 * Extra copy for the "home" area. Deep-merged over the base dictionary in lib/i18n-context.tsx.
 * English is the fallback for every language, so `en` must contain every key; add `tr` alongside it.
 */
export const homeTranslations: Partial<Record<Language, Translations>> = {
  en: {
    home: {
      stack: {
        title: 'The tools I reach for',
        lead: 'Languages, frameworks and AI providers I use across my projects. Levels and details are on the skills page.',
        link: 'See all skills',
      },
      work: {
        title: 'Selected work',
        lead: 'Projects I have built in my own time.',
        stack: 'Stack',
      },
      journey: {
        hint: 'Keep scrolling to move along the rail',
      },
      contact: {
        title: 'Have an idea, a question, or just want to say hello?',
        lead: 'The contact page is a small terminal. Type a command, or send me a message directly.',
        cta: 'Open contact terminal',
      },
    },
  },
  tr: {
    home: {
      stack: {
        title: 'Elimin altındaki araçlar',
        lead: 'Projelerimde kullandığım diller, çatılar ve yapay zekâ sağlayıcıları. Seviyeler ve ayrıntılar yetenekler sayfasında.',
        link: 'Tüm yetenekleri gör',
      },
      work: {
        title: 'Seçilmiş işler',
        lead: 'Kendi zamanımda geliştirdiğim projeler.',
        stack: 'Teknolojiler',
      },
      journey: {
        hint: 'Rayda ilerlemek için kaydırmaya devam et',
      },
      contact: {
        title: 'Bir fikrin ya da sorun mu var, yoksa sadece selam mı vermek istiyorsun?',
        lead: 'İletişim sayfası küçük bir terminal. Bir komut yaz ya da bana doğrudan mesaj gönder.',
        cta: 'İletişim terminalini aç',
      },
    },
  },
}
