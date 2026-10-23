# Privacy Policy — FormGrid: Forms & Sheets

**App:** FormGrid: Forms & Sheets (`com.vanza.formgrid`)
**Developer:** Vanza Labs — https://vanzalabs.tech
**Contact:** contact@vanzalabs.tech
**Effective date:** October 15, 2026

This Privacy Policy explains what information FormGrid ("the App", "we") accesses, how it is used, and the choices you have. FormGrid is a mobile client for Google Forms™ and Google Sheets™. It is not affiliated with or endorsed by Google LLC.

The use of raw or derived user data received from Workspace APIs will adhere to the Google User Data Policy, including the Limited Use requirements. FormGrid does not use, transfer, or disclose raw, aggregated, or derived Google user data to develop, train, or improve foundational or generalized machine learning and artificial intelligence (AI/ML) models.

## 1. Summary
- FormGrid has **no backend servers of its own**. The App communicates **directly** from your device with official Google APIs over encrypted HTTPS.
- We (Vanza Labs) **never receive, see, store or sell** your forms, spreadsheets, responses or Google account data.
- The App contains **no ads** and **no third-party analytics or tracking SDKs**.

## 2. Information the App accesses

### 2.1 Google account data (via Google Sign-In)
When you sign in with Google, the App receives your basic profile (name, email address, profile photo) to display which account is connected, and an OAuth access token to call Google APIs on your behalf. The App requests only the following permissions (scopes):

| Scope | Why it is needed |
|---|---|
| `https://www.googleapis.com/auth/drive.file` | Create, open and edit **only the files that FormGrid itself created or that you explicitly open with FormGrid** (spreadsheets, forms, uploaded files, the FormGrid folder). The App **cannot** see the rest of your Google Drive. |
| `https://www.googleapis.com/auth/forms.body` | Create and edit the questions/structure of Google Forms you build in the App. |

Data obtained through these scopes (file names, sheet rows, form questions, responses linked to App-created sheets) is processed **only on your device** to show it to you and to perform the actions you request. It is sent only to Google's servers, which you already use.

### 2.2 Data stored locally on your device
- App preferences (language, theme, recent files list).
- **Offline queue:** rows you add while offline are temporarily saved in the App's private local storage and sent to Google Sheets automatically when the connection is restored, then removed from the queue.
- Sign-in tokens are managed by the Google Sign-In SDK / operating system.

### 2.3 Purchases (RevenueCat & Google Play Billing)
FormGrid PRO subscriptions and lifetime purchases are processed by **Google Play Billing**. We do not receive your payment card details. To validate purchases and restore them across reinstalls, the App uses **RevenueCat** (RevenueCat, Inc.), which receives an anonymous app user ID, the purchased product, transaction/receipt data, and basic device/app information (e.g., OS version, app version, country/currency). RevenueCat privacy policy: https://www.revenuecat.com/privacy

### 2.4 Files shared to the App
If you use the system "Share" menu to send a file to FormGrid, the file is uploaded **only to your own Google Drive** at your request.

## 3. Google API Services User Data Policy — Limited Use disclosure
FormGrid's use and transfer to any other app of information received from Google APIs will adhere to the **Google API Services User Data Policy**, including the **Limited Use** requirements: https://developers.google.com/terms/api-services-user-data-policy

The use of raw or derived user data received from Workspace APIs will adhere to the Google User Data Policy, including the Limited Use requirements. FormGrid does not use, transfer, or disclose raw, aggregated, or derived Google user data to develop, train, or improve foundational or generalized machine learning and artificial intelligence (AI/ML) models.

Specifically:
- Google user data is used **only** to provide and improve the user-facing features of the App that you request.
- We **do not** transfer Google user data to third parties, except as necessary to provide those features, to comply with law, or as part of a merger/acquisition with your consent.
- We **do not** use Google user data for advertising, retargeting, or building user profiles.
- We **do not** sell Google user data, and no human at Vanza Labs reads it.
- We **do not** use Google user data to train AI/ML models.

## 4. Data sharing
We do not sell, rent, or share your personal data. Data leaves your device only:
- to **Google** (Drive, Sheets, Forms APIs, Sign-In) — to perform actions you request;
- to **RevenueCat / Google Play** — to process and verify purchases.

## 5. Data retention and deletion
- Your forms and spreadsheets live in **your Google account**; you can delete them at any time in Google Drive.
- **Sign out** in the App to remove the connected session from the device. Uninstalling the App deletes all locally stored data, including the offline queue.
- You can revoke FormGrid's access to your Google account at any time: https://myaccount.google.com/permissions
- To request deletion of purchase records associated with your anonymous RevenueCat ID, email contact@vanzalabs.tech.

## 6. Security
All network communication uses HTTPS/TLS. OAuth 2.0 access is limited to the minimum scopes listed above. Local data is kept in the App's private sandbox, protected by your device's operating-system security (screen lock, encryption).

## 7. Children
FormGrid is not directed at children under 13 (or the equivalent minimum age in your country) and we do not knowingly collect their data.

## 8. Your rights
Depending on your location (e.g., GDPR in the EU/UK, CCPA in California), you may have the right to access, correct, delete or port your data. Because we do not store your data on our servers, most of these rights can be exercised directly in the App or in your Google account. For any request, contact us at contact@vanzalabs.tech.

## 9. Changes
We may update this policy. The "Effective date" above shows the latest version; significant changes will be announced in the App or on the store listing.

## 10. Contact
Vanza Labs · contact@vanzalabs.tech · https://vanzalabs.tech

---
---

# Політика конфіденційності — FormGrid: Forms & Sheets (українська версія)

**Застосунок:** FormGrid: Forms & Sheets (`com.vanza.formgrid`)
**Розробник:** Vanza Labs — https://vanzalabs.tech · contact@vanzalabs.tech
**Дата набрання чинності:** 15 жовтня 2026 р.

FormGrid — мобільний клієнт для Google Forms™ та Google Sheets™. Застосунок не пов'язаний із Google LLC.

The use of raw or derived user data received from Workspace APIs will adhere to the Google User Data Policy, including the Limited Use requirements. FormGrid does not use, transfer, or disclose raw, aggregated, or derived Google user data to develop, train, or improve foundational or generalized machine learning and artificial intelligence (AI/ML) models.

**1. Коротко.** FormGrid не має власних серверів: застосунок звертається **напряму** до офіційних Google API через HTTPS. Vanza Labs **не отримує, не бачить, не зберігає і не продає** ваші форми, таблиці, відповіді чи дані Google-акаунта. Немає реклами та сторонньої аналітики.

**2. До яких даних є доступ.**
- *Google-акаунт (Google Sign-In):* ім'я, email, фото профілю — щоб показати підключений акаунт; OAuth-токен для запитів до Google API. Дозволи: `drive.file` — доступ **лише до файлів, створених або відкритих через FormGrid** (решту вашого Google Drive застосунок не бачить); `forms.body` — створення та редагування структури форм.
- *Локально на пристрої:* налаштування, список нещодавніх файлів; **офлайн-черга** рядків, доданих без інтернету, — автоматично надсилається в Google Sheets після появи зв'язку і видаляється з черги.
- *Покупки:* обробляє **Google Play Billing** (дані картки ми не отримуємо). Для перевірки й відновлення покупок використовується **RevenueCat**, який отримує анонімний ідентифікатор користувача, дані транзакції та базову інформацію про пристрій/версію застосунку. https://www.revenuecat.com/privacy
- *Файли через «Поділитися»:* завантажуються лише у ваш власний Google Drive на ваш запит.

**3. Розкриття Limited Use.** Використання та передача FormGrid будь-якому іншому застосунку інформації, отриманої з Google API, відповідає **Google API Services User Data Policy**, включно з вимогами **Limited Use**. The use of raw or derived user data received from Workspace APIs will adhere to the Google User Data Policy, including the Limited Use requirements. FormGrid does not use, transfer, or disclose raw, aggregated, or derived Google user data to develop, train, or improve foundational or generalized machine learning and artificial intelligence (AI/ML) models. Дані Google використовуються лише для функцій, які ви запитуєте; не передаються третім особам, не використовуються для реклами чи навчання AI-моделей, не продаються і не переглядаються людьми.

**4. Передача даних.** Лише Google (для виконання ваших дій) та RevenueCat / Google Play (для покупок). Ми не продаємо і не передаємо персональні дані.

**5. Зберігання та видалення.** Ваші файли зберігаються у вашому Google-акаунті — видаляйте їх у Google Drive. Вихід з акаунта в застосунку або видалення застосунку стирає локальні дані. Відкликати доступ: https://myaccount.google.com/permissions. Запит на видалення даних покупок — contact@vanzalabs.tech.

**6. Безпека.** HTTPS/TLS, мінімальні OAuth-дозволи, ізольоване сховище застосунку під захистом ОС.

**7. Діти.** Застосунок не призначений для дітей до 13 років.

**8. Ваші права (GDPR/CCPA тощо).** Доступ, виправлення, видалення, перенесення — більшість прав реалізується прямо в застосунку чи Google-акаунті; з інших питань — contact@vanzalabs.tech.

**9. Зміни.** Актуальна версія позначена датою вгорі.

**10. Контакти.** Vanza Labs · contact@vanzalabs.tech · https://vanzalabs.tech
