# Stackovervibe — Деплой

## Платформа
- **VPS:** текущий сервер (тот же где ведётся разработка)
- **Домен:** stackovervibe.ru (куплен)
- **ОС:** Linux (Ubuntu)

## Инфраструктура — поднимаем с нуля
На сервере нет ничего готового, нужно настроить:
- Docker + Docker Compose
- Nginx (reverse proxy)
- SSL сертификат (Let's Encrypt / certbot)
- DNS записи для stackovervibe.ru

## Переменные окружения
Будут определены в tech-spec. Ожидаемый минимум:
- NODE_ENV / PYTHON_ENV — окружение
- DATABASE_URL — подключение к БД (если будет)
- CMS-related переменные — доступы к админке
- DOMAIN — stackovervibe.ru

## CI/CD
- На MVP: ручной деплой
- Потом: GitHub Actions

## Мониторинг
- Будет определён в tech-spec
- Минимум: health check endpoint, доступность по домену

## Rollback
- Docker: откат через предыдущий образ
- Код: git revert + redeploy
- Процедура: см. глобальные правила Auto-Fix Pipeline (уровень 4)

## Логи
- Docker logs
- Nginx access/error logs
- Пути будут определены после выбора стека
