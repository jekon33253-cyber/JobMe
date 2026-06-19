# JobMe — Nowoczesny Ekosystem HR

SPA для HR-агенції у Вроцлаві (Dolny Śląsk). Легальне працевлаштування, без прихованих комісій і безкоштовний upskilling для кандидатів. Ефективний B2B-рекрутинг для працедавців.

## Технології

- **React 19** + **Vite 8**
- **TailwindCSS v4**
- i18n (PL / UA / EN) через React Context
- Google Analytics 4 + Meta Pixel
- Telegram API для lead-сповіщень

## Швидкий старт

```bash
npm install
npm run dev
```

## Збірка

```bash
npm run build
npm run preview
```

## Структура

```
src/
├── config.js          # константи (WhatsApp, Telegram, GA4, Pixel)
├── App.jsx            # головний компонент + роутинг
├── index.css          # Tailwind + кастомні стилі
├── context/
│   └── LanguageContext.jsx  # i18n-провайдер
├── locales/
│   └── translations.js     # переклади (PL/UA/EN)
├── components/
│   ├── Hero.jsx
│   ├── StatsBanner.jsx
│   ├── JobsWidget.jsx       # вакансії на головній
│   ├── JobsPage.jsx         # окрема сторінка вакансій
│   ├── ContactForm.jsx
│   ├── FAQSection.jsx
│   ├── HowItWorks.jsx
│   ├── Sectors.jsx
│   ├── LegalizationTimeline.jsx
│   ├── Upskilling.jsx
│   └── FadeIn.jsx           # анімація fade-in
└── api/
    └── contact.js           # обробник форми → Telegram
```

## Змінні оточення

Створіть `.env` файл (див. `.env.example`):

| Змінна | Опис |
|--------|------|
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота для прийому лідів |
| `TELEGRAM_CHAT_ID` | Chat ID отримувача повідомлень |

## Налаштування перед деплоєм

1. **`src/config.js`** — замінити `whatsappNumber`, `telegramUsername`, `ga4Id`, `metaPixelId` на реальні значення
2. **`api/contact.js`** — налаштувати змінні оточення `TELEGRAM_BOT_TOKEN` і `TELEGRAM_CHAT_ID`
3. **Зображення** — замінити Unsplash-посилання та фото команди на власні

## Деплой (Vercel)

```bash
npm i -g vercel
vercel
```

Або через [Vercel Dashboard](https://vercel.com) — підключити репозиторій, вказати змінні оточення.
