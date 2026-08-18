# ✅ Чек-лист: тестовые данные → реальные данные фирмы

> **Для чего этот файл:** перед сдачей проекта директору заменить все тестовые/заглушечные данные на реальные реквизиты компании.
> **Как пользоваться:** пройди сверху вниз, отметь галочкой `[x]` выполненные пункты.
> **Последняя проверка:** 2026-08-17

---

## 🔴 1. Критично — контакты и юридические реквизиты

### 1.1 `src/config.js` — главный файл конфигурации

| Строка | Сейчас (заглушка) | Что подставить |
|---|---|---|
| 6 | `whatsappNumber: '48000000000'` | Реальный номер WhatsApp (только цифры) |
| 7 | `telegramUsername: 'jobme_hr'` | Реальный username Telegram (без @) |
| 10 | `ga4Id: 'G-GA4_PLACEHOLDER'` | Реальный Google Analytics 4 ID |
| 11 | `metaPixelId: 'PIXEL_PLACEHOLDER'` | Реальный Meta Pixel ID |
| 14 | `contactEmail: 'kontakt@jobme.pl'` | Реальный email компании |
| 18 | `location: 'Wrocław, Polska'` | Реальный город / адрес |

- [x] Обновлён `src/config.js`

### 1.2 `src/components/ContactForm.jsx` — контактный блок на сайте

| Строка | Сейчас | Что подставить |
|---|---|---|
| 98 | `rekrutacja@jobme.pl` | `config.contactEmail` |
| 139 | `placeholder="+48 574 220 849"` | Реальный телефон компании |
| 179 | `placeholder="+48 574 220 849"` | Реальный телефон компании |
| 190 | `"Wybierz preferowany kontakt"` (не переведено) | Перевести или оставить |

- [x] Обновлён `ContactForm.jsx`

### 1.3 `src/components/PrivacyPage.jsx` — Политика конфиденциальности (юридически важно!)

Сейчас: `GRUPA JOBME S.A. z siedzibą we Wrocławiu`, email `rekrutacja@jobme.pl`.

**Не хватает:**
- [x] Полное юридическое название компании (`GRUPA JOBME S.A.`)
- [x] NIP (`8971826557`)
- [x] REGON (`364989820`)
- [x] KRS (`0000628931`)
- [x] Полный адрес (`ul. Powstańców Śląskich 7A, 53-332 Wrocław`)
- [x] Заменить `kontakt@jobme.pl` на реальный email `rekrutacja@jobme.pl` (встречается **6 раз** — PL/UA/EN)

### 1.4 `index.html` — метаданные и структурированные данные (JSON-LD)

| Строка | Сейчас | Что подставить |
|---|---|---|
| 41, 54 | `G-GA4_PLACEHOLDER` (2 места) | Реальный GA4 ID |
| 67, 108 | `PIXEL_PLACEHOLDER` (2 места) | Реальный Meta Pixel ID |
| 82–93 | JSON-LD: `address` `Powstańców Śląskich 7A, 53-332 Wrocław`, `email: rekrutacja@jobme.pl` | Полный адрес + реальный email |
| 95 | `https://t.me/jobmelead_bot` | Реальный Telegram bot |
| 96 | `https://wa.me/48574220849` | Реальный WhatsApp |
| 78–103 | `sameAs` без соцсетей | Добавить FB / IG / LinkedIn / TikTok |

- [x] Обновлён `index.html`

---

## 🟠 2. Важно — изображения и контент

### 2.1 Фото команды — `src/App.jsx`

| Строка | Сейчас | Что подставить |
|---|---|---|
| 543 | `Michał` + стоковое фото Google | Реальное имя + фото сотрудника |
| 544 | `Anna` + стоковое фото | Реальное имя + фото |
| 545 | `Tomasz` + стоковое фото | Реальное имя + фото |
| 525 | Unsplash фото "Zaufanie i profesjonalizm" | Своё фото |

### 2.2 Фон главного экрана — `src/components/Hero.jsx`

| Строка | Сейчас | Что подставить |
|---|---|---|
| 11 | Unsplash `photo-1600880292203-757bb62b4baf` | Своё фото (локально в `/public`) |

### 2.3 Фото вакансий — `src/components/JobsPage.jsx`

| Строка | Сейчас | Что подставить |
|---|---|---|
| 105 | Unsplash (сладости) | Своё фото |
| 107 | Unsplash (склад) | Своё фото |
| 109 | Unsplash (инженерия) | Своё фото |

> Первые 2 фото (`/job-paczkomaty.jpg`, `/job-gas-cylinders.jpg`) уже локальные — ок.

### 2.4 Контент в `src/locales/translations.js` (3 языка: PL / UA / EN)

| Что | Строки | Сейчас | Что подставить |
|---|---|---|---|
| Отзывы (testimonials) | 134–145, 638–649, 1142–1153 | Вымышленные `Serhii`, `Oksana`, `Kamil` | Реальные отзывы или убрать |
| Вакансии (jobsWidget.jobs) | 314–361, 818–865, 1322–1369 | 3 актуализированные вакансии (до 25,00 zł netto / 31,40 zł brutto) | Проверить актуальность ставок и городов |
| Статистика (stats.stat1) | 24, 528, 1032 | `+150` freecruiterów | Реальная цифра |
| Даты трекера (userPortal) | 213–214, 717–718, 1221–1222 | `12.06.2026`, `14.06.2026` | Убрать демо-даты |
| footer.rights | 231, 735, 1239 | `GRUPA JOBME S.A. Wszelkie prawa zastrzeżone` | Проверить юр. название |

- [x] Обновлён `translations.js`

---

## 🟡 3. Средне — SEO, домен, аналитика

### 3.1 Домен сайта
| Файл | Строка | Сейчас |
|---|---|---|
| `src/components/SEOHead.jsx` | 4 | `BASE_URL = 'https://jobme.pl'` |
| `src/components/JobPostingSchema.jsx` | 52 | `sameAs: 'https://jobme.pl'` |
| `public/sitemap.xml` | везде | `https://jobme.pl/` |
| `public/robots.txt` | 3 | `https://jobme.pl/sitemap.xml` |

- [ ] Заменён домен на реальный

### 3.2 `public/manifest.json`
- [ ] Название и описание проверены на соответствие фирме

### 3.3 `api/notify.js` — отправитель email
| Строка | Сейчас | Что подставить |
|---|---|---|
| 42 | `'JobMe Portal <noreply@jobme.pl>'` | Реальный email-домен фирмы (иначе письма в спаме) |

- [ ] Обновлён `notify.js`

---

## ⚠️ 4. Безопасность и окружение (перед деплоем!)

### 4.1 `.env` — реальные токены
- [ ] Проверить, что `.env` НЕ попадает в git (он уже есть в `.gitignore`, строки 14–15 — ок)
- [ ] Ротация ключей, если репозиторий был публичным

### 4.2 Переменные окружения (Vercel)
| Переменная | Статус | Назначение |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | ✅ есть в `.env` | Приём лидов из формы |
| `TELEGRAM_CHAT_ID` | ✅ есть в `.env` | Куда слать лидов |
| `RESEND_API_KEY` | ❌ отсутствует | Отправка email через портал (иначе письма падают в Telegram/лог) |
| `VITE_SUPABASE_URL` | ✅ есть в `.env` | Supabase (портал кандидата) |
| `VITE_SUPABASE_ANON_KEY` | ✅ есть в `.env` | Supabase (портал кандидата) |

- [ ] Добавлен `RESEND_API_KEY` (если нужны email-уведомления портала)

---

## 📋 5. Сводный чек-лист для директора

| # | Данные | Статус |
|---|---|---|
| 1 | Полное юр. название фирмы (GRUPA JOBME S.A.) | ✅ |
| 2 | NIP (8971826557) | ✅ |
| 3 | REGON (364989820) | ✅ |
| 4 | KRS (0000628931) | ✅ |
| 5 | Полный адрес (Globis, Powstańców Śląskich 7A, 53-332 Wrocław) | ✅ |
| 6 | Рабочий email (rekrutacja@jobme.pl) | ✅ |
| 7 | Рабочий телефон (+48574220849) | ✅ |
| 8 | Номер WhatsApp (+48574220849) | ✅ |
| 9 | Username Telegram (@jobmelead_bot) | ✅ |
| 10 | Домен сайта | ⬜ |
| 11 | Google Analytics 4 ID | ⬜ |
| 12 | Meta Pixel ID | ⬜ |
| 13 | Ссылки на соцсети (FB, IG, LinkedIn, TikTok) | ⬜ |
| 14 | Фото и имена реальных сотрудников | ⬜ |
| 15 | Реальные отзывы клиентов | ⬜ |
| 16 | Актуальные ставки (макс. 25.00 netto / 31.40 brutto) | ✅ |
| 17 | Реальная цифра для блока статистики | ⬜ |
| 18 | RESEND_API_KEY (email-уведомления) | ⬜ |

---

## 🔧 Рекомендация по рефакторингу (необязательно)

Сейчас email `kontakt@jobme.pl` захардкожен в **4 разных файлах**:
- `src/config.js:14`
- `src/components/ContactForm.jsx:98`
- `src/components/PrivacyPage.jsx` (6 раз)
- `index.html:90`

Лучше оставить его **только в `config.js`** (`contactEmail`) и везде использовать `config.contactEmail`. Тогда при смене email достаточно поменять одно место.

То же самое с адресом и телефоном — добавить в `config.js` поля `address` и `phone` и использовать их в компонентах.
