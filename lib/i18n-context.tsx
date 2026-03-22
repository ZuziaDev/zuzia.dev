'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'en' | 'ja' | 'ru' | 'az' | 'tr' | 'kk' | 'ky'

interface Translations {
  [key: string]: string | Translations
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const baseTranslations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
      blog: 'Blog',
      settings: 'Settings',
    },
    hero: {
      greeting: "I'm",
      description: 'Engineering AI, Emotion & Imagination',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
    },
    about: {
      title: 'About Me',
      description: 'I live in Turkey and work as a cook while exploring software as a hobby. In my free time, I keep learning, read about AI, and turn new ideas into practice.',
      intro: 'A curious maker balancing culinary work, software, and AI-driven learning.',
      greeting: 'Hello,',
      paragraph1: "I'm **Zuziâ RodzeN**. I live in **Turkey**. I studied at a tourism high school. I currently work as a **cook**, and software is a **hobby** for me.",
      paragraph2: 'In my free time, I make a point of improving myself. While continuing that growth in both **software and cooking**, I also read articles about **artificial intelligence**. **Learning new things and being able to put them into practice** matters a lot to me.',
      paragraph3: 'When my friends ask for help with anything, I always try to **support them** as much as I can.',
      paragraph4: 'My hobbies include **watching anime**, listening to **rock and roll**, especially Anatolian rock, punk, rock from the 70s, 80s, and 90s, as well as indie rock, watching films, and **researching artificial intelligence**. With every new thing I learn, I ask myself, **"Can I build this too?"** That question keeps me moving forward.',
      traits: {
        problemSolver: 'Self-Improvement',
        teamPlayer: 'Helpful Mindset',
        lifelongLearner: 'Curious Learner',
        openSource: 'Hands-On Practice',
      },
      highlights: {
        aiSpecialist: 'Tourism & Culinary',
        aiSpecialistDesc: 'My tourism high school background and active work as a cook shaped my discipline, pace, and way of creating.',
        fullStackDev: 'Software Hobby',
        fullStackDevDesc: 'Software is the space where I keep learning, experimenting, and building things in my own time.',
        productFocused: 'AI Curiosity',
        productFocusedDesc: 'I read AI articles, follow new developments, and try to turn what I learn into real practice.',
        performanceDriven: 'Helpful Mindset',
        performanceDrivenDesc: 'I care about improving myself and I always try to support my friends whenever they need help.',
      },
    },
    skills: {
      title: 'Skills & Technologies',
      subtitle: 'Technologies I work with to bring ideas to life',
      frontend: 'Frontend',
      backend: 'Backend',
      ai: 'AI & ML',
      tools: 'Tools',
    },
    projects: {
      title: 'Projects',
      subtitle: 'Some of the projects I have worked on',
      github: 'GitHub Projects',
      featured: 'Featured Projects',
      viewAll: 'View All Projects',
    },
    contact: {
      title: 'Contact',
      subtitle: 'You can contact me via using the terminal below!',
      welcomeMessage: 'Welcome to the Contact Terminal!',
      helpHint: "Type 'help' to see available commands.",
      send: 'Send Message',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.',
    },
    blog: {
      title: 'Blog',
      subtitle: 'Thoughts, tutorials, and insights',
      readMore: 'Read More',
      comingSoon: 'Coming Soon',
      noPosts: 'No posts yet. Check back soon!',
    },
    settings: {
      title: 'Settings',
      theme: 'Theme',
      language: 'Language',
      mode: 'Mode',
      light: 'Light',
      dark: 'Dark',
      colorTheme: 'Color Theme',
    },
    footer: {
      rights: 'All rights reserved',
      builtWith: 'Built with',
      by: 'by',
    },
    timeline: {
      title: 'Journey',
      subtitle: 'My professional timeline',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      about: '概要',
      skills: 'スキル',
      projects: 'プロジェクト',
      contact: 'お問い合わせ',
      blog: 'ブログ',
      settings: '設定',
    },
    hero: {
      greeting: '私は',
      description: 'AI、感情、想像力のエンジニアリング',
      viewProjects: 'プロジェクトを見る',
      contactMe: 'お問い合わせ',
    },
    about: {
      title: '私について',
      description: '私はトルコで暮らし、料理人として働きながら、ソフトウェアを趣味として学び続けています。空いた時間にはAIの記事を読み、新しいことを実践に移すのが好きです。',
      intro: '料理、ソフトウェア、AIへの学びを並行して深めている好奇心旺盛な人です。',
      greeting: 'こんにちは、',
      paragraph1: '私は**Zuziâ RodzeN**です。**トルコ**に住んでいます。高校は観光系の学校で学びました。現在は**料理人**として働いており、ソフトウェアは私にとって**趣味**です。',
      paragraph2: '空いた時間には、自分を成長させることを大切にしています。**ソフトウェアと料理**の両方で学びを続けながら、**人工知能**に関する記事も読んでいます。**新しいことを学び、それを実践に移せること**は私にとってとても大切です。',
      paragraph3: '友人が何かで助けを求めてきたときは、できる限り**力になれるよう**心がけています。',
      paragraph4: '趣味は**アニメを見ること**、**ロックンロールを聴くこと**、特にアナトリアン・ロック、パンク、70年代・80年代・90年代のロック、そしてインディーロック、映画鑑賞、そして**人工知能について調べること**です。新しい知識に触れるたびに**「自分にもこれができるだろうか」**と考えることが、前に進み続ける原動力になっています。',
      traits: {
        problemSolver: '自己成長',
        teamPlayer: '助け合いの姿勢',
        lifelongLearner: '好奇心ある学び手',
        openSource: '実践重視',
      },
      highlights: {
        aiSpecialist: '観光と料理',
        aiSpecialistDesc: '観光系の学校で学んだ経験と、今も料理人として働いていることが、私の規律やスピード感、ものづくりの姿勢を形づくっています。',
        fullStackDev: 'ソフトウェアは趣味',
        fullStackDevDesc: 'ソフトウェアは、自分の時間の中で学び、試し、何かを形にしていくための大切な趣味です。',
        productFocused: 'AIへの好奇心',
        productFocusedDesc: 'AIに関する記事を読み、新しい動きを追いかけながら、学んだことを実際に試すようにしています。',
        performanceDriven: '助け合いの姿勢',
        performanceDrivenDesc: '自分を成長させることを大切にしながら、友人が困っているときはできる限り支えたいと考えています。',
      },
    },
    skills: {
      title: 'スキルと技術',
      subtitle: 'アイデアを実現するために使用する技術',
      frontend: 'フロントエンド',
      backend: 'バックエンド',
      ai: 'AI & ML',
      tools: 'ツール',
    },
    projects: {
      title: 'プロジェクト',
      subtitle: '私が取り組んできたプロジェクト',
      github: 'GitHubプロジェクト',
      featured: '注目のプロジェクト',
      viewAll: '全てを見る',
    },
    contact: {
      title: 'お問い合わせ',
      subtitle: '以下のターミナルでお問い合わせください！',
      welcomeMessage: 'コンタクトターミナルへようこそ！',
      helpHint: "'help'と入力して利用可能なコマンドを表示します。",
      send: 'メッセージを送信',
      name: '名前',
      email: 'メール',
      message: 'メッセージ',
      success: 'メッセージが正常に送信されました！',
      error: 'メッセージの送信に失敗しました。もう一度お試しください。',
    },
    blog: {
      title: 'ブログ',
      subtitle: '考え、チュートリアル、インサイト',
      readMore: '続きを読む',
      comingSoon: '近日公開',
      noPosts: 'まだ投稿がありません。後でまた確認してください！',
    },
    settings: {
      title: '設定',
      theme: 'テーマ',
      language: '言語',
      mode: 'モード',
      light: 'ライト',
      dark: 'ダーク',
      colorTheme: 'カラーテーマ',
    },
    footer: {
      rights: '全著作権所有',
      builtWith: '作成者',
      by: '',
    },
    timeline: {
      title: 'ジャーニー',
      subtitle: '私のプロフェッショナルなタイムライン',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'Обо мне',
      skills: 'Навыки',
      projects: 'Проекты',
      contact: 'Контакт',
      blog: 'Блог',
      settings: 'Настройки',
    },
    hero: {
      greeting: 'Я',
      description: 'Инженерия ИИ, эмоций и воображения',
      viewProjects: 'Смотреть проекты',
      contactMe: 'Связаться',
    },
    about: {
      title: 'Обо мне',
      description: 'Я живу в Турции, работаю поваром и развиваю программирование как хобби. В свободное время я учусь, читаю статьи об ИИ и стараюсь применять новые идеи на практике.',
      intro: 'Любознательный человек, который совмещает кулинарию, программирование и интерес к искусственному интеллекту.',
      greeting: 'Привет,',
      paragraph1: 'Меня зовут **Zuziâ RodzeN**. Я живу в **Турции**. Я учился в туристическом лицее. Сейчас я активно работаю **поваром**, а программирование для меня - это **хобби**.',
      paragraph2: 'В свободное время я стараюсь развивать себя. Продолжая расти и в **программировании, и в кулинарии**, я также читаю статьи об **искусственном интеллекте**. Для меня очень важно **узнавать новое и уметь применять это на практике**.',
      paragraph3: 'Когда друзья просят помощи в каком-либо вопросе, я стараюсь **поддержать их** настолько, насколько могу.',
      paragraph4: 'Среди моих увлечений - **аниме**, **рок-н-ролл**, особенно анатолийский рок, панк, рок 70-х, 80-х и 90-х, а также инди-рок, просмотр фильмов и **исследования в области искусственного интеллекта**. С каждой новой информацией я спрашиваю себя: **"Смогу ли я сделать это тоже?"** Этот вопрос постоянно двигает меня вперед.',
      traits: {
        problemSolver: 'Саморазвитие',
        teamPlayer: 'Готовность помочь',
        lifelongLearner: 'Любознательный ученик',
        openSource: 'Ориентация на практику',
      },
      highlights: {
        aiSpecialist: 'Туризм и кухня',
        aiSpecialistDesc: 'Учеба в туристическом лицее и активная работа поваром сформировали мою дисциплину, темп и подход к делу.',
        fullStackDev: 'Софт как хобби',
        fullStackDevDesc: 'Программирование - это пространство, где я учусь, пробую новое и создаю что-то в свое свободное время.',
        productFocused: 'Интерес к ИИ',
        productFocusedDesc: 'Я читаю статьи об ИИ, слежу за новыми разработками и стараюсь превращать изученное в реальную практику.',
        performanceDriven: 'Готовность помочь',
        performanceDrivenDesc: 'Мне важно развиваться самому, и я всегда стараюсь поддержать друзей, когда им нужна помощь.',
      },
    },
    skills: {
      title: 'Навыки и технологии',
      subtitle: 'Технологии, с которыми я работаю',
      frontend: 'Фронтенд',
      backend: 'Бэкенд',
      ai: 'ИИ и ML',
      tools: 'Инструменты',
    },
    projects: {
      title: 'Проекты',
      subtitle: 'Некоторые из моих проектов',
      github: 'Проекты на GitHub',
      featured: 'Избранные проекты',
      viewAll: 'Все проекты',
    },
    contact: {
      title: 'Контакт',
      subtitle: 'Свяжитесь со мной через терминал ниже!',
      welcomeMessage: 'Добро пожаловать в терминал контактов!',
      helpHint: "Введите 'help' для списка команд.",
      send: 'Отправить',
      name: 'Имя',
      email: 'Email',
      message: 'Сообщение',
      success: 'Сообщение успешно отправлено!',
      error: 'Ошибка отправки. Попробуйте снова.',
    },
    blog: {
      title: 'Блог',
      subtitle: 'Мысли, уроки и идеи',
      readMore: 'Читать далее',
      comingSoon: 'Скоро',
      noPosts: 'Пока нет записей. Загляните позже!',
    },
    settings: {
      title: 'Настройки',
      theme: 'Тема',
      language: 'Язык',
      mode: 'Режим',
      light: 'Светлый',
      dark: 'Тёмный',
      colorTheme: 'Цветовая тема',
    },
    footer: {
      rights: 'Все права защищены',
      builtWith: 'Создано с',
      by: '',
    },
    timeline: {
      title: 'Путь',
      subtitle: 'Моя профессиональная история',
    },
  },
  az: {
    nav: {
      home: 'Ana səhifə',
      about: 'Haqqımda',
      skills: 'Bacarıqlar',
      projects: 'Layihələr',
      contact: 'Əlaqə',
      blog: 'Bloq',
      settings: 'Parametrlər',
    },
    hero: {
      greeting: 'Mən',
      description: 'Süni intellekt, emosiya və təxəyyül mühəndisliyi',
      viewProjects: 'Layihələrə bax',
      contactMe: 'Əlaqə',
    },
    about: {
      title: 'Haqqımda',
      description: 'Mən Türkiyədə yaşayıram, aşpaz kimi çalışıram və proqramlaşdırmanı hobbi kimi davam etdirirəm. Boş vaxtlarımda öyrənir, AI haqqında məqalələr oxuyur və yeni biliklərimi praktikaya çevirməyə çalışıram.',
      intro: 'Aşpazlıq, proqramlaşdırma və süni intellekt marağını birlikdə inkişaf etdirən maraqlı biriyəm.',
      greeting: 'Salam,',
      paragraph1: 'Mən **Zuziâ RodzeN**əm. **Türkiyədə** yaşayıram. Liseyi turizm liseyində oxumuşam. Hazırda aktiv olaraq **aşpaz** işləyirəm; proqramlaşdırma isə mənim üçün bir **hobbidir**.',
      paragraph2: 'Boş vaxtlarımda özümü inkişaf etdirməyə xüsusi diqqət yetirirəm. Həm **proqramlaşdırma**, həm də **aşpazlıq** sahəsində inkişaf edərkən, eyni zamanda **süni intellekt** haqqında məqalələr oxuyuram. **Yeni şeylər öyrənmək və bunları praktikada sınaya bilmək** mənim üçün çox önəmlidir.',
      paragraph3: 'Dostlarım hər hansı bir mövzuda kömək istəyəndə, bacardığım qədər onlara **dəstək olmağa** çalışıram.',
      paragraph4: 'Hobbilərim arasında **anime izləmək**, **rock and roll** dinləmək, xüsusilə Anadolu roku, pank, 70-ci, 80-ci və 90-cı illərin roku, eləcə də indie rock, film izləmək və **süni intellekt üzrə araşdırmalar aparmaq** var. Oxuduğum hər yeni məlumatda özümə **"Mən bunu da edə bilərəmmi?"** sualını vermək, məni daim irəli aparan motivasiya mənbəyidir.',
      traits: {
        problemSolver: 'Özünü inkişaf etdirmə',
        teamPlayer: 'Dəstək olma düşüncəsi',
        lifelongLearner: 'Maraqlı öyrənən',
        openSource: 'Praktika yönümlü',
      },
      highlights: {
        aiSpecialist: 'Turizm və Mətbəx',
        aiSpecialistDesc: 'Turizm liseyi keçmişim və aşpaz kimi aktiv işləməyim intizamımı, tempimi və işə yanaşmamı formalaşdırıb.',
        fullStackDev: 'Proqramlaşdırma Hobbi',
        fullStackDevDesc: 'Proqramlaşdırma mənim üçün boş vaxtımda öyrəndiyim, sınadığım və nələrsə yaratdığım şəxsi sahədir.',
        productFocused: 'AI Marağı',
        productFocusedDesc: 'Süni intellekt haqqında məqalələr oxuyur, yeni inkişafları izləyir və öyrəndiklərimi praktikada sınamağa çalışıram.',
        performanceDriven: 'Köməksevər Yanaşma',
        performanceDrivenDesc: 'Özümü inkişaf etdirməyə önəm verir və dostlarım kömək istəyəndə bacardığım qədər dəstək olmağa çalışıram.',
      },
    },
    skills: {
      title: 'Bacarıqlar və Texnologiyalar',
      subtitle: 'Fikirləri həyata keçirmək üçün istifadə etdiyim texnologiyalar',
      frontend: 'Frontend',
      backend: 'Backend',
      ai: 'AI & ML',
      tools: 'Alətlər',
    },
    projects: {
      title: 'Layihələr',
      subtitle: 'Üzərində işlədiyim bəzi layihələr',
      github: 'GitHub Layihələri',
      featured: 'Seçilmiş Layihələr',
      viewAll: 'Hamısına bax',
    },
    contact: {
      title: 'Əlaqə',
      subtitle: 'Aşağıdakı terminal vasitəsilə mənlə əlaqə saxlaya bilərsiniz!',
      welcomeMessage: 'Əlaqə Terminalına xoş gəldiniz!',
      helpHint: "Mövcud əmrləri görmək üçün 'help' yazın.",
      send: 'Göndər',
      name: 'Ad',
      email: 'Email',
      message: 'Mesaj',
      success: 'Mesaj uğurla göndərildi!',
      error: 'Mesaj göndərilmədi. Yenidən cəhd edin.',
    },
    blog: {
      title: 'Bloq',
      subtitle: 'Düşüncələr, dərsliklər və fikirlər',
      readMore: 'Davamını oxu',
      comingSoon: 'Tezliklə',
      noPosts: 'Hələ yazı yoxdur. Sonra yoxlayın!',
    },
    settings: {
      title: 'Parametrlər',
      theme: 'Tema',
      language: 'Dil',
      mode: 'Rejim',
      light: 'İşıqlı',
      dark: 'Qaranlıq',
      colorTheme: 'Rəng teması',
    },
    footer: {
      rights: 'Bütün hüquqlar qorunur',
      builtWith: 'ilə hazırlanıb',
      by: '',
    },
    timeline: {
      title: 'Səyahət',
      subtitle: 'Peşəkar yolum',
    },
  },
  tr: {
    nav: {
      home: 'Ana Sayfa',
      about: 'Hakkımda',
      skills: 'Yetenekler',
      projects: 'Projeler',
      contact: 'İletişim',
      blog: 'Blog',
      settings: 'Ayarlar',
    },
    hero: {
      greeting: 'Ben',
      description: 'Yapay Zeka, Duygu ve Hayal Gücü Mühendisliği',
      viewProjects: 'Projeleri Gör',
      contactMe: 'İletişim',
    },
    about: {
      title: 'Hakkımda',
      description: 'Türkiye’de yaşayan, aşçılık yapan ve yazılımı hobi olarak sürdüren; boş zamanlarını öğrenmeye, üretmeye ve yapay zekâ araştırmalarına ayıran meraklı biriyim.',
      intro: 'Aşçılık, yazılım ve yapay zekâ merakını bir arada sürdüren, öğrenmeye açık biriyim.',
      greeting: 'Selam,',
      paragraph1: 'Ben **Zuziâ RodzeN**. **Türkiye’de** yaşıyorum. Liseyi turizm lisesinde okudum. Şu anda aktif olarak **aşçılık yapıyorum**; yazılım ise benim için bir **hobidir**.',
      paragraph2: 'Boş zamanlarımda kendimi geliştirmeye özen gösteriyorum. Bu gelişimi hem **yazılım** hem **aşçılık** alanında sürdürürken, aynı zamanda **yapay zekâ** üzerine makaleler okuyorum. **Yeni şeyler öğrenmek ve bunları pratiğe dökebilmek** benim için oldukça önemli.',
      paragraph3: 'Arkadaşlarım herhangi bir konuda yardım istediğinde, elimden geldiğince **destek olmaya** özen gösteririm.',
      paragraph4: 'Hobilerim arasında **anime** izlemek, **rock and roll** dinlemek; özellikle Anadolu rock, punk ve 70’ler, 80’ler, 90’lar rock ile indie rock, film izlemek ve **yapay zekâ** üzerine araştırmalar yapmak yer alır. Okuduğum her yeni bilgide **"Bunu ben de yapabilir miyim?"** sorusunu sormak, beni sürekli ileriye taşıyan motivasyon kaynağıdır.',
      traits: {
        problemSolver: 'Kendini Geliştirme',
        teamPlayer: 'Yardımsever',
        lifelongLearner: 'Meraklı Öğrenen',
        openSource: 'Pratik Odaklı',
      },
      highlights: {
        aiSpecialist: 'Turizm ve Mutfak',
        aiSpecialistDesc: 'Turizm lisesi geçmişim ve aktif olarak aşçılık yapıyor olmam, disiplinimi, tempomu ve üretim anlayışımı şekillendirdi.',
        fullStackDev: 'Yazılım Hobisi',
        fullStackDevDesc: 'Yazılım, boş zamanlarımda öğrenip denemeler yaptığım ve kendi üretimlerimi geliştirdiğim kişisel alanım.',
        productFocused: 'Yapay Zekâ Merakı',
        productFocusedDesc: 'Yapay zekâ üzerine makaleler okuyup yeni gelişmeleri takip ediyor, öğrendiklerimi pratiğe dökmeye çalışıyorum.',
        performanceDriven: 'Yardımsever Yapı',
        performanceDrivenDesc: 'Kendimi geliştirmeye önem veriyor, arkadaşlarım yardım istediğinde elimden geldiğince destek olmaya çalışıyorum.',
      },
    },
    skills: {
      title: 'Yetenekler ve Teknolojiler',
      subtitle: 'Fikirleri hayata geçirmek için kullandığım teknolojiler',
      frontend: 'Frontend',
      backend: 'Backend',
      ai: 'AI & ML',
      tools: 'Araçlar',
    },
    projects: {
      title: 'Projeler',
      subtitle: 'Üzerinde çalıştığım bazı projeler',
      github: 'GitHub Projeleri',
      featured: 'Öne Çıkan Projeler',
      viewAll: 'Tümünü Gör',
    },
    contact: {
      title: 'İletişim',
      subtitle: 'Aşağıdaki terminal ile bana ulaşabilirsiniz!',
      welcomeMessage: 'İletişim Terminaline Hoş Geldiniz!',
      helpHint: "Mevcut komutları görmek için 'help' yazın.",
      send: 'Gönder',
      name: 'İsim',
      email: 'Email',
      message: 'Mesaj',
      success: 'Mesaj başarıyla gönderildi!',
      error: 'Mesaj gönderilemedi. Tekrar deneyin.',
    },
    blog: {
      title: 'Blog',
      subtitle: 'Düşünceler, eğitimler ve içgörüler',
      readMore: 'Devamını Oku',
      comingSoon: 'Yakında',
      noPosts: 'Henüz yazı yok. Daha sonra tekrar kontrol edin!',
    },
    settings: {
      title: 'Ayarlar',
      theme: 'Tema',
      language: 'Dil',
      mode: 'Mod',
      light: 'Açık',
      dark: 'Koyu',
      colorTheme: 'Renk Teması',
    },
    footer: {
      rights: 'Tüm hakları saklıdır',
      builtWith: 'ile yapıldı',
      by: '',
    },
    timeline: {
      title: 'Yolculuk',
      subtitle: 'Profesyonel zaman çizelgem',
    },
  },
  kk: {
    nav: {
      home: 'Басты бет',
      about: 'Мен туралы',
      skills: 'Дағдылар',
      projects: 'Жобалар',
      contact: 'Байланыс',
      blog: 'Блог',
      settings: 'Параметрлер',
    },
    hero: {
      greeting: 'Мен',
      description: 'AI, эмоция және қиял инженериясы',
      viewProjects: 'Жобаларды көру',
      contactMe: 'Байланыс',
    },
    about: {
      title: 'Мен туралы',
      description: 'Мен Түркияда тұрамын, аспаз болып жұмыс істеймін және бағдарламалауды хобби ретінде дамытып жүрмін. Бос уақытымда үйреніп, ЖИ туралы мақалалар оқып, жаңа идеяларды тәжірибеде қолдануға тырысамын.',
      intro: 'Аспаздықты, бағдарламалауды және жасанды интеллектке қызығушылықты қатар алып жүретін ізденімпаз жанмын.',
      greeting: 'Сәлем,',
      paragraph1: 'Мен **Zuziâ RodzeN**мін. **Түркияда** тұрамын. Мектепті туризм бағытындағы лицейде оқыдым. Қазір белсенді түрде **аспаз** болып жұмыс істеймін, ал бағдарламалау мен үшін **хобби**.',
      paragraph2: 'Бос уақытымда өзімді дамытуға мән беремін. **Бағдарламалау мен аспаздықта** қатар дамып жүріп, **жасанды интеллект** туралы мақалалар да оқимын. **Жаңа нәрселерді үйрену және оларды іс жүзінде қолдана білу** мен үшін өте маңызды.',
      paragraph3: 'Достарым қандай да бір мәселе бойынша көмек сұраса, қолымнан келгенше **қолдау көрсетуге** тырысамын.',
      paragraph4: 'Хоббилерімнің ішінде **аниме көру**, **рок-н-ролл тыңдау**, әсіресе Анадолы рок, панк, 70, 80, 90-жылдардағы рок және инди-рок, фильм көру және **жасанды интеллект бойынша зерттеу жасау** бар. Әрбір жаңа ақпаратты оқығанда **"Мұны мен де жасай аламын ба?"** деген сұрақ қоюым мені әрдайым алға жетелейді.',
      traits: {
        problemSolver: 'Өзін дамыту',
        teamPlayer: 'Көмекке дайын',
        lifelongLearner: 'Қызығушылығы жоғары үйренуші',
        openSource: 'Тәжірибеге бағытталған',
      },
      highlights: {
        aiSpecialist: 'Туризм мен Ас үй',
        aiSpecialistDesc: 'Туризм лицейіндегі білімім мен аспаз болып белсенді жұмыс істеуім менің тәртібімді, қарқынымды және жұмысқа көзқарасымды қалыптастырды.',
        fullStackDev: 'Бағдарламалау Хоббиі',
        fullStackDevDesc: 'Бағдарламалау - менің бос уақытымда үйреніп, сынап, өз жобаларымды жасайтын жеке кеңістігім.',
        productFocused: 'ЖИ Қызығушылығы',
        productFocusedDesc: 'Жасанды интеллект туралы мақалалар оқып, жаңа бағыттарды бақылап, үйренгенімді тәжірибеде қолдануға тырысамын.',
        performanceDriven: 'Көмекке Дайын',
        performanceDrivenDesc: 'Өзімді дамытуға мән беремін және достарым көмек сұрағанда қолымнан келгенше қолдау көрсетуге тырысамын.',
      },
    },
    skills: {
      title: 'Дағдылар мен технологиялар',
      subtitle: 'Идеяларды іске асыру үшін қолданатын технологиялар',
      frontend: 'Frontend',
      backend: 'Backend',
      ai: 'AI & ML',
      tools: 'Құралдар',
    },
    projects: {
      title: 'Жобалар',
      subtitle: 'Менің жұмыс істеген жобаларым',
      github: 'GitHub жобалары',
      featured: 'Таңдаулы жобалар',
      viewAll: 'Барлығын көру',
    },
    contact: {
      title: 'Байланыс',
      subtitle: 'Төмендегі терминал арқылы маған хабарласыңыз!',
      welcomeMessage: 'Байланыс терминалына қош келдіңіз!',
      helpHint: "Қол жетімді командаларды көру үшін 'help' теріңіз.",
      send: 'Жіберу',
      name: 'Аты',
      email: 'Email',
      message: 'Хабарлама',
      success: 'Хабарлама сәтті жіберілді!',
      error: 'Хабарлама жіберілмеді. Қайта көріңіз.',
    },
    blog: {
      title: 'Блог',
      subtitle: 'Ойлар, оқулықтар және түсініктер',
      readMore: 'Толығырақ оқу',
      comingSoon: 'Жақында',
      noPosts: 'Әзірге жазбалар жоқ. Кейінірек қайта тексеріңіз!',
    },
    settings: {
      title: 'Параметрлер',
      theme: 'Тема',
      language: 'Тіл',
      mode: 'Режим',
      light: 'Жарық',
      dark: 'Қараңғы',
      colorTheme: 'Түс тақырыбы',
    },
    footer: {
      rights: 'Барлық құқықтар қорғалған',
      builtWith: 'арқылы жасалған',
      by: '',
    },
    timeline: {
      title: 'Сапар',
      subtitle: 'Менің кәсіби уақыт шкалам',
    },
  },
  ky: {
    nav: {
      home: 'Башкы бет',
      about: 'Мен жөнүндө',
      skills: 'Көндүмдө��',
      projects: 'Долбоорлор',
      contact: 'Байланыш',
      blog: 'Блог',
      settings: 'Жөндөөлөр',
    },
    hero: {
      greeting: 'Мен',
      description: 'AI, эмоция жана кыял инженериясы',
      viewProjects: 'Долбоорлорду көрүү',
      contactMe: 'Байланыш',
    },
    about: {
      title: 'Мен жөнүндө',
      description: 'Мен Түркияда жашайм, ашпозчу болуп иштейм жана программалоону хобби катары өнүктүрөм. Бош убактымда үйрөнүп, AI жөнүндө макалаларды окуп, жаңы нерселерди практикага айландырууга аракет кылам.',
      intro: 'Ашпозчулук, программалоо жана жасалма интеллектке болгон кызыгууну бирге өнүктүргөн изденүүчү адаммын.',
      greeting: 'Салам,',
      paragraph1: 'Мен **Zuziâ RodzeN**мин. **Түркияда** жашайм. Лицейди туризм багытындагы мектепте окугам. Азыр активдүү түрдө **ашпозчу** болуп иштейм, ал эми программалоо мен үчүн **хобби**.',
      paragraph2: 'Бош убактымда өзүмдү өнүктүрүүгө өзгөчө көңүл бурам. **Программалоо менен ашпозчулукта** өсүп жатканымда, ошол эле учурда **жасалма интеллект** тууралуу макалаларды да окуйм. **Жаңы нерселерди үйрөнүү жана аларды практикада колдоно билүү** мен үчүн абдан маанилүү.',
      paragraph3: 'Досторум кайсы бир маселе боюнча жардам сураганда, колдон келишинче **колдоо көрсөтүүгө** аракет кылам.',
      paragraph4: 'Хоббилеримдин ичинде **аниме көрүү**, **рок-н-ролл угуу**, айрыкча Анадолу рок, панк, 70-, 80-, 90-жылдардын рок музыкасы жана инди-рок, кино көрүү жана **жасалма интеллект боюнча изилдөө жүргүзүү** бар. Ар бир жаңы маалыматты окуганда **"Муну мен да жасай аламбы?"** деп өзүмө суроо бергеним мени дайыма алдыга түртөт.',
      traits: {
        problemSolver: 'Өзүн өнүктүрүү',
        teamPlayer: 'Колдоого даяр',
        lifelongLearner: 'Кызыгуучу үйрөнүүчү',
        openSource: 'Практикага багытталган',
      },
      highlights: {
        aiSpecialist: 'Туризм жана Ашкана',
        aiSpecialistDesc: 'Туризм багытындагы билимим жана ашпозчу болуп активдүү иштегеним тартипти, ылдамдыкты жана ишке болгон мамилемди калыптандырды.',
        fullStackDev: 'Программалоо Хобби',
        fullStackDevDesc: 'Программалоо - бул мен бош убактымда үйрөнүп, сынап көрүп, өз нерселеримди жасай турган жеке аянтым.',
        productFocused: 'AI Кызыгуусу',
        productFocusedDesc: 'Жасалма интеллект тууралуу макалаларды окуп, жаңы өнүгүүлөрдү байкап, үйрөнгөндөрүмдү практикада колдонууга аракет кылам.',
        performanceDriven: 'Жардам Берген Мүнөз',
        performanceDrivenDesc: 'Өзүмдү өнүктүрүүгө маани берем жана досторум жардам сураганда колдон келишинче колдоо көрсөтүүгө аракет кылам.',
      },
    },
    skills: {
      title: 'Көндүмдөр жана технологиялар',
      subtitle: 'Идеяларды ишке ашыруу үчүн колдонгон технологиялар',
      frontend: 'Frontend',
      backend: 'Backend',
      ai: 'AI & ML',
      tools: 'Куралдар',
    },
    projects: {
      title: 'Долбоорлор',
      subtitle: 'Менин иштеген долбоорлорум',
      github: 'GitHub долбоорлору',
      featured: 'Тандалган долбоорлор',
      viewAll: 'Баарын көрүү',
    },
    contact: {
      title: 'Байланыш',
      subtitle: 'Төмөнкү терминал аркылуу мага кайрылыңыз!',
      welcomeMessage: 'Байланыш терминалына кош келиңиз!',
      helpHint: "Жеткиликтүү буйруктарды көрүү үчүн 'help' териңиз.",
      send: 'Жөнөтүү',
      name: 'Аты',
      email: 'Email',
      message: 'Билдирүү',
      success: 'Билдирүү ийгиликтүү жөнөтүлдү!',
      error: 'Билдирүү жөнөтүлгөн жок. Кайра аракет кылыңыз.',
    },
    blog: {
      title: 'Блог',
      subtitle: 'Ойлор, сабактар жана түшүнүктөр',
      readMore: 'Толугураак окуу',
      comingSoon: 'Жакында',
      noPosts: 'Азырынча жазуулар жок. Кийинчерээк текшериңиз!',
    },
    settings: {
      title: 'Жөндөөлөр',
      theme: 'Тема',
      language: 'Тил',
      mode: 'Режим',
      light: 'Жарык',
      dark: 'Караңгы',
      colorTheme: 'Түс темасы',
    },
    footer: {
      rights: 'Бардык укуктар корголгон',
      builtWith: 'менен жасалган',
      by: '',
    },
    timeline: {
      title: 'Сапар',
      subtitle: 'Менин кесиптик убакыт сызыгым',
    },
  },
}

const translationExtensions: Partial<Record<Language, Translations>> = {
  en: {
    social: {
      instagram: 'Instagram',
      github: 'GitHub',
      discord: 'Discord',
      youtube: 'YouTube',
      twitter: 'X',
    },
    nav: {
      toggleMenu: 'Toggle menu',
    },
    hero: {
      available: 'Available for new projects',
      findMeOn: 'Find me on',
    },
    loader: {
      title: 'Loading interface',
      subtitle: 'Preparing the portfolio experience for you.',
    },
    skills: {
      extraExperience: 'Also experienced with',
      categories: {
        languages: {
          name: 'Languages',
          description: 'Core programming languages and web fundamentals I rely on in my projects.',
        },
        frontend: {
          name: 'Frontend',
          description: 'Interfaces, component systems, and animation tools I use to shape the user experience.',
        },
        aiMl: {
          name: 'AI & ML',
          description: 'Models, providers, and AI tools I explore while learning and building practical ideas.',
        },
        backend: {
          name: 'Backend',
          description: 'Server-side tools and services I use to power APIs, bots, and app logic.',
        },
        devops: {
          name: 'DevOps & Tools',
          description: 'Deployment platforms and developer tools I use to ship and manage projects.',
        },
        system: {
          name: 'System',
          description: 'Foundational tools and environments that support my workflow and technical growth.',
        },
        design: {
          name: 'Design',
          description: 'Design tools I use to plan layouts, interfaces, and visual ideas before building.',
        },
        databaseCloud: {
          name: 'Database & Cloud',
          description: 'Storage and cloud services I use for real-time data, media handling, and app support.',
        },
      },
    },
    projects: {
      featuredWork: 'Featured Work',
      featuredBadge: 'Featured',
      liveDemo: 'Live Demo',
      source: 'Source',
      discord: 'Discord',
      items: {
        neuroa: {
          title: 'Neuroa AI',
          description: 'A creative AI project and community space where I experiment with tools, ideas, and artistic workflows.',
        },
        noteai: {
          title: 'NoteAI',
          description: 'An AI-supported desktop notes experience focused on writing, organization, and practical productivity.',
        },
        mirai: {
          title: 'Mirai 2.0',
          description: 'A lightweight AI experiment where I explore prompting, assistant behaviors, and generative workflows.',
        },
        neuroaBot: {
          title: 'Neuroa Bot',
          description: 'A community-focused bot project built around automation, utility features, and AI-assisted interaction.',
        },
      },
    },
    contact: {
      cancel: 'Cancel',
      subject: 'Subject',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'you@example.com',
      subjectPlaceholder: 'Project title or inquiry',
      messagePlaceholder: 'Tell me about your project or inquiry...',
      sending: 'Sending...',
      backToTerminal: 'Back to Terminal',
      successDetail: "Thank you for reaching out. I'll get back to you soon.",
      commandPlaceholder: 'Type your command...',
      commandsTitle: 'Available commands:',
      contactInfoTitle: 'Contact information:',
      availability: 'Available',
      availabilityValue: 'Open to new opportunities',
      typeSendHint: 'Type "send" to use the contact form',
      socialLinksTitle: 'Social links:',
      openingForm: 'Opening contact form...',
      commandNotFoundPrefix: 'Command not found: ',
      commandNotFoundSuffix: ". Type 'help' to see available commands.",
      commands: {
        help: '  help     - Show available commands',
        email: '  email    - Show email address',
        social: '  social   - Show social links',
        contact: '  contact  - Open contact form',
        send: '  send     - Open contact form',
        clear: '  clear    - Clear terminal',
      },
    },
    blog: {
      temporaryNotice: 'This section is temporarily closed while I prepare new posts. It will be back soon.',
    },
    settings: {
      open: 'Open settings',
      themeNames: {
        purple: 'Violet',
        blue: 'Ocean',
        green: 'Emerald',
        red: 'Ruby',
        orange: 'Sunset',
        pink: 'Rose',
        cyan: 'Arctic',
        amber: 'Amber',
      },
      languageNames: {
        en: 'English',
        ja: 'Japanese',
        ru: 'Russian',
        az: 'Azerbaijani',
        tr: 'Turkish',
        kk: 'Kazakh',
        ky: 'Kyrgyz',
      },
    },
    timeline: {
      companies: {
        zuziaPortNature: 'Personal Journey',
        portNature: 'Learning Milestone',
      },
      events: {
        plans2026: {
          title: 'Card System Plans',
          description: 'I want to build a card-focused project that feels practical, useful, and closer to the kind of products I imagine.',
        },
        bot2026: {
          title: 'Neuroa Bot Direction',
          description: 'I am shaping a smarter Neuroa bot experience around community tools, automation, and AI-assisted features.',
        },
        neuroa2025: {
          title: 'Built Neuroa AI',
          description: 'I started turning my ideas into a more serious AI project by combining creativity, experiments, and a stronger product vision.',
        },
        separation2025: {
          title: 'Went Through a Separation',
          description: 'This year also came with a difficult personal separation that changed how I see motivation, balance, and growth.',
        },
        love2025: {
          title: 'A Meaningful Relationship',
          description: 'A strong emotional period became part of my story and influenced the way I think about empathy, people, and connection.',
        },
        break2025: {
          title: 'Took Time to Breathe',
          description: 'I had to slow down for a while, step back, and rethink what I wanted to build next.',
        },
        aiAdvance2025: {
          title: 'Moved Deeper into AI',
          description: 'I spent more time reading, testing, and understanding modern AI tools so I could turn curiosity into real practice.',
        },
        firstModel2024: {
          title: 'First Model Experiments',
          description: 'I began experimenting with my first AI model ideas and learned how exciting it feels to see concepts come alive.',
        },
        design2023: {
          title: 'Started Design Practice',
          description: 'I became more interested in visual design, layout, and the small details that make interfaces feel better.',
        },
        api2023: {
          title: 'Built My First APIs',
          description: 'I started building backend logic and simple APIs, which helped me understand how applications work behind the scenes.',
        },
        frontend2023: {
          title: 'Frontend Foundations',
          description: 'I spent time learning the basics of frontend development and started turning ideas into real interfaces.',
        },
        aiIntro2022: {
          title: 'First Interest in AI',
          description: 'My curiosity about artificial intelligence started growing and I began reading more about what these systems could do.',
        },
        graduation2022: {
          title: 'Graduated from Tourism High School',
          description: 'I completed tourism high school, a period that shaped my discipline, pace, and work ethic.',
        },
        languages2021: {
          title: 'Started Learning Digital Tools',
          description: 'I became more comfortable exploring technical concepts, online tools, and digital spaces on my own.',
        },
        discord2021: {
          title: 'Found Online Communities',
          description: 'Platforms like Discord helped me see how people learn together, share ideas, and build communities around shared interests.',
        },
        pandemic2020: {
          title: 'Pandemic Years',
          description: 'The pandemic changed daily life, but it also created more space to think, search, and slowly discover new interests.',
        },
      },
    },
  },
  tr: {
    social: {
      instagram: 'Instagram',
      github: 'GitHub',
      discord: 'Discord',
      youtube: 'YouTube',
      twitter: 'X',
    },
    nav: {
      toggleMenu: 'Menüyü aç/kapat',
    },
    hero: {
      available: 'Yeni projelere açığım',
      findMeOn: 'Beni burada bul',
    },
    loader: {
      title: 'Arayüz yükleniyor',
      subtitle: 'Portfolyo deneyimi senin için hazırlanıyor.',
    },
    skills: {
      extraExperience: 'Ek olarak deneyimliyim',
      categories: {
        languages: {
          name: 'Diller',
          description: 'Projelerimde ve denemelerimde kullandığım temel programlama dilleri ve web altyapısı.',
        },
        frontend: {
          name: 'Frontend',
          description: 'Kullanıcı deneyimini şekillendirmek için kullandığım arayüz, component ve animasyon araçları.',
        },
        aiMl: {
          name: 'AI & ML',
          description: 'Öğrenirken ve yeni fikirler üretirken kullandığım model, sağlayıcı ve yapay zekâ araçları.',
        },
        backend: {
          name: 'Backend',
          description: 'API, bot ve uygulama mantığı kurarken kullandığım sunucu tarafı araçlar ve servisler.',
        },
        devops: {
          name: 'DevOps & Araçlar',
          description: 'Projeleri yayınlamak ve yönetmek için kullandığım deployment platformları ve geliştirici araçları.',
        },
        system: {
          name: 'Sistem',
          description: 'Çalışma düzenimi ve teknik gelişimimi destekleyen temel araçlar ve ortamlar.',
        },
        design: {
          name: 'Tasarım',
          description: 'Bir şey üretmeden önce arayüz, yerleşim ve görsel fikirleri planlamak için kullandığım araçlar.',
        },
        databaseCloud: {
          name: 'Veritabanı & Cloud',
          description: 'Gerçek zamanlı veri, medya yönetimi ve uygulama desteği için kullandığım servisler.',
        },
      },
    },
    projects: {
      featuredWork: 'Öne Çıkan Çalışmalar',
      featuredBadge: 'Öne Çıkan',
      liveDemo: 'Canlı Demo',
      source: 'Kaynak',
      discord: 'Discord',
      items: {
        neuroa: {
          title: 'Neuroa AI',
          description: 'Araçlar, fikirler ve yaratıcı akışlar üzerine denemeler yaptığım yaratıcı bir yapay zekâ projesi ve topluluk alanı.',
        },
        noteai: {
          title: 'NoteAI',
          description: 'Yazı yazma, düzen ve günlük üretkenlik üzerine odaklanan, yapay zekâ destekli masaüstü not deneyimi.',
        },
        mirai: {
          title: 'Mirai 2.0',
          description: 'Prompt, asistan davranışları ve üretken akışlar üzerine denemeler yaptığım hafif bir yapay zekâ projesi.',
        },
        neuroaBot: {
          title: 'Neuroa Bot',
          description: 'Otomasyon, yardımcı özellikler ve yapay zekâ destekli etkileşim etrafında kurduğum topluluk odaklı bot projesi.',
        },
      },
    },
    contact: {
      cancel: 'Vazgeç',
      subject: 'Konu',
      namePlaceholder: 'Adın',
      emailPlaceholder: 'sen@example.com',
      subjectPlaceholder: 'Proje başlığı veya konu',
      messagePlaceholder: 'Projeni ya da ne için yazdığını anlat...',
      sending: 'Gönderiliyor...',
      backToTerminal: 'Terminale Dön',
      successDetail: 'Ulaştığın için teşekkür ederim. En kısa sürede dönüş yapacağım.',
      commandPlaceholder: 'Komutunu yaz...',
      commandsTitle: 'Kullanılabilir komutlar:',
      contactInfoTitle: 'İletişim bilgileri:',
      availability: 'Uygunluk',
      availabilityValue: 'Yeni fırsatlara açığım',
      typeSendHint: 'İletişim formunu kullanmak için "send" yaz',
      socialLinksTitle: 'Sosyal bağlantılar:',
      openingForm: 'İletişim formu açılıyor...',
      commandNotFoundPrefix: 'Komut bulunamadı: ',
      commandNotFoundSuffix: ". Kullanılabilir komutları görmek için 'help' yazın.",
      commands: {
        help: '  help     - Kullanılabilir komutları göster',
        email: '  email    - E-posta adresini göster',
        social: '  social   - Sosyal bağlantıları göster',
        contact: '  contact  - İletişim formunu aç',
        send: '  send     - İletişim formunu aç',
        clear: '  clear    - Terminali temizle',
      },
    },
    blog: {
      temporaryNotice: 'Yeni yazıları hazırlarken bu bölüm geçici olarak kapalı. Çok yakında yeniden açılacak.',
    },
    settings: {
      open: 'Ayarları aç',
      themeNames: {
        purple: 'Viyole',
        blue: 'Okyanus',
        green: 'Zümrüt',
        red: 'Yakut',
        orange: 'Gün Batımı',
        pink: 'Gül',
        cyan: 'Arktik',
        amber: 'Amber',
      },
      languageNames: {
        en: 'İngilizce',
        ja: 'Japonca',
        ru: 'Rusça',
        az: 'Azerbaycanca',
        tr: 'Türkçe',
        kk: 'Kazakça',
        ky: 'Kırgızca',
      },
    },
    timeline: {
      companies: {
        zuziaPortNature: 'Kişisel Yolculuk',
        portNature: 'Öğrenim Durağı',
      },
      events: {
        plans2026: {
          title: 'Kart Sistemi Planları',
          description: 'Daha pratik, daha işe yarar ve kafamdaki ürünlere daha yakın hissettiren kart odaklı bir proje geliştirmek istiyorum.',
        },
        bot2026: {
          title: 'Neuroa Bot Yönü',
          description: 'Neuroa Bot tarafında topluluk araçları, otomasyon ve yapay zekâ destekli özellikler etrafında daha akıllı bir yapı kuruyorum.',
        },
        neuroa2025: {
          title: 'Neuroa AI\'ı Geliştirdim',
          description: 'Yaratıcılığı, denemeleri ve daha güçlü bir ürün fikrini bir araya getirerek düşüncelerimi daha ciddi bir yapay zekâ projesine dönüştürmeye başladım.',
        },
        separation2025: {
          title: 'Bir Ayrılık Dönemi Yaşadım',
          description: 'Bu yıl aynı zamanda motivasyon, denge ve gelişim anlayışımı etkileyen zor bir kişisel ayrılık süreci de getirdi.',
        },
        love2025: {
          title: 'Anlamlı Bir İlişki',
          description: 'Yoğun bir duygusal dönem hikâyemin bir parçası oldu ve empatiye, insanlara ve bağ kurmaya bakışımı etkiledi.',
        },
        break2025: {
          title: 'Biraz Nefes Aldım',
          description: 'Bir süre yavaşlamam, geri çekilip sıradaki adımda ne üretmek istediğimi yeniden düşünmem gerekti.',
        },
        aiAdvance2025: {
          title: 'Yapay Zekâya Daha Fazla Yaklaştım',
          description: 'Merakımı gerçek pratiğe çevirebilmek için modern yapay zekâ araçlarını daha çok okuyup test etmeye ve anlamaya zaman ayırdım.',
        },
        firstModel2024: {
          title: 'İlk Model Denemeleri',
          description: 'İlk yapay zekâ model fikirlerim üzerinde denemeler yapmaya başladım ve fikirlerin canlandığını görmenin ne kadar heyecan verici olduğunu hissettim.',
        },
        design2023: {
          title: 'Tasarım Tarafına Girdim',
          description: 'Görsel tasarım, yerleşim ve arayüzleri daha iyi hissettiren küçük detaylarla daha fazla ilgilenmeye başladım.',
        },
        api2023: {
          title: 'İlk API\'lerimi Yazdım',
          description: 'Backend mantığı ve basit API\'ler kurmaya başladım; bu da uygulamaların arka planda nasıl çalıştığını daha iyi anlamamı sağladı.',
        },
        frontend2023: {
          title: 'Frontend Temelleri',
          description: 'Frontend geliştirmenin temellerini öğrenmeye zaman ayırdım ve fikirleri gerçek arayüzlere dönüştürmeye başladım.',
        },
        aiIntro2022: {
          title: 'Yapay Zekâya İlk İlgi',
          description: 'Yapay zekâya olan merakım büyümeye başladı ve bu sistemlerin neler yapabildiği hakkında daha fazla okumaya başladım.',
        },
        graduation2022: {
          title: 'Turizm Lisesinden Mezuniyet',
          description: 'Turizm lisesini tamamladım; bu dönem disiplinimi, tempomu ve çalışma anlayışımı şekillendirdi.',
        },
        languages2021: {
          title: 'Dijital Araçları Öğrenmeye Başladım',
          description: 'Teknik kavramları, online araçları ve dijital alanları kendi başıma keşfetme konusunda daha rahat hale geldim.',
        },
        discord2021: {
          title: 'Online Toplulukları Keşfettim',
          description: 'Discord gibi platformlar, insanların birlikte öğrenip fikir paylaştığını ve ortak ilgi alanları etrafında topluluk kurduğunu görmemi sağladı.',
        },
        pandemic2020: {
          title: 'Pandemi Dönemi',
          description: 'Pandemi günlük hayatı değiştirdi ama aynı zamanda düşünmek, araştırmak ve yeni ilgi alanlarını yavaş yavaş keşfetmek için daha fazla alan açtı.',
        },
      },
    },
  },
}

function mergeTranslations(base: Translations, extension: Translations): Translations {
  const merged: Translations = { ...base }

  for (const [key, value] of Object.entries(extension)) {
    if (
      typeof value === 'object' &&
      value !== null &&
      typeof merged[key] === 'object' &&
      merged[key] !== null
    ) {
      merged[key] = mergeTranslations(merged[key] as Translations, value as Translations)
    } else {
      merged[key] = value
    }
  }

  return merged
}

const translations = (Object.keys(baseTranslations) as Language[]).reduce(
  (acc, lang) => {
    acc[lang] = translationExtensions[lang]
      ? mergeTranslations(baseTranslations[lang], translationExtensions[lang] as Translations)
      : baseTranslations[lang]
    return acc
  },
  {} as Record<Language, Translations>
)

const getTranslationValue = (lang: Language, key: string): string | undefined => {
  const keys = key.split('.')
  let value: string | Translations = translations[lang]
  
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = value[k]
    } else {
      return undefined
    }
  }
  
  return typeof value === 'string' ? value : undefined
}

const defaultT = (key: string): string => {
  return getTranslationValue('en', key) ?? key
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: defaultT,
})

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
]

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const savedLang = localStorage.getItem('language')

  if (savedLang && savedLang in translations) {
    return savedLang as Language
  }

  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return getTranslationValue(language, key) ?? getTranslationValue('en', key) ?? key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  return useContext(I18nContext)
}
