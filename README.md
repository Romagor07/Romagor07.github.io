# Портфолио

Статический сайт без сборки: `index.html` + папка `assets/`. Работает на любом хостинге,
который умеет отдавать файлы.

```
index.html            разметка страницы
assets/data.js        ← ВСЕ ТЕКСТЫ: профиль, контакты, проекты
assets/styles.css     оформление (тёмная и светлая тема)
assets/app.js         карточки, фильтры, окно проекта
assets/img/           скриншоты
deploy/               конфиги nginx и Caddy
```

## Как поменять содержимое

Всё правится в `assets/data.js`:

- `PROFILE.name`, `role`, `tagline` — имя и подпись в шапке.
- `PROFILE.contacts` — впишите Telegram (без @), Discord и почту.
  Пока все три пустые, блок «Контакты» и кнопка «Связаться» скрыты.
- `PROJECTS` — список проектов. `featured: true` — большая карточка сверху.
  `status` со словами «продакшен» или «живом» подсвечивается зелёным и попадает в счётчик.
- Картинка проекта: положите файл в `assets/img/` и укажите `image: 'assets/img/имя.webp'`.

У каждого проекта есть своя ссылка: `https://ваш-сайт/#gsp`, `#autodonate`, `#cscreen` и т.д.

## Посмотреть локально

```bash
python -m http.server 8000
```

и открыть http://localhost:8000. Можно и просто дважды кликнуть `index.html`.

## Развернуть

### 1. Docker (любой VPS)

```bash
docker compose up -d --build
```

Сайт будет на порту 8080. Чтобы повесить домен с HTTPS, поставьте перед ним Caddy:
`reverse_proxy localhost:8080`.

### 2. Caddy без Docker

```bash
sudo mkdir -p /var/www/portfolio
sudo cp -r index.html assets /var/www/portfolio/
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile   # поменяйте домен внутри
sudo systemctl reload caddy
```

Caddy сам получит и будет продлевать сертификат Let's Encrypt.

### 3. Бесплатный хостинг

Подойдёт любой статический хостинг: Cloudflare Pages, Netlify, Vercel, GitHub Pages.
Загрузите папку целиком — сборка не нужна, команда сборки пустая, папка вывода `/`.

## Шрифты

Шрифты Unbounded, Onest и JetBrains Mono подгружаются с Google Fonts. Без интернета
сайт откатится на системные шрифты и продолжит работать.
