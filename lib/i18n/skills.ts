import type { Language, Translations } from '@/lib/i18n-context'

/**
 * Extra copy for the "skills" area. Deep-merged over the base dictionary in lib/i18n-context.tsx.
 * English is the fallback for every language, so `en` must contain every key; add `tr` alongside it.
 * Placeholders in braces ({name}, {query}, ...) are filled in by the page.
 */
export const skillsTranslations: Partial<Record<Language, Translations>> = {
  en: {
    skillsPage: {
      summary: {
        label: 'The list in numbers',
        technologies: 'Technologies',
        categories: 'Categories',
        average: 'Average level',
      },
      note: 'Every level is my own estimate of how comfortable I am with a tool. None of them is a test score.',
      board: {
        title: 'Heat board',
        description: 'One cell per technology, grouped by category. The hotter the colour, the higher the level.',
        hint: 'Point at a cell or focus it to read it. Select it to jump to its row.',
        groupLabel: 'All technologies by level. Use the arrow keys to move between cells.',
        legendLow: 'Lower',
        legendHigh: 'Higher',
        cellLabel: '{name}, {level}%, {category}. Go to its row',
      },
      toolbar: {
        label: 'Search, filter and sort the list',
      },
      search: {
        label: 'Search technologies',
        placeholder: 'Search by name',
        clear: 'Clear search',
      },
      filter: {
        label: 'Filter by category',
        all: 'All',
      },
      sort: {
        label: 'Sort',
        category: 'Category',
        level: 'Level',
        name: 'Name',
        categoryLong: 'Sort by category',
        levelLong: 'Sort by level, highest first',
        nameLong: 'Sort by name, A to Z',
      },
      results: {
        status: 'Showing {shown} of {total}',
      },
      count: {
        one: 'technology',
        other: 'technologies',
      },
      flat: {
        levelTitle: 'Ranked by level',
        levelDescription: 'Every technology in one list, highest level first.',
        nameTitle: 'In alphabetical order',
        nameDescription: 'Every technology in one list, from A to Z.',
      },
      row: {
        gauge: '{name} level',
      },
      empty: {
        title: 'Nothing matches “{query}”',
        body: 'No technology on this list has that in its name. Check the spelling or clear the search.',
        bodyInCategory: 'No technology in {category} has that in its name. Clear the search or look in every category.',
        clear: 'Clear search',
        showAll: 'Show all categories',
      },
    },
  },
  tr: {
    skillsPage: {
      summary: {
        label: 'Rakamlarla liste',
        technologies: 'Teknoloji',
        categories: 'Kategori',
        average: 'Ortalama seviye',
      },
      note: 'Buradaki her seviye, o araçla ne kadar rahat çalıştığıma dair kendi tahminim. Hiçbiri bir sınav sonucu değil.',
      board: {
        title: 'Isı panosu',
        description: 'Her teknoloji için bir hücre, kategorilere göre dizili. Renk ısındıkça seviye yükselir.',
        hint: 'Okumak için bir hücrenin üzerine gel ya da ona odaklan. Satırına gitmek için seç.',
        groupLabel: 'Seviyelerine göre tüm teknolojiler. Hücreler arasında ok tuşlarıyla gezebilirsin.',
        legendLow: 'Düşük',
        legendHigh: 'Yüksek',
        cellLabel: '{name}, %{level}, {category}. Satırına git',
      },
      toolbar: {
        label: 'Listede ara, filtrele ve sırala',
      },
      search: {
        label: 'Teknoloji ara',
        placeholder: 'Ada göre ara',
        clear: 'Aramayı temizle',
      },
      filter: {
        label: 'Kategoriye göre filtrele',
        all: 'Tümü',
      },
      sort: {
        label: 'Sırala',
        category: 'Kategori',
        level: 'Seviye',
        name: 'Ad',
        categoryLong: 'Kategoriye göre sırala',
        levelLong: 'Seviyeye göre sırala, en yüksek önce',
        nameLong: 'Ada göre sırala, A’dan Z’ye',
      },
      results: {
        status: '{total} teknolojiden {shown} tanesi gösteriliyor',
      },
      count: {
        one: 'teknoloji',
        other: 'teknoloji',
      },
      flat: {
        levelTitle: 'Seviyeye göre sıralı',
        levelDescription: 'Tüm teknolojiler tek listede, en yüksek seviye en üstte.',
        nameTitle: 'Alfabetik sırayla',
        nameDescription: 'Tüm teknolojiler tek listede, A’dan Z’ye.',
      },
      row: {
        gauge: '{name} seviyesi',
      },
      empty: {
        title: '“{query}” ile eşleşen bir şey yok',
        body: 'Bu listede adında bu geçen bir teknoloji yok. Yazımı kontrol et ya da aramayı temizle.',
        bodyInCategory: '{category} kategorisinde adında bu geçen bir teknoloji yok. Aramayı temizle ya da tüm kategorilere bak.',
        clear: 'Aramayı temizle',
        showAll: 'Tüm kategorileri göster',
      },
    },
  },
}
