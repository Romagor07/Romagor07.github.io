/* ==========================================================================
   ДАННЫЕ ПОРТФОЛИО — всё, что показывается на сайте, правится здесь.
   Пустые контакты ('') на сайте не выводятся.
   ========================================================================== */

window.PROFILE = {
  name: 'romagor07',
  role: 'Full-stack разработчик',
  tagline:
    'Делаю панели управления, сервисы для игровых серверов и утилиты, которые снимают рутину. ' +
    'От бэкенда и деплоя на VPS до Lua-аддонов и утилит для Windows.',
  location: 'Россия',
  available: true, // показывать плашку «открыт к проектам»
  contacts: {
    telegram: '', // ник без @, например 'romagor07'
    discord: '',  // ник, например 'romagor07'
    email: '',    // адрес почты
  },
};

window.CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'web', label: 'Веб и панели' },
  { id: 'game', label: 'Игровые моды' },
  { id: 'tools', label: 'Утилиты' },
  { id: 'bots', label: 'Боты' },
];

/* featured: true — большая карточка в верхнем блоке.
   snippet — строка «в моноширинном», характерная для проекта.
   link — необязательная ссылка на живой проект. */
window.PROJECTS = [
  {
    id: 'gsp',
    featured: true,
    visual: 'screenshot',
    image: 'assets/img/gsp-dashboard.webp',
    imageFallback: 'assets/img/gsp-dashboard.png',
    title: 'GameServerPanel',
    category: 'web',
    status: 'в разработке',
    summary:
      'Универсальная self-hosted панель для игровых серверов: центральная веб-панель и лёгкий агент на каждой машине.',
    details:
      'Одна панель для Minecraft, серверов на SteamCMD, SA-MP / open.mp и RAGE:MP — на любом количестве машин с Windows и Linux. ' +
      'Архитектура как у Pterodactyl и PufferPanel, но установка в одну команду и работа без интернета.',
    highlights: [
      'Агент сам подключается к панели по WebSocket — на нодах не нужно открывать порты, работает за NAT',
      'Система шаблонов серверов: автоустановка Java, SteamCMD, MariaDB и phpMyAdmin',
      'Живая консоль, файловый менеджер, бэкапы и планировщик задач',
      'Роли и права, сабюзеры на отдельные серверы, журнал аудита',
      'Собранные бинарники не требуют установленного Node.js',
    ],
    stack: ['TypeScript', 'Fastify', 'Prisma', 'React', 'Vite', 'Tailwind', 'WebSocket'],
    snippet: 'agent ⇄ wss://panel · 3 nodes online',
  },
  {
    id: 'autodonate',
    featured: true,
    visual: 'flow',
    title: 'GM-Autodonate',
    category: 'web',
    status: 'стадия тестов',
    summary:
      'Автодонат для сервера Garry’s Mod: приём платежей, автоматическая выдача рангов и алерты в Telegram.',
    details:
      'Игрок пишет !donate, оплачивает, а ранг выдаётся сам — даже если игрок уже вышел с сервера. ' +
      'Бэкенд на VPS ведёт очередь выдачи, игровой сервер забирает задачи и отчитывается о результате.',
    highlights: [
      'Очередь выдачи: сервер опрашивает бэкенд раз в 10 секунд и подтверждает каждую выдачу',
      'Нет отчёта 5 минут — уведомление в Telegram, ни один платёж не теряется молча',
      'Защищённые группы: донат никогда не перезапишет superadmin, admin и operator',
      'Заморозка ролей и выдача офлайн-игрокам по SteamID',
      'Установщик для VPS, systemd-сервис, HTTPS через Caddy с автопродлением',
    ],
    stack: ['Node.js 24', 'Fastify 5', 'SQLite', 'TypeScript', 'Lua', 'Caddy'],
    snippet: 'ulx setrank STEAM_0:1:… vip',
    link: { href: 'https://donate.metro-plus.root.sx', label: 'donate.metro-plus.root.sx' },
  },
  {
    id: 'gscreen',
    featured: true,
    visual: 'loading',
    title: 'GScreen',
    category: 'web',
    status: 'в разработке',
    summary:
      'Конструктор загрузочных экранов для GMod: собрал экран из пресета — получил адрес для server.cfg.',
    details:
      'Владелец сервера настраивает фон, логотип, прогресс, музыку, соцсети и Discord-виджет в панели, ' +
      'а взамен получает поддомен и одну строку для sv_loadingurl.',
    highlights: [
      'Вход только через Steam OpenID и Discord OAuth — паролей нет вообще',
      'Wildcard-TLS на поддомены и on-demand TLS для собственных доменов клиентов',
      'Экран и панель — независимые раскладки: в игровой CEF не уходит ни одного лишнего килобайта',
      'Пресеты-шаблоны с панелью настроек вместо свободного холста — быстро и без поломанной вёрстки',
    ],
    stack: ['Next.js 16', 'PostgreSQL', 'Prisma', 'TypeScript', 'Caddy'],
    snippet: 'sv_loadingurl "https://hj331.gscreen.io/"',
  },

  {
    id: 'dispatcher',
    title: 'Metrostroi Dispatcher',
    category: 'game',
    status: 'на живом сервере',
    icon: 'rail',
    summary: 'Система диспетчеризации для серверов Metrostroi: посты, маршруты, управление движением.',
    details:
      'Аддон для Garry’s Mod, который превращает игру на метро-сервере в работу с настоящей диспетчерской.',
    highlights: [
      'Посты ДЦХ, ДЦХ-3, ЭЦХ, ДСЦП и маневровые',
      'Открытие и закрытие маршрутов, контроль составов на линии',
      'Собственное оформление меню в стиле проекта',
    ],
    stack: ['Lua', 'Garry’s Mod', 'Metrostroi'],
    snippet: 'ДЦХ · маршрут 12 · открыт',
  },
  {
    id: 'dcx-docs',
    title: 'ДЦХ — Приказы',
    category: 'game',
    status: 'на живом сервере',
    icon: 'doc',
    summary: 'Форма приказов для диспетчеров: телеграмма на экране у машинистов и копия в Discord.',
    details:
      'Самостоятельный аддон: команда !docs открывает форму приказа, а результат показывается адресатам как реалистичная телеграмма.',
    highlights: [
      'Типовые приказы и свой вариант, автонумерация с сохранением счётчика',
      'Адресная рассылка: всем или только составам выбранного маршрута',
      'Дубль в Discord через webhook, показ в игре не зависит от Discord',
      'Доступ только диспетчерам и администраторам',
    ],
    stack: ['Lua', 'Garry’s Mod', 'Discord Webhooks'],
    snippet: '!docs → ПРИКАЗ ДЦХ № 47',
  },

  {
    id: 'esc-menu',
    title: 'Gmod ESC Menu',
    category: 'game',
    status: 'на живом сервере',
    icon: 'menu',
    summary: 'Своё меню паузы для сервера GMod: заменяет стандартное ESC-меню панелью в стиле проекта.',
    details:
      'Полностью автономная замена меню паузы: стандартное меню GMod не открывается вовсе. Всё настраивается в одном конфиге — название, акцентный цвет, ссылки, правила и список серверов.',
    highlights: [
      'Кнопки «Вернуться в игру», сайт, правила, контент сервера, Discord, настройки и отключение',
      'Быстрый переход на другие серверы проекта в один клик',
      'Встроенная панель с правилами и карточка игрока',
      'Векторные иконки и масштабирование под 2K / 4K, размытие фона и анимации',
    ],
    stack: ['Lua', 'Garry\u2019s Mod', 'VGUI'],
    snippet: '▶ Вернуться в игру',
  },
  {
    id: 'player-hud',
    title: 'Gmod Player Info HUD',
    category: 'game',
    status: 'на живом сервере',
    icon: 'user',
    summary: 'Компактная плашка игрока в углу экрана: аватар Steam, ник и SteamID.',
    details:
      'Лёгкий HUD без лишней нагрузки: панель не перехватывает мышь и клавиатуру и сама пересоздаётся при смене разрешения.',
    highlights: [
      'Аватар из Steam, ник и SteamID в формате STEAM_',
      'Не мешает вводу — панель прозрачна для мыши и клавиатуры',
      'Корректно переживает смену разрешения и перезагрузку Lua',
    ],
    stack: ['Lua', 'Garry\u2019s Mod', 'VGUI'],
    snippet: 'romagor07 · STEAM_0:1:…',
  },
  {
    id: 'c-menu',
    title: 'Gmod C-Menu',
    category: 'game',
    status: 'доработка',
    icon: 'pointer',
    summary: 'Доработка контекстного меню для Metrostroi на клавише C: телепорты, управление составом и админ-действия.',
    details:
      'В основе — аддон Metrostroi Context Menu от автора Alexey, доработанный под сервер. ' +
      'Всё, что машинисту и администратору обычно приходится вводить командами, собрано в одно меню. Пункты показываются с учётом прав ULX.',
    highlights: [
      'Телепорт к игроку, к станции, в свой состав и обратно',
      'Авто-запуск и авто-стоп кабины, «умная» смена кабины, высадка пассажиров',
      'Связь с администратором и админские действия для тех, у кого есть права',
      'Список станций строится автоматически из конфигурации карты',
    ],
    stack: ['Lua', 'Metrostroi', 'ULX'],
    snippet: 'C → Телепорт → Станция 101',
  },
  {
    id: 'discord-adm-bot',
    title: 'GM-DISCORD-ADM-BOT',
    category: 'bots',
    status: 'готово',
    icon: 'bot',
    summary: 'Discord-бот для сервера GMod: общий чат игры и Discord плюс админ-панель на кнопках.',
    details:
      'Бот и сервер общаются через WebSocket: сообщения ходят в обе стороны, а администраторы управляют сервером прямо из Discord.',
    highlights: [
      'Двусторонний чат между Garry\u2019s Mod и каналом Discord',
      'Панель кнопок в Discord: бан, кик, мут и другие команды',
      'Ввод ника, SteamID и причины через модальные окна',
      'Доступ по роли администратора, работает с ULX, SAM и RCON',
    ],
    stack: ['Python', 'discord.py', 'Lua', 'GWSockets', 'WebSocket'],
    snippet: '[Discord] → !cmd kick … ✓',
  },
  {
    id: 'gss',
    title: 'GSS Monitor (V1–V4)',
    category: 'bots',
    status: 'готово',
    icon: 'bot',
    summary: 'Discord-бот мониторинга игровых серверов: онлайн в голосовых каналах и карточки статуса с игроками и картой.',
    details:
      'Четыре поколения одного бота: от простого вывода статуса GMod-серверов до универсального монитора Garry’s Mod, SCP: Secret Laboratory и Minecraft. Бот сам создаёт категорию с каналами и обновляет сообщения без дублей.',
    highlights: [
      'Сам создаёт категорию «Мониторинг», голосовые каналы-счётчики и канал статуса',
      'Embed-карточки: онлайн, список игроков, текущая карта с превью',
      'Кнопка «Подключиться» прямо из Discord',
      'V4 — Garry’s Mod, SCP:SL и Minecraft, ретраи и тайм-ауты запросов',
    ],
    stack: ['Node.js', 'discord.js', 'GameDig', 'axios'],
    snippet: 'Metrostroi #1 · 🟢 24/32 · gm_metro_crossline',
  },
  {
    id: 'neurokino',
    title: 'NEUROKINO',
    category: 'web',
    status: 'готово',
    icon: 'film',
    summary: 'Кинотеатр в киберпанк-стиле: веб-витрина и Flutter-приложение для ТВ, телефона и десктопа.',
    details:
      'Один интерфейс на Android TV, iPhone, Windows, macOS и Linux. Метаданные фильмов подтягиваются из kinopoisk.dev.',
    highlights: [
      'Поиск по ссылке или ID, подборки по жанрам',
      'Избранное и «продолжить просмотр»',
      'Управление с пульта на Android TV',
      'Неоновая тема: Orbitron, скан-линии, сетка',
    ],
    stack: ['Flutter', 'Dart', 'JavaScript'],
    snippet: '// КИБЕР-КИНОТЕАТР',
  },
  {
    id: 'sberbox',
    title: 'SberBox Clean',
    category: 'tools',
    status: 'готово',
    icon: 'tv',
    summary: 'Очистка ТВ-приставки SberBox 2: чистый лаунчер без рекламы, AirPlay и VPN с пульта.',
    details:
      'Приставка на Android 13 приведена в порядок через ADB — с полным бэкапом и скриптами отката.',
    highlights: [
      'Отключение рекламы и лишних системных приложений',
      'Форк лаунчера CleanYourTV с собственными доработками',
      'Кнопка включения VPN в одно нажатие с пульта',
      'Полный снимок системы и восстановление одной командой',
    ],
    stack: ['ADB', 'Bash', 'Android'],
    snippet: 'adb shell pm disable-user …',
  },
  {
    id: 'keybind',
    title: 'KeybindOverlay',
    category: 'tools',
    status: 'готово',
    icon: 'layers',
    summary: 'Оверлей с биндами поверх игры, невидимый для OBS и демонстрации экрана.',
    details:
      'Прозрачное окно поверх всех окон, сквозное для мыши. Видно только на физическом мониторе.',
    highlights: [
      'Click-through — не мешает игре',
      'Исключено из захвата экрана средствами Windows',
      'Бинды из простого текстового файла, горячие клавиши F8 / F9',
    ],
    stack: ['Python', 'tkinter', 'WinAPI'],
    snippet: 'F8 показать · F9 выход',
  },

  {
    id: 'mc-bot',
    title: 'Minecraft Status Bot',
    category: 'bots',
    status: 'готово',
    icon: 'bot',
    summary: 'Telegram-бот, который показывает онлайн и состояние Minecraft-сервера.',
    details: 'Пингует сервер по протоколу Minecraft и отвечает в чате, кэшируя ответ на 30 секунд.',
    highlights: ['Статус и список игроков по команде', 'Кэш, чтобы не долбить сервер', 'Настройка через .env'],
    stack: ['Node.js', 'Telegram Bot API'],
    snippet: '/status → 🟢 24/100',
  },
];
