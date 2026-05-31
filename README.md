# Developer Landing — тестовое задание Fullstack

Лендинг-презентация разработчика с адаптивной вёрсткой, формой обратной связи (email владельцу + копия пользователю) и AI-интеграцией.

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | HTML5, TypeScript, SCSS, Vite |
| Backend | Node.js, Express, Zod, Nodemailer |
| AI | OpenAI API (`gpt-4o-mini`) |

## Структура проекта

```
developer-landing/
├── frontend/          # UI, SCSS, клиентская логика формы и AI-кнопок
│   ├── index.html
│   └── src/
│       ├── api/       # HTTP-клиент
│       ├── modules/   # форма, навигация, AI helper
│       └── styles/    # SCSS (переменные, компоненты)
├── backend/           # REST API
│   └── src/
│       ├── routes/    # /api/contact, /api/ai/*
│       ├── services/  # email, OpenAI
│       └── validation/
└── .env.example
```

## Быстрый старт

### 1. Установка

```bash
cd developer-landing
npm install
npm install --prefix frontend
npm install --prefix backend
cp .env.example .env
```

### 2. Настройка `.env`

**Mailtrap API (рекомендуется)** — как в curl на дашборде Mailtrap:

```
MAILTRAP_API_TOKEN=ваш_токен
MAILTRAP_FROM_EMAIL=hello@demomailtrap.co
MAILTRAP_FROM_NAME=Никита Круглов
MAIL_OWNER=hotdemen@gmail.com
```

Проверка: `npm run test:email --prefix backend`

**SMTP (запасной вариант)** — Sandbox SMTP, если API не используется.

**OpenAI (опционально, для AI summary на кейсах):**

```
OPENAI_API_KEY=sk-...
```

### 3. Запуск в разработке

```bash
npm run dev
```

- Frontend: http://localhost:5173 (прокси `/api` → backend)
- Backend: http://localhost:3001

### 4. Production-сборка

```bash
npm run build
npm start
```

Приложение отдаётся с одного порта (статика + API): http://localhost:3001

## Форма обратной связи

**Поля:** имя, телефон, email, комментарий.

**Поток:**

1. Клиентская валидация + состояния `loading` / `success` / `error`
2. `POST /api/contact` — серверная валидация (Zod)
3. Два письма через Nodemailer:
   - владельцу (`MAIL_OWNER`) с `replyTo` на email пользователя
   - копия на email пользователя

## AI-интеграция

| Функция | Endpoint | Назначение |
|---------|----------|------------|
| AI Summary | `POST /api/ai/summary` | Краткое резюме кейса по кнопке на карточке проекта |

Без `OPENAI_API_KEY` лендинг и форма работают; AI-кнопки показывают понятную ошибку.

## AI-инструменты при выполнении задания

| Инструмент | Как использовался |
|------------|-------------------|
| **Cursor (Composer)** | Каркас проекта, TypeScript-модули, Express-роуты, SCSS-структура |
| **ChatGPT / Claude** | Идеи по UX формы, формулировки README |

### Сделано с помощью ИИ

- Базовая структура monorepo и boilerplate API
- Черновик SCSS-компонентов и типов
- Тексты секций (шаблон — **замените на свои данные**)

### Исправлено вручную

- Валидация телефона и согласованные сообщения об ошибках (клиент + сервер)
- Обработка состояний формы и доступность (`aria-live`, `aria-expanded`)
- Логика двойной отправки email и `replyTo`
- Проверка конфигурации SMTP/OpenAI перед вызовом сервисов

## Персонализация

Отредактируйте `frontend/index.html`:

- имя, контакты, GitHub, Telegram
- кейсы и стек под ваш реальный опыт

## Деплой

Подойдёт любой хостинг с Node.js, например **Render** / **Railway**:

1. Build: `npm install && npm install --prefix frontend && npm install --prefix backend && npm run build`
2. Start: `npm start`
3. Переменные окружения из `.env.example`

## Что сдать работодателю

- [ ] Ссылка на GitHub-репозиторий
- [ ] Ссылка на деплой
- [ ] Заполненные **ваши** данные в лендинге
- [ ] Рабочий SMTP (или демо Mailtrap) для проверки формы
