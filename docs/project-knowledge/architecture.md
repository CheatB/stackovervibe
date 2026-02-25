# Stackovervibe — Архитектура

## Стек

| Компонент | Решение |
|-----------|---------|
| Фреймворк | Next.js 15 (App Router) |
| CMS | Payload CMS 3.x (встроен в Next.js) |
| БД | PostgreSQL 16 |
| ORM | Drizzle (через Payload) |
| Стили | Tailwind CSS 4 + кастомный CSS |
| Язык | TypeScript |
| Rich-editor | Lexical (CMS) + Markdown (UGC фронт) |
| Поиск | PostgreSQL Full-Text Search |
| Auth | Telegram Login Widget + Payload Auth |
| Контейнеризация | Docker + Docker Compose |
| Веб-сервер | Nginx + Let's Encrypt SSL |

**Почему Payload CMS**: встраивается в Next.js (один проект = один деплой), TypeScript, admin UI, Lexical editor, роли и access control, REST API — всё из коробки. Подробнее → [tech-spec.md](../tech-spec.md#1-стек-технологий)

## Общая схема

```
[Браузер] → [Nginx :443] → [Next.js + Payload :3000] → [PostgreSQL :5432]
```

Одно приложение, один контейнер, одна БД.

## Структура контента

Гибридная модель:
- **Путь новичка** — упорядоченная последовательность гайдов (pathOrder)
- **Каталог инструментов** — карточки с типами (skill, hook, command, rule)
- **UGC посты** — пользовательский контент с модерацией

## Модели данных

9 коллекций: Users, Guides, Tools, Posts, Comments, Categories, Tags, Media, Pages.
2 глобала: SiteSettings, Navigation.
Подробности → [tech-spec.md](../tech-spec.md#3-модели-данных-payload-collections)

## Рендеринг

- **SSG**: лендинг, статические страницы
- **ISR (60s)**: гайды, инструменты, посты
- **SSR**: поиск, профили, auth, создание постов
- **CSR**: /admin (Payload CMS панель)

## Интеграции

- **Telegram Bot API**: авторизация (Login Widget) + уведомления о модерации
- **Yandex.Metrika + GA4**: аналитика
- Внешних API на MVP нет

## Инфраструктура

- VPS: текущий сервер разработки
- Домен: stackovervibe.ru
- Docker Compose: app + postgres
- Nginx: reverse proxy, SSL, кэширование
- Подробности → [deployment.md](deployment.md) и [tech-spec.md](../tech-spec.md#10-инфраструктура)
