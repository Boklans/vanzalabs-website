export interface ProductData {
  slug: 'spot' | 'formgrid' | 'invoices' | 'convert';
  name: string;
  shortName: string;
  packageId: string;
  playStoreUrl: string;
  privacyUrl: string;
  category: string;
  accentHex: string;
  accentBgClass: string;
  accentTextClass: string;
  accentBorderClass: string;
  icon: string;
  qr: string;
  screens: { src: string; labelEn: string; labelUk: string }[];
  stack: string[];
  en: {
    tagline: string;
    metaTitle: string;
    metaDesc: string;
    summary: string;
    badge: string;
    features: { title: string; desc: string }[];
    highlights: { value: string; label: string }[];
    faq: { q: string; a: string }[];
  };
  uk: {
    tagline: string;
    metaTitle: string;
    metaDesc: string;
    summary: string;
    badge: string;
    features: { title: string; desc: string }[];
    highlights: { value: string; label: string }[];
    faq: { q: string; a: string }[];
  };
}

export const products: ProductData[] = [
  {
    slug: 'spot',
    name: 'SPOT — Training & Progress',
    shortName: 'SPOT',
    packageId: 'com.vanzalabs.spot',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.vanzalabs.spot',
    privacyUrl: '/privacy-policy',
    category: 'HealthApplication',
    accentHex: '#C8FF3D',
    accentBgClass: 'bg-lime-400/15',
    accentTextClass: 'text-[#C8FF3D]',
    accentBorderClass: 'border-lime-400/30',
    icon: '/images/spot_logo.png',
    qr: '/images/qr_spot.png',
    screens: [
      { src: '/images/screen_spot.jpg', labelEn: 'Live Workout', labelUk: 'Лайв-тренування' },
      { src: '/images/spot_screen_2.png', labelEn: 'Muscle Recovery', labelUk: 'Відновлення м’язів' },
      { src: '/images/spot_screen_3.png', labelEn: 'Analytics & PRs', labelUk: 'Аналітика і PR' },
    ],
    stack: ['React Native', 'Expo Router', 'Zustand', 'Supabase', 'RevenueCat'],
    en: {
      tagline: 'Precision Workout Tracker & Muscle Recovery Engine',
      metaTitle: 'SPOT — Precision Workout Tracker & Muscle Recovery Engine | VanzaLabs',
      metaDesc:
        'An intelligent, dark-aesthetic strength training companion with algorithmic muscle recovery tracking, custom splits, and tactile live session logging.',
      summary:
        'Dark-aesthetic strength training companion for lifters and athletes. Combines algorithmic muscle recovery modeling (0–100%), dynamic split generation, and distraction-free live set logging with haptic rest timers.',
      badge: 'B2C Mobile App · Fitness',
      features: [
        { title: 'Muscle Readiness Engine', desc: 'Algorithmic recovery score (0–100%) per muscle group using time-decay workload modeling.' },
        { title: 'Adaptive Split Generator', desc: 'Auto-generated PPL, Upper/Lower, and Full Body routines tailored to your days and equipment.' },
        { title: 'Focused Live Set Tracker', desc: 'Fast weight/rep logging with built-in haptic rest timers that stay reliable in the background.' },
        { title: 'PR & Tonnage Analytics', desc: 'Personal records tracking, muscle balance breakdown, and long-term volume progression.' },
      ],
      highlights: [
        { value: '0–100%', label: 'Muscle readiness model' },
        { value: '100%', label: 'Offline gym logging' },
        { value: 'Haptic', label: 'Tactile rest timers' },
      ],
      faq: [
        { q: 'Does SPOT work offline inside a gym basement?', a: 'Yes. All active workout logging, rest timers, and history work 100% offline and sync smoothly once reconnected.' },
        { q: 'How does Muscle Readiness calculate recovery?', a: 'It uses a time-decay fatigue model based on logged sets, intensity, and muscle group recovery windows.' },
      ],
    },
    uk: {
      tagline: 'Розумний трекер тренувань та відновлення м’язів',
      metaTitle: 'SPOT — Трекер тренувань та відновлення м’язів | VanzaLabs',
      metaDesc:
        'Преміальний фітнес-застосунок у темній естетиці: алгоритм відновлення м’язів, генератор спліт-програм та лайв-трекер підходів.',
      summary:
        'Преміальний фітнес-застосунок для силових тренувань. Поєднує математичну модель відновлення м’язових груп (0–100%), генератор персональних програм і фокусований лайв-трекер підходів.',
      badge: 'B2C Мобільний додаток · Фітнес',
      features: [
        { title: 'Muscle Readiness Engine', desc: 'Розрахунок відновлення кожної групи м’язів (0–100%) на базі моделі часового спаду втоми.' },
        { title: 'Генератор програм', desc: 'Адаптивні спліти (PPL, Верх/Низ, Full Body) під ваші цілі, рівень та кількість днів.' },
        { title: 'Лайв-трекер підходів', desc: 'Швидкий запис ваги та повторень із тактильним таймером відпочинку у фоновому режимі.' },
        { title: 'Аналітика та рекорди', desc: 'Фіксація особистих рекордів (PR), баланс навантаження та динаміка робочого тоннажу.' },
      ],
      highlights: [
        { value: '0–100%', label: 'Модель відновлення' },
        { value: '100%', label: 'Робота в залі офлайн' },
        { value: 'Haptic', label: 'Тактильний таймер' },
      ],
      faq: [
        { q: 'Чи працює SPOT без інтернету в залі?', a: 'Так. Усі тренування, таймери та історія підходів працюють повністю офлайн.' },
        { q: 'Як рахується відновлення м’язів?', a: 'Алгоритм аналізує обсяг виконаних підходів і час після тренування для кожної групи м’язів.' },
      ],
    },
  },
  {
    slug: 'formgrid',
    name: 'FormGrid: Forms & Sheets',
    shortName: 'FormGrid',
    packageId: 'com.vanza.formgrid',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.vanza.formgrid',
    privacyUrl: '/privacy/formgrid',
    category: 'BusinessApplication',
    accentHex: '#3B82F6',
    accentBgClass: 'bg-blue-500/15',
    accentTextClass: 'text-blue-400',
    accentBorderClass: 'border-blue-500/30',
    icon: '/images/formgrid_icon_512.png',
    qr: '/images/qr_formgrid.png',
    screens: [
      { src: '/images/formgrid_screenshot.jpg', labelEn: 'Workspace', labelUk: 'Робочий простір' },
      { src: '/images/formgrid_screen_2.png', labelEn: 'Sheets Builder', labelUk: 'Google Таблиці' },
      { src: '/images/formgrid_screen_3.png', labelEn: 'Import & Hub', labelUk: 'Імпорт і форми' },
    ],
    stack: ['Flutter', 'Google Forms API', 'Google Sheets API', 'Offline Queue', 'RevenueCat'],
    en: {
      tagline: 'Native Mobile Workspace for Google Forms & Sheets',
      metaTitle: 'FormGrid — Mobile Workspace for Google Forms & Sheets | VanzaLabs',
      metaDesc:
        'Build Google Forms, auto-link Google Sheets in 1 tap, and queue field submissions offline with direct Google API privacy and zero middleman servers.',
      summary:
        'Native mobile workspace for Google Forms™ and Google Sheets™ built for field teams and small businesses. Create forms, link sheets in 1 tap, and collect data offline with direct-to-Google API privacy.',
      badge: 'B2B Productivity · Google Workspace',
      features: [
        { title: 'Form + Sheet in 1 Tap', desc: 'Visual mobile form builder auto-linked to Google Sheets with ready business templates.' },
        { title: '100% Offline Queue', desc: 'Collect field entries without signal — submissions buffer locally and auto-sync when online.' },
        { title: 'Zero Middleman Servers', desc: 'Direct client-to-Google API connection with strictest drive.file scope privacy.' },
        { title: 'Branded QR & Drive Import', desc: 'Generate shareable QR codes for surveys and import files right from the system Share sheet.' },
      ],
      highlights: [
        { value: '0', label: 'Middleman servers' },
        { value: 'Offline', label: 'Auto-sync queue' },
        { value: '1-tap', label: 'Form → Sheet link' },
      ],
      faq: [
        { q: 'Can FormGrid access my other private files on Google Drive?', a: 'No. FormGrid uses the strictest drive.file OAuth scope and can only access files created or explicitly opened with FormGrid.' },
        { q: 'How does the offline submission queue work?', a: 'Rows submitted without cell reception are safely stored on-device and pushed automatically to Google Sheets once connectivity returns.' },
      ],
    },
    uk: {
      tagline: 'Мобільний робочий простір для Google Forms і Sheets',
      metaTitle: 'FormGrid — Мобільний клієнт для Google Forms і Sheets | VanzaLabs',
      metaDesc:
        'Створюйте Google Форми, прив’язуйте таблиці в 1 дотик і збирайте дані офлайн з прямою інтеграцією Google API без проміжних серверів.',
      summary:
        'Мобільний робочий простір для Google Forms™ і Google Sheets™: створюйте анкети, таблиці й додавайте записи зі смартфона навіть без інтернету — напряму через офіційні Google API.',
      badge: 'B2B Продуктивність · Google Workspace',
      features: [
        { title: 'Форма + таблиця в 1 дотик', desc: 'Конструктор форм з авто-прив’язкою до Google-таблиці та готовими бізнес-шаблонами.' },
        { title: 'Працює без інтернету', desc: 'Нові рядки потрапляють в офлайн-чергу і самі синхронізуються при появі мережі.' },
        { title: 'Приватність за архітектурою', desc: 'Зв’язок напряму з Google API без власних серверів (доступ лише до власних файлів).' },
        { title: 'QR-дизайнер & Drive', desc: 'Миттєва генерація QR-кодів для анкет та імпорт файлів через системне меню «Поділитися».' },
      ],
      highlights: [
        { value: '0', label: 'Проміжних серверів' },
        { value: 'Офлайн', label: 'Черга синхронізації' },
        { value: '1 дотик', label: 'Форма → Таблиця' },
      ],
      faq: [
        { q: 'Чи бачить FormGrid інші мої файли в Google Drive?', a: 'Ні. Додаток використовує найсуворіший дозвіл drive.file — доступ є лише до файлів, створених або відкритих у FormGrid.' },
        { q: 'Як працює офлайн-черга?', a: 'Дані, введені без зв’язку, зберігаються локально на пристрої й автоматично відправляються в Google Sheets після появи інтернету.' },
      ],
    },
  },
  {
    slug: 'invoices',
    name: 'Vanza Docs: Invoices & Contracts',
    shortName: 'Invoices',
    packageId: 'app.vanza.docs',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=app.vanza.docs',
    privacyUrl: '/privacy/invoices',
    category: 'BusinessApplication',
    accentHex: '#60A5FA',
    accentBgClass: 'bg-sky-500/15',
    accentTextClass: 'text-sky-400',
    accentBorderClass: 'border-sky-500/30',
    icon: '/images/invoices_icon_512.png',
    qr: '/images/qr_invoices.png',
    screens: [
      { src: '/images/invoices_screenshot.png', labelEn: 'Document Editor', labelUk: 'Редактор PDF' },
      { src: '/images/invoices_screen_2.png', labelEn: 'Documents & Acts', labelUk: 'Документи і акти' },
      { src: '/images/invoices_screen_3.png', labelEn: 'Clients Directory', labelUk: 'База клієнтів' },
    ],
    stack: ['Flutter', 'IndexedDB / Local-First', 'PDF Engine', 'Google Drive Backup', 'RevenueCat'],
    en: {
      tagline: 'Invoices, Estimates & Contracts on the Job Site',
      metaTitle: 'Vanza Docs — Invoices, Estimates & Contracts in 60 Seconds | VanzaLabs',
      metaDesc:
        'Pocket commercial document generator for contractors and freelancers. Create PDF estimates, contracts, and invoices offline with on-screen client signatures.',
      summary:
        'Pocket commercial document generator for contractors, service businesses, and freelancers. Create estimates, contracts, invoices, and acts as crisp PDFs right on site — 100% offline with touch signatures.',
      badge: 'FinTech & Docs · Contractors',
      features: [
        { title: 'PDF in 60 Seconds', desc: 'Auto totals, taxes, discounts, written amounts, and 1-tap sharing to WhatsApp, Telegram, or email.' },
        { title: 'On-Screen Signature & Stamp', desc: 'Capture client finger signatures upon job completion plus your own custom transparent stamp.' },
        { title: '100% Offline & Private', desc: 'Clients, price lists, and documents live strictly on your device with optional personal Drive backup.' },
        { title: '20+ Currencies & Revenue', desc: 'Multi-currency invoicing (USD, EUR, UAH, GBP...) with an instant revenue dashboard.' },
      ],
      highlights: [
        { value: '60 sec', label: 'Ready PDF invoice' },
        { value: '20+', label: 'Currencies supported' },
        { value: '100%', label: 'Local-first privacy' },
      ],
      faq: [
        { q: 'Do I need an account or internet to issue an invoice?', a: 'No. Everything works offline with zero registration. Optional encrypted backup to your own Google Drive is available anytime.' },
        { q: 'Can clients sign contracts right on my phone?', a: 'Yes, clients can sign directly on screen and the signature is embedded cleanly into the exported PDF.' },
      ],
    },
    uk: {
      tagline: 'Кошториси, договори, рахунки та акти прямо на об’єкті',
      metaTitle: 'Vanza Docs — Рахунки, кошториси та договори за 1 хвилину | VanzaLabs',
      metaDesc:
        'Кишеньковий генератор PDF-документів для майстрів, фрілансерів і ФОП: кошториси, рахунки, акти та підпис клієнта на екрані без інтернету.',
      summary:
        'Кишеньковий генератор комерційних документів для сервісних бізнесів, майстрів та ФОП: кошторис, договір, рахунок чи акт у професійному PDF за 1 хвилину навіть без інтернету.',
      badge: 'FinTech & Документи · Малий бізнес',
      features: [
        { title: 'PDF за 1 хвилину', desc: 'Авто-підрахунок сум, знижок, податків, сума прописом та відправка в месенджери в 1 дотик.' },
        { title: 'Підпис і печатка на екрані', desc: 'Клієнт розписується пальцем при прийманні робіт + накладання власної печатки.' },
        { title: '100% офлайн і приватно', desc: 'Клієнти, прайси й документи зберігаються локально на пристрої з опційним бекапом у ваш Drive.' },
        { title: '20+ валют і аналітика', desc: 'Мультивалютний облік (UAH, USD, EUR...) та миттєвий дашборд виручки.' },
      ],
      highlights: [
        { value: '1 хв', label: 'Готовий PDF-рахунок' },
        { value: '20+', label: 'Підтримуваних валют' },
        { value: '100%', label: 'Локальна приватність' },
      ],
      faq: [
        { q: 'Чи потрібен інтернет або реєстрація?', a: 'Ні. Додаток працює повністю офлайн без акаунту. За бажанням можна ввімкнути бекап у ваш Google Drive.' },
        { q: 'Чи може клієнт підписати акт на екрані?', a: 'Так, підпис пальцем одразу вбудовується в готовий PDF-документ.' },
      ],
    },
  },
  {
    slug: 'convert',
    name: 'Vanza: Convert & Compress',
    shortName: 'Convert',
    packageId: 'tech.vanzalabs.convertcompress',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=tech.vanzalabs.convertcompress',
    privacyUrl: '/privacy/convert',
    category: 'UtilitiesApplication',
    accentHex: '#10B981',
    accentBgClass: 'bg-emerald-500/15',
    accentTextClass: 'text-emerald-400',
    accentBorderClass: 'border-emerald-500/30',
    icon: '/images/convert_icon_512.png',
    qr: '/images/qr_convert.png',
    screens: [
      { src: '/images/convert_screen_1.png', labelEn: 'Live Compression', labelUk: 'Стиснення фото' },
      { src: '/images/convert_screen_2.png', labelEn: 'Batch Convert', labelUk: 'Пакетна конвертація' },
      { src: '/images/convert_screen_3.png', labelEn: 'AES-256 PDF Studio', labelUk: 'PDF-студія AES-256' },
    ],
    stack: ['Flutter', 'Native Image Codec', 'AES-256 PDF', '100% On-Device'],
    en: {
      tagline: 'Offline Photo Compressor, HEIC Converter & AES-256 PDF Studio',
      metaTitle: 'Vanza Convert & Compress — Offline Photo Compressor & PDF Studio | VanzaLabs',
      metaDesc:
        'Compress photos up to -90% with live size preview, batch convert Apple HEIC to JPG/PNG, and encrypt PDFs with AES-256 — 100% offline with zero ads.',
      summary:
        'Fast 100% on-device photo compressor, Apple HEIC batch converter, and pocket PDF studio. Shrink files up to -90% with live size prediction and lock PDFs with AES-256 — zero cloud uploads, zero ads.',
      badge: 'Utility · 100% On-Device',
      features: [
        { title: 'Compress up to −90%', desc: 'Precision quality slider with live target size forecast before processing (3.4 MB → ~850 KB).' },
        { title: 'Batch Convert 30 Photos', desc: 'Instant HEIC, JPG, PNG, WebP → JPG/PNG/WebP/PDF without altering your original files.' },
        { title: 'Pocket PDF Studio', desc: 'Photo ↔ PDF conversion, merge/split documents, and local 256-bit AES password protection.' },
        { title: 'Zero Cloud & Zero Ads', desc: 'No Internet permission required for features — your documents never leave your device.' },
      ],
      highlights: [
        { value: '−90%', label: 'File size reduction' },
        { value: 'AES-256', label: 'Local PDF encryption' },
        { value: '0 ads', label: 'No trackers or cloud' },
      ],
      faq: [
        { q: 'Are my photos or PDFs ever uploaded to a server?', a: 'Never. All compression, conversion, and AES-256 encryption runs 100% locally on your phone hardware.' },
        { q: 'Does it modify my original photos?', a: 'No. Originals stay untouched; processed files are saved as new copies where you choose.' },
      ],
    },
    uk: {
      tagline: 'Офлайн-компресор фото, HEIC-конвертер та PDF-студія',
      metaTitle: 'Vanza Convert & Compress — Офлайн-стиснення фото та PDF-студія | VanzaLabs',
      metaDesc:
        'Стискайте фото до −90% із живим прогнозом розміру, пакетно конвертуйте HEIC у JPG/PNG і шифруйте PDF через AES-256 — 100% офлайн і без реклами.',
      summary:
        'Швидкий офлайн-конвертер і компресор фотографій + кишенькова PDF-студія. Стиснення до −90% з живим прогнозом розміру, пакетна конвертація HEIC і шифрування AES-256 без передачі файлів на сервери.',
      badge: 'Утиліта · 100% On-Device',
      features: [
        { title: 'Стиснення до −90%', desc: 'Повзунок якості з живим прогнозом розміру ще до обробки («3.4 МБ → ~850 КБ»).' },
        { title: 'Пакетна конвертація до 30 фото', desc: 'Миттєвий перевід HEIC, JPG, PNG, WebP → JPG/PNG/PDF без зміни оригіналів.' },
        { title: 'PDF-студія', desc: 'Конвертація фото ↔ PDF, об’єднання/розділення документів та шифрування AES-256.' },
        { title: 'Нуль хмари та реклами', desc: 'Повна приватність, робота без інтернету, трекерів і нав’язливих банерів.' },
      ],
      highlights: [
        { value: '−90%', label: 'Зменшення розміру' },
        { value: 'AES-256', label: 'Локальне шифрування' },
        { value: '0', label: 'Реклами і трекерів' },
      ],
      faq: [
        { q: 'Чи завантажуються мої фото на сервери?', a: 'Ніколи. Уся обробка та шифрування AES-256 виконуються виключно локально на вашому смартфоні.' },
        { q: 'Чи змінюються оригінальні файли?', a: 'Ні, оригінали залишаються недоторканими — результати зберігаються як нові файли.' },
      ],
    },
  },
];

export function getProduct(slug: ProductData['slug']): ProductData {
  const found = products.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown product: ${slug}`);
  return found;
}
