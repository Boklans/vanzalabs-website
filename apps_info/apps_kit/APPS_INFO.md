# Vanza Labs — матеріали для сайту: 3 застосунки

> Зібрано автоматично з ваших проєктів (`Mobile Workspace Hub`, `Vanza документи`, `фотоконвектор`) — 15.10.2026.
> Усі зображення лежать у папці `images/`, політики конфіденційності — у `privacy/`.

| Застосунок | Package ID | Google Play | Папка проєкту |
|---|---|---|---|
| **FormGrid: Forms & Sheets** | `com.vanza.formgrid` | https://play.google.com/store/apps/details?id=com.vanza.formgrid | `Mobile Workspace Hub/` |
| **Vanza: Invoices & Contracts** | `app.vanza.docs` | https://play.google.com/store/apps/details?id=app.vanza.docs | `Vanza документи/` |
| **Vanza: Convert & Compress** | `tech.vanzalabs.convertcompress` | https://play.google.com/store/apps/details?id=tech.vanzalabs.convertcompress | `фотоконвектор/` |

---

## 1. Скріншоти та іконки

| Застосунок | Скріншот (вертикальний) | Розмір | Іконка | Походження |
|---|---|---|---|---|
| FormGrid | `images/formgrid_screenshot.jpg` | 1080×1935 | `images/formgrid_icon_512.png` (512×512) | Ваш Play Store скріншот (дашборд) |
| Invoices & Contracts | `images/invoices_screenshot.png` | 1080×1920 | `images/invoices_icon_512.png` (512×512) + `images/invoices_icon.svg` (вектор) | Ваш Play Store скріншот (дашборд, світла тема) |
| Convert & Compress | `images/convert_screenshot.png` | 1080×1920 | `images/convert_icon_512.png` (512×512) | **Новий мокап, зібраний кодом** (див. нижче) |

**Про Convert & Compress:** наявні в проєкті скріншоти були або AI-згенеровані (не відповідають реальному інтерфейсу), або текстові банери без UI. Тому я зібрав стилізований мокап кодом, що **точно повторює реальний головний екран** — кольори, тексти, теги й картки взято з `lib/screens/home_screen.dart` та `lib/widgets/feature_card.dart` (темна тема). Вихідний HTML: `_src/convert_mockup.html`. Пізніше можна замінити на реальний скріншот з телефону з тим самим ім'ям файлу.

Додатково в проєктах є (якщо знадобиться для сайту):
- FormGrid: ще 4 скріншоти + банер 1024×500 → `Mobile Workspace Hub/store_screenshots/`; логотип з текстом → `Mobile Workspace Hub/assets/images/formgrid_logo_text.png`; іконка 1024 → `formgrid_app_icon_1024.png`
- Invoices: 5 скріншотів UA (`release/light_style/`), 5 EN (`release/en/`), банери 1024×500
- Convert: банер 1024×500 → `фотоконвектор/store_assets/feature_graphic_1024x500.png`

---

## 2. Тексти для сайту

### 📊 FormGrid: Forms & Sheets

**Головна суть.**
Мобільний робочий простір для Google Forms™ і Google Sheets™: створюйте анкети, таблиці й додавайте записи прямо зі смартфона — без незручної мобільної веб-версії. Для малого бізнесу, менеджерів, вчителів та організаторів, яким треба швидко збирати дані «в полі».

**Кілер-фічі:**
- **Форма + таблиця відповідей за один дотик** — конструктор Google Forms (текст, один/кілька варіантів, спадний список) з автоматичною прив'язкою до нової Google-таблиці; готові бізнес-шаблони таблиць (замовлення, відвідуваність, бюджет, склад).
- **Працює навіть без інтернету** — нові рядки потрапляють в офлайн-чергу і самі синхронізуються, щойно з'явиться мережа.
- **Приватність за архітектурою** — жодних проміжних серверів: застосунок говорить напряму з Google API і має доступ *лише* до файлів, які створив сам (scope `drive.file`).
- **Бонус:** вбудований дизайнер QR-кодів для форм і таблиць + імпорт файлів у Google Drive через системне меню «Поділитися».

**Технічний стек:**
Flutter (Dart, Material 3) · Google Sign-In + `googleapis` (Drive v3, Sheets v4, Forms v1) · Provider · RevenueCat (`purchases_flutter`) для підписок · `qr_flutter` · `receive_sharing_intent` · `shared_preferences` (офлайн-черга) · локалізація UA/EN (ARB, `flutter_localizations`).

Монетизація: Free — до 5 документів; PRO — місяць / рік (7 днів trial) / lifetime.

---

### 📄 Vanza: Invoices & Contracts

**Головна суть.**
Кишеньковий генератор комерційних документів для майстрів, будівельників, фрілансерів і ФОП: кошторис, договір, рахунок, акт чи накладна — у професійному PDF прямо на об'єкті, навіть без інтернету.

**Кілер-фічі:**
- **PDF-документ за 1 хвилину** — автоматичний підрахунок сум, знижок і податків, сума прописом, довідник клієнтів і каталог послуг; 12 дизайнерських PDF-тем; відправка у Telegram / Viber / WhatsApp / Email в один дотик.
- **100% офлайн і приватно** — усі клієнти, ціни й документи зберігаються лише на телефоні, без реєстрації (хмарний бекап у *ваш власний* Google Drive — опційно).
- **Підпис і печатка на екрані** — клієнт розписується пальцем прямо при прийманні робіт; ваш підпис/печатка з прозорим фоном.
- **Бонус:** 13 мов інтерфейсу і 20+ валют (UAH, USD, EUR, PLN, GBP…); дашборд із динамікою виручки.

**Технічний стек:**
React 19 + TypeScript + Vite · Tailwind CSS 4 · Capacitor 8 (Android/iOS-обгортка; плагіни Filesystem, Share, File Opener) · Dexie.js (IndexedDB — локальна БД) · jsPDF + jspdf-autotable (генерація PDF на пристрої) · Google Drive REST API v3 (опційний бекап) · RevenueCat (`purchases-capacitor`) · lucide-react, canvas-confetti.

---

### 🖼 Vanza: Convert & Compress

**Головна суть.**
Швидкий офлайн-конвертер і компресор фото + PDF-студія. Для всіх, у кого фото з iPhone (HEIC) не відкриваються, файли не пролазять у пошту/месенджер, або пам'ять телефону забита важкими знімками.

**Кілер-фічі:**
- **Стискає фото до −90%** з повзунком якості та живим прогнозом розміру ще до обробки («Було 3.4 МБ → ~850 КБ»).
- **Пакетна конвертація до 30 фото за раз** — HEIC, JPG, PNG, WebP, BMP → JPG / PNG / WebP / PDF; збереження окремим альбомом у Галерею, оригінали не змінюються.
- **PDF-інструменти** — фото ↔ PDF, об'єднання / розділення PDF, захист паролем AES-256 і зняття пароля.
- **100% локально** — жодного завантаження на сервери, без реєстрації, без реклами й трекерів, працює без інтернету.

**Технічний стек:**
Flutter (Dart, Material 3, світла/темна тема) · `flutter_image_compress` + `image` (обробка в окремому isolate, захист від OOM) · Syncfusion Flutter PDF (AES-256 шифрування) · `pdf_combiner` · `image_picker`, `file_picker` · `gal` (збереження в галерею) · `share_plus` · Provider · `shared_preferences` (історія).

---

## 3. Політики конфіденційності

Готові тексти (англійською — для Google Play, + українська версія в тому ж файлі):

| Застосунок | Файл | Рекомендована URL для Play Console |
|---|---|---|
| FormGrid | `privacy/formgrid_privacy_policy.md` | `https://vanzalabs.tech/privacy/formgrid` |
| Invoices & Contracts | `privacy/invoices_privacy_policy.md` | `https://vanzalabs.tech/privacy/invoices` |
| Convert & Compress | `privacy/convert_compress_privacy_policy.md` | `https://vanzalabs.tech/privacy/convert` |

### ⚠️ Що я виправив/додав порівняно з вашими існуючими політиками

Під час аналізу коду знайшов розбіжності, через які Google Play може відхилити оновлення:

1. **Invoices & Contracts** — стара політика каже «дані не передаються нікуди», але в коді є:
   - **опційний бекап у Google Drive** (`googleDriveSync.ts`, scopes `drive.file`, `userinfo.email`, `userinfo.profile`);
   - **RevenueCat** (покупки/підписки).
   Обидва тепер описані, додано обов'язкове розкриття **Google API Services User Data Policy / Limited Use**.
   👉 Перевірте анкету **Data safety**: через RevenueCat чесніше вказати «Purchase history» та «App interactions/Device IDs» → *Collected, not shared, for App functionality*. Імейл Google-акаунта використовується лише локально.
2. **FormGrid** — додано Limited Use-розкриття (обов'язкове для OAuth-верифікації Google), перелік scopes та RevenueCat. В README згадано «зашифровану» офлайн-чергу, але в коді це звичайний `SharedPreferences` — тому в політиці я написав «зберігається локально», без обіцянки шифрування.
3. **Convert & Compress** — стара політика згадує **камеру**, але в коді й маніфесті камери немає → прибрав. Також у застосунку зараз немає реальних покупок (усі функції безкоштовні, `MonetizationService` — заглушка), тож політика це відображає. Якщо підключите білінг — політику треба оновити.

Контакти в політиках: `contact@vanzalabs.tech`, сайт `https://vanzalabs.tech`. Розробник: Vanza Labs.
