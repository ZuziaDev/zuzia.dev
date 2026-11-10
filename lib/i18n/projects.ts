import type { Language, Translations } from '@/lib/i18n-context'

/**
 * Extra copy for the "projects" area. Deep-merged over the base dictionary in lib/i18n-context.tsx.
 * English is the fallback for every language, so `en` must contain every key; add `tr` alongside it.
 * `{name}` placeholders are filled by `fill()` in components/projects/project-meta.ts.
 */
export const projectsTranslations: Partial<Record<Language, Translations>> = {
  en: {
    projectsPage: {
      jumpLabel: 'On this page',
      newTab: 'opens in a new tab',
      artAlt: '{title} artwork',
      spec: {
        title: 'Spec sheet',
        stack: 'Stack',
        links: 'Links',
      },
      repos: {
        title: 'Open source',
        lead: 'Every public repository on my GitHub profile, loaded live. Search it, filter by language, or sort it your way.',
        profile: 'View on GitHub',
        summary: {
          repos: 'Repositories',
          stars: 'Total stars',
          languages: 'Languages',
        },
        searchLabel: 'Search repositories',
        searchPlaceholder: 'Search by name, description or topic',
        clearSearch: 'Clear search',
        languageLabel: 'Filter by language',
        allLanguages: 'All',
        sortLabel: 'Sort by',
        sort: {
          stars: 'Stars',
          updated: 'Updated',
          name: 'Name',
        },
        hideForks: 'Hide forks',
        count: '{shown} of {total} repositories',
        col: {
          name: 'Repository',
          description: 'Description',
          language: 'Language',
          stars: 'Stars',
          forks: 'Forks',
          updated: 'Updated',
        },
        noDescription: 'No description available',
        fork: 'Fork',
        archived: 'Archived',
        loading: 'Loading repositories',
        showAll: 'Show all {count}',
        showFewer: 'Show fewer',
        empty: {
          title: 'No repository matches these filters',
          body: 'Try a shorter search or another language.',
          clear: 'Clear filters',
        },
        error: {
          title: 'Unable to load GitHub repositories',
          network: 'The request never reached GitHub. Check your connection, then try again.',
          rateLimit: 'GitHub limits how many requests one network can make per hour, and that limit has been reached. Try again in a little while.',
          rateLimitUntil: 'GitHub limits how many requests one network can make per hour, and that limit has been reached. It resets at {time}.',
          http: 'GitHub answered with an error (HTTP {status}). Try again in a moment.',
          retry: 'Try again',
        },
      },
    },
  },
  tr: {
    projectsPage: {
      jumpLabel: 'Bu sayfada',
      newTab: 'yeni sekmede açılır',
      artAlt: '{title} görseli',
      spec: {
        title: 'Künye',
        stack: 'Teknolojiler',
        links: 'Bağlantılar',
      },
      repos: {
        title: 'Açık kaynak',
        lead: 'GitHub profilimdeki tüm açık depolar, canlı olarak yükleniyor. Arayabilir, dile göre süzebilir ya da dilediğin gibi sıralayabilirsin.',
        profile: 'GitHub’da görüntüle',
        summary: {
          repos: 'Depolar',
          stars: 'Toplam yıldız',
          languages: 'Diller',
        },
        searchLabel: 'Depolarda ara',
        searchPlaceholder: 'Ad, açıklama veya konuya göre ara',
        clearSearch: 'Aramayı temizle',
        languageLabel: 'Dile göre süz',
        allLanguages: 'Tümü',
        sortLabel: 'Sıralama',
        sort: {
          stars: 'Yıldız',
          updated: 'Güncelleme',
          name: 'Ad',
        },
        hideForks: 'Fork’ları gizle',
        count: '{total} depodan {shown} tanesi',
        col: {
          name: 'Depo',
          description: 'Açıklama',
          language: 'Dil',
          stars: 'Yıldız',
          forks: 'Fork',
          updated: 'Güncellendi',
        },
        noDescription: 'Açıklama eklenmemiş',
        fork: 'Fork',
        archived: 'Arşivlendi',
        loading: 'Depolar yükleniyor',
        showAll: 'Tümünü göster ({count})',
        showFewer: 'Daha az göster',
        empty: {
          title: 'Bu filtrelere uyan depo yok',
          body: 'Daha kısa bir arama ya da başka bir dil dene.',
          clear: 'Filtreleri temizle',
        },
        error: {
          title: 'GitHub depoları yüklenemedi',
          network: 'İstek GitHub’a ulaşmadı. Bağlantını kontrol edip yeniden dene.',
          rateLimit: 'GitHub, bir ağdan saatte yapılabilecek istek sayısını sınırlıyor ve bu sınır doldu. Biraz sonra yeniden dene.',
          rateLimitUntil: 'GitHub, bir ağdan saatte yapılabilecek istek sayısını sınırlıyor ve bu sınır doldu. Sınır saat {time} itibarıyla sıfırlanacak.',
          http: 'GitHub bir hata döndürdü (HTTP {status}). Birazdan yeniden dene.',
          retry: 'Yeniden dene',
        },
      },
    },
  },
}
