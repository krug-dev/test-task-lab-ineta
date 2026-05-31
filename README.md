# Developer Landing — тестовое задание Fullstack

Лендинг-презентация разработчика с адаптивной вёрсткой и формой обратной связи (email владельцу + копия пользователю).

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | HTML5, TypeScript, SCSS, Vite |
| Backend | Node.js, Express, Zod, Mailtrap API |

## Структура проекта

```
developer-landing/
├── frontend/          # UI, SCSS, форма
│   ├── index.html
│   └── src/
│       ├── api/       # HTTP-клиент
│       ├── modules/   # форма, навигация
│       └── styles/    # SCSS
├── backend/           # REST API
│   └── src/
│       ├── routes/    # /api/contact
│       ├── services/  # email (Mailtrap API)
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

**Mailtrap API** — как в curl на дашборде Mailtrap:

```
MAILTRAP_API_TOKEN=ваш_токен
MAILTRAP_FROM_EMAIL=hello@demomailtrap.co
MAILTRAP_FROM_NAME=Никита Круглов
MAIL_OWNER=hotdemen@gmail.com
```

Проверка: `npm run test:email --prefix backend`

**SMTP (запасной вариант)** — Sandbox SMTP, если API не используется.

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
3. Два письма через Mailtrap API:
   - владельцу (`MAIL_OWNER`)
   - копия на email пользователя

## Деплой

Подойдёт любой хостинг с Node.js, например **Render** / **Railway**:

1. Build: `npm install && npm install --prefix frontend && npm install --prefix backend && npm run build`
2. Start: `npm start`
3. Переменные окружения из `.env.example`

## Что сдать работодателю

- [ ] Ссылка на GitHub-репозиторий
- [ ] Ссылка на деплой
- [ ] Рабочий Mailtrap API для проверки формы
