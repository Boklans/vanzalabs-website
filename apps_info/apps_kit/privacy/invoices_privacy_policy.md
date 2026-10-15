# Privacy Policy — Vanza: Invoices & Contracts

**App:** Vanza: Invoices & Contracts (`app.vanza.docs`)
**Developer:** Vanza Labs — https://vanzalabs.tech
**Contact:** contact@vanzalabs.tech
**Effective date:** October 15, 2026

This Privacy Policy explains how Vanza: Invoices & Contracts ("Vanza", "the App", "we") handles your information.

## 1. Summary
- Vanza is **offline-first**: your business profile, clients, catalog, documents and signatures are stored **only on your device**.
- **No registration** is required. We have **no servers** that store your business data.
- **No ads**, **no third-party analytics or tracking SDKs**.
- Internet is used only for two optional/necessary features: **Google Drive backup** (if you turn it on) and **in-app purchases**.

## 2. Data stored locally on your device
The App stores the following in its private local database (IndexedDB on your device):
- your company/business profile (name, address, tax IDs, bank details/IBAN, logo, signature and stamp images);
- client directory (names, contacts, addresses you enter);
- catalog of goods/services and prices;
- documents you create (estimates, contracts, invoices, receipts, delivery notes), including client signatures captured on screen;
- app settings (language, currency, PDF theme).

This data is entered by you, stays on your device, and is **never sent to Vanza Labs**.

## 3. Optional Google Drive backup
If you choose to connect Google Drive in the App's settings, Vanza uses Google Sign-In and requests these scopes:

| Scope | Why it is needed |
|---|---|
| `https://www.googleapis.com/auth/drive.file` | Create, update and read **only the backup file created by Vanza** (`vanza_drive_backup.json`) in your own Google Drive. The App cannot see your other Drive files. |
| `userinfo.email`, `userinfo.profile` | Show which Google account is connected. |

How it works:
- The backup (documents, clients, catalog, business settings) is uploaded **directly from your device to your own Google Drive** over HTTPS. It does not pass through any Vanza server.
- Authentication credentials are **stripped** from backup files.
- The OAuth access token and connected email are stored locally on the device only.
- You can disconnect Google Drive at any time in the App, delete the backup file from your Drive, and revoke access at https://myaccount.google.com/permissions.

**Limited Use disclosure:** Vanza's use and transfer to any other app of information received from Google APIs will adhere to the **Google API Services User Data Policy**, including the **Limited Use** requirements (https://developers.google.com/terms/api-services-user-data-policy). Google user data is used solely to provide the backup/restore feature; it is not shared with third parties, not used for advertising or AI/ML training, not sold, and not read by humans.

## 4. Purchases (RevenueCat & Google Play Billing)
Vanza PRO purchases are processed by **Google Play Billing**; we never receive your payment card details. To validate purchases, manage the trial and restore purchases, the App uses **RevenueCat** (RevenueCat, Inc.), which receives an anonymous app user ID, the purchased product, transaction/receipt data and basic device/app information (OS version, app version, country/currency). RevenueCat privacy policy: https://www.revenuecat.com/privacy

## 5. Device permissions
- **Internet** — only for Google Drive backup and purchases. All document features work offline.
- **Billing** — for in-app purchases via Google Play.
- **Files / Share** — to save generated PDFs to your device and send them through the system share sheet (e.g., Telegram, Viber, WhatsApp, email). Sharing happens only when you tap "Share".

## 6. Data sharing
We do not sell, rent or share your personal or business data. Data leaves your device only:
- to **your own Google Drive** — if you enable backup;
- to **RevenueCat / Google Play** — to process purchases;
- to recipients **you choose** when you share a PDF.

## 7. Data retention and deletion
- You can delete individual documents, clients and catalog items at any time.
- Use **Menu → Account → Delete all data** (or clear app data / uninstall the App) to permanently erase everything stored locally.
- Delete the `vanza_drive_backup.json` file from your Google Drive to remove the cloud backup.
- To request deletion of purchase records linked to your anonymous RevenueCat ID, email contact@vanzalabs.tech.

## 8. Security
Local data is kept in the App's private sandbox and protected by your device's security (screen lock, Face ID / fingerprint, OS encryption). Network traffic (backup, purchases) uses HTTPS/TLS. Please keep your device protected, since documents may contain sensitive business information.

## 9. Children
The App is a business tool and is not directed at children under 13. We do not knowingly collect children's data.

## 10. Your rights
Depending on your location (GDPR, UK GDPR, CCPA, etc.), you may have rights to access, correct, delete or export your data. Because your data is stored on your device and in your own Google Drive, you can exercise these rights directly in the App. For any question, contact contact@vanzalabs.tech.

## 11. Changes
We may update this policy; the effective date above shows the current version.

## 12. Contact
Vanza Labs · contact@vanzalabs.tech · https://vanzalabs.tech

---
---

# Політика конфіденційності — Vanza: Рахунки та Договори (українська версія)

**Застосунок:** Vanza: Invoices & Contracts (`app.vanza.docs`)
**Розробник:** Vanza Labs — https://vanzalabs.tech · contact@vanzalabs.tech
**Дата набрання чинності:** 15 жовтня 2026 р.

**1. Коротко.** Vanza працює за принципом «офлайн насамперед»: профіль бізнесу, клієнти, каталог, документи та підписи зберігаються **лише на вашому пристрої**. Реєстрація не потрібна, власних серверів для ваших даних у нас немає. Без реклами та трекерів. Інтернет використовується лише для опційного бекапу в Google Drive та покупок.

**2. Локальні дані.** У приватній базі застосунку (IndexedDB) зберігаються: профіль компанії (назва, адреса, коди, банківські реквізити/IBAN, логотип, підпис, печатка), довідник клієнтів, каталог товарів/послуг, створені документи (кошториси, договори, рахунки, акти, накладні) разом з підписами клієнтів, налаштування. Ці дані **ніколи не надсилаються Vanza Labs**.

**3. Опційний бекап у Google Drive.** Якщо ви підключите Google Drive, застосунок запитує дозволи `drive.file` (доступ **лише до файлу бекапу**, створеного Vanza — `vanza_drive_backup.json`) та `userinfo.email` / `userinfo.profile` (показ підключеного акаунта). Бекап завантажується **напряму з пристрою у ваш власний Google Drive** через HTTPS, без наших серверів; облікові дані вилучаються з файлу бекапу; токен і email зберігаються лише локально. Відключити — у налаштуваннях застосунку; відкликати доступ — https://myaccount.google.com/permissions.
*Limited Use:* використання та передача інформації, отриманої з Google API, відповідає **Google API Services User Data Policy**, включно з вимогами **Limited Use**. Дані використовуються лише для бекапу/відновлення, не передаються третім особам, не використовуються для реклами чи навчання AI, не продаються.

**4. Покупки.** Обробляє **Google Play Billing** (дані картки ми не отримуємо). Для перевірки покупок, пробного періоду та відновлення використовується **RevenueCat** — отримує анонімний ID, дані транзакції та базову інформацію про пристрій. https://www.revenuecat.com/privacy

**5. Дозволи.** Інтернет — лише для бекапу та покупок; Білінг — для покупок; Файли / Поділитися — для збереження PDF і надсилання через системне меню на ваш запит.

**6. Передача даних.** Лише у ваш Google Drive (якщо увімкнено бекап), RevenueCat / Google Play (покупки) та отримувачам, яких ви самі обираєте при надсиланні PDF. Ми не продаємо і не передаємо дані.

**7. Видалення.** Видаляйте документи/клієнтів у будь-який момент; **Меню → Акаунт → Видалити всі дані** (або очищення даних / видалення застосунку) повністю стирає локальні дані; видаліть файл бекапу з Google Drive. Запит на видалення даних покупок — contact@vanzalabs.tech.

**8. Безпека.** Ізольоване сховище застосунку під захистом ОС (блокування екрана, біометрія, шифрування); мережевий трафік — HTTPS/TLS.

**9. Діти.** Бізнес-інструмент, не призначений для дітей до 13 років.

**10. Ваші права.** Доступ, виправлення, видалення, експорт — безпосередньо в застосунку; з питань — contact@vanzalabs.tech.

**11. Зміни.** Актуальна версія позначена датою вгорі.

**12. Контакти.** Vanza Labs · contact@vanzalabs.tech · https://vanzalabs.tech
