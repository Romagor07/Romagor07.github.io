// =====================================================================
//  NOVE Project - Loading Screen
//
//  Прогресс-бар синхронизирован с настоящей загрузкой.
//  Garry's Mod вызывает на этой странице глобальные функции:
//
//    GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode)
//    SetFilesTotal(total)        - сколько файлов всего надо скачать
//    SetFilesNeeded(needed)      - сколько ещё осталось (уменьшается)
//    DownloadingFile(name)       - что качается сейчас (в интерфейс не выводим)
//    SetStatusChanged(status)    - текстовый статус от движка
//    AllFilesDownloaded()        - загрузка файлов завершена
//
//  Ничего не выдумываем: пока движок не прислал данные, полоса в режиме
//  "неопределённости" (бегущая полоска), а не фейковые проценты.
// =====================================================================

(function () {
"use strict";

// ---------------------------------------------------------------------
// Конфиг с безопасными значениями по умолчанию
// ---------------------------------------------------------------------

var C = (typeof CONFIG === "object" && CONFIG) ? CONFIG : {};

function pick(value, fallback) {
    return (value === undefined || value === null || value === "") ? fallback : value;
}

var theme  = C.theme  || {};
var music  = C.music  || {};
var links  = C.links  || {};
var tips   = (C.tips && C.tips.length) ? C.tips : ["Приятной игры!"];
var news   = (C.news && C.news.length) ? C.news : [];

// ---------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------

var el = {
    background:      document.getElementById("background"),
    backgroundImage: document.getElementById("backgroundImage"),
    logoWrap:        document.getElementById("logoWrap"),
    logoMark:        document.getElementById("logoMark"),
    serverName:      document.getElementById("serverName"),
    subtitle:        document.getElementById("subtitle"),
    metaMap:         document.getElementById("metaMap"),
    metaGamemode:    document.getElementById("metaGamemode"),
    metaPlayers:     document.getElementById("metaPlayers"),
    status:          document.getElementById("status"),
    percent:         document.getElementById("percent"),
    bar:             document.getElementById("bar"),
    progress:        document.getElementById("progress"),
    fileCount:       document.getElementById("fileCount"),
    newsList:        document.getElementById("newsList"),
    footerName:      document.getElementById("footerName"),
    footerVersion:   document.getElementById("footerVersion"),
    tip:             document.getElementById("tip"),
    links:           document.getElementById("links")
};

// ---------------------------------------------------------------------
// Тема
// ---------------------------------------------------------------------

var root = document.documentElement;
root.style.setProperty("--accent",  pick(theme.accent,  "#00BFFF"));
root.style.setProperty("--accent2", pick(theme.accent2, "#7FE9FF"));

// ---------------------------------------------------------------------
// Статический контент
// ---------------------------------------------------------------------

var configuredName = pick(C.serverName, "");

if (configuredName) {
    el.serverName.textContent = configuredName;
    el.footerName.textContent = configuredName;
}

el.subtitle.textContent      = pick(C.subtitle, "Добро пожаловать.");
el.footerVersion.textContent = pick(C.version, "");

// Новости
news.forEach(function (line) {
    var li = document.createElement("li");
    li.textContent = line;
    el.newsList.appendChild(li);
});

if (!news.length) {
    document.getElementById("news").hidden = true;
}

// Ссылки
var linkLabels = { discord: "Discord", telegram: "Telegram", website: "Сайт" };

Object.keys(linkLabels).forEach(function (key) {

    var url = links[key];
    if (!url) return;

    var a = document.createElement("a");
    a.className   = "linkBtn";
    a.href        = url;
    a.textContent = linkLabels[key];
    a.target      = "_blank";
    a.rel         = "noopener noreferrer";

    el.links.appendChild(a);
});

// Советы — перебираем по кругу со случайного места, без повторов подряд
var tipIndex = Math.floor(Math.random() * tips.length);

function showTip() {
    el.tip.classList.remove("fadeIn");
    // перезапуск анимации
    void el.tip.offsetWidth;
    el.tip.textContent = "Совет: " + tips[tipIndex];
    el.tip.classList.add("fadeIn");
    tipIndex = (tipIndex + 1) % tips.length;
}

showTip();

if (tips.length > 1) {
    setInterval(showTip, Math.max(3000, pick(C.tipInterval, 8000)));
}

// ---------------------------------------------------------------------
// Логотип и фон: подставляем картинку ТОЛЬКО после успешной загрузки.
// Никаких битых иконок и просвечивающего фона.
// ---------------------------------------------------------------------

if (C.logo) {

    var logoImg = new Image();

    logoImg.onload = function () {
        logoImg.id = "logoImage";
        logoImg.alt = "";
        el.logoWrap.appendChild(logoImg);
        el.logoMark.hidden = true;
    };

    logoImg.onerror = function () {
        // тихо остаёмся на встроенном SVG
    };

    logoImg.src = C.logo;
}

if (C.background) {

    var bgImg = new Image();

    bgImg.onload = function () {
        el.backgroundImage.style.backgroundImage = 'url("' + C.background + '")';
        el.backgroundImage.classList.add("visible");

        if (C.backgroundZoom) {
            el.backgroundImage.classList.add("zoom");
        }

        // Затемнение делаем мягче, чтобы арт было видно
        document.body.classList.add("hasBackground");
    };

    bgImg.src = C.background;
}

// Логотип и название уже нарисованы на фоне — второй комплект не нужен
if (C.showBranding === false) {
    document.body.classList.add("noBranding");
}

// ---------------------------------------------------------------------
// Музыка (CEF может заблокировать автозапуск — пробуем ещё раз по любому вводу)
// ---------------------------------------------------------------------

if (music.enabled && music.file) {

    var audio = new Audio(music.file);
    audio.loop   = true;
    audio.volume = Math.min(1, Math.max(0, pick(music.volume, 0.35)));

    var tryPlay = function () {
        var p = audio.play();
        if (p && p.catch) p.catch(function () { /* заблокировано политикой автозапуска */ });
    };

    tryPlay();

    ["pointerdown", "keydown"].forEach(function (evt) {
        window.addEventListener(evt, tryPlay, { once: false });
    });
}

// ---------------------------------------------------------------------
// СОСТОЯНИЕ ЗАГРУЗКИ
//
// Три честные фазы:
//   connect  - движок ещё ничего не прислал      -> бегущая полоса, процента нет
//   download - идёт скачивание файлов            -> реальный процент
//   finalize - файлы скачаны, грузится карта/Lua -> полная полоса + пульсация
// ---------------------------------------------------------------------

var PHASE_CONNECT  = "connect";
var PHASE_DOWNLOAD = "download";
var PHASE_FINALIZE = "finalize";

var state = {
    phase:       PHASE_CONNECT,
    filesTotal:  0,
    filesNeeded: 0,
    seenFiles:   0,      // запасной счётчик, если SetFilesTotal не пришёл
    doneShown:   0,      // сколько уже показано скачанным
    finished:    false,  // AllFilesDownloaded уже был
    target:      0,      // реальная доля 0..1
    display:     0       // сглаженное значение для отрисовки
};

function setPhase(phase) {

    if (state.phase === phase) return;

    state.phase = phase;

    el.bar.classList.toggle("indeterminate", phase === PHASE_CONNECT);
    el.bar.classList.toggle("finalizing",    phase === PHASE_FINALIZE);
}

function setStatus(text) {
    if (text && el.status.textContent !== text) {
        el.status.textContent = text;
    }
}

// Разряды у больших чисел: 31207 -> "31 207".
// Нужны на случай legacy-загрузки через FastDL, где счёт идёт по файлам.
function groupDigits(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Русский счёт: 1 аддон, 2 аддона, 5 аддонов
var UNIT = (C.countUnit && C.countUnit.length === 3)
    ? C.countUnit
    : ["аддон", "аддона", "аддонов"];

function plural(n) {

    var n10 = n % 10;
    var n100 = n % 100;

    if (n10 === 1 && n100 !== 11) return UNIT[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return UNIT[1];

    return UNIT[2];
}

// Последнее, что реально записано в DOM. Движок дёргает SetFilesNeeded на
// каждый файл — при тысячах файлов бессмысленные записи в DOM ни к чему.
var written = { width: "", percent: "" };

// Сглаживание: тянемся к реальному значению, но никогда его не обгоняем.
// Намеренно setInterval, а не requestAnimationFrame: rAF полностью замирает,
// когда окно не отрисовывается, и полоса застревает на месте.
function render() {

    var diff = state.target - state.display;

    if (Math.abs(diff) < 0.0005) {
        state.display = state.target;
    } else {
        state.display += diff * 0.16;
    }

    // Ширина полосы сглаживается, а цифра всегда точная — она берётся
    // напрямую из данных движка, без интерполяции.
    var width = (state.display * 100).toFixed(2) + "%";

    if (width !== written.width) {
        el.progress.style.width = width;
        written.width = width;
    }

    var pct;

    if (state.phase === PHASE_DOWNLOAD) {
        pct = Math.floor(state.target * 100) + "%";
    } else if (state.phase === PHASE_FINALIZE) {
        pct = "100%";
    } else {
        pct = "—";
    }

    if (pct !== written.percent) {
        el.percent.textContent = pct;
        written.percent = pct;
    }
}

render();
setInterval(render, 33);

// Загрузка контента окончена: полоса заполняется и переходит в фазу ожидания
// карты. keepCount=true — когда мы реально досчитали до конца и можем честно
// показать N/N; false — когда о завершении узнали косвенно, по статусу движка,
// и заявлять конкретные цифры было бы выдумкой.
function finishDownloads(keepCount) {

    state.filesNeeded = 0;
    state.target      = 1;
    state.finished    = true;
    state.doneShown   = state.filesTotal;

    if (keepCount && state.filesTotal > 0) {
        el.fileCount.textContent =
            groupDigits(state.filesTotal) + " / " + groupDigits(state.filesTotal) +
            " " + plural(state.filesTotal);
    } else {
        el.fileCount.textContent = "";
    }

    setPhase(PHASE_FINALIZE);
    render();
}

function recomputeProgress() {

    // После AllFilesDownloaded загрузка окончена. Запоздавший колбэк движка
    // не должен отматывать полосу назад — 100% обратно в 60% выглядит как сбой.
    if (state.finished) return;

    if (state.filesTotal > 0) {

        var done = state.filesTotal - state.filesNeeded;

        if (done < 0) done = 0;
        if (done > state.filesTotal) done = state.filesTotal;

        // Счётчик движка идёт только на убывание. Значение меньше уже
        // показанного — это отставший вызов, его игнорируем.
        if (done < state.doneShown) return;

        state.doneShown = done;
        state.target    = done / state.filesTotal;

        el.fileCount.textContent =
            groupDigits(done) + " / " + groupDigits(state.filesTotal) +
            " " + plural(state.filesTotal);

    } else if (state.seenFiles > 0) {

        // SetFilesTotal не пришёл — показываем хотя бы количество,
        // процент при этом честно не заявляем.
        el.fileCount.textContent =
            groupDigits(state.seenFiles) + " " + plural(state.seenFiles);
    }

    // Перерисовываем сразу же, чтобы цифра процента и счётчик файлов
    // никогда не расходились между тиками таймера.
    render();
}

// Статусы движка приходят на английском — переводим известные, остальное
// показываем как есть (лучше правда, чем пустота).
var STATUS_MAP = [
    [/workshop/i,                        "Загрузка Workshop-контента..."],
    [/download/i,                        "Загрузка контента..."],
    [/extract|unpack/i,                  "Распаковка контента..."],
    [/sending client/i,                  "Отправка данных клиента..."],
    [/client info/i,                     "Обмен данными с сервером..."],
    [/retriev|server info|получ/i,       "Получение информации о сервере..."],
    [/lua/i,                             "Загрузка Lua..."],
    [/map|world/i,                       "Загрузка карты..."],
    [/connect/i,                         "Подключение к серверу..."],
    [/spawn|starting/i,                  "Вход в игру..."],
    [/complete|done|finish/i,            "Готово"]
];

// Этапы, которые идут ЗА загрузкой контента. Если движок доложил о любом из
// них, качать уже нечего — даже если счётчик не досчитали.
//
// Ровно этот случай виден на живом сервере: клиент, у которого весь контент
// уже есть, получает SetFilesTotal(60), после чего SetFilesNeeded и
// AllFilesDownloaded не вызываются вовсе. Без такой проверки полоса
// оставалась бы на 0% и «0 / 60 аддонов», пока игра грузит Lua и карту.
var POST_DOWNLOAD = /lua|world|spawn|complete|loading map/i;

function isPostDownload(raw) {
    return !!raw && POST_DOWNLOAD.test(raw);
}

function translateStatus(raw) {

    if (!raw) return "";

    for (var i = 0; i < STATUS_MAP.length; i++) {
        if (STATUS_MAP[i][0].test(raw)) return STATUS_MAP[i][1];
    }

    return raw;
}

// ---------------------------------------------------------------------
// ГЛОБАЛЬНЫЕ КОЛБЭКИ GARRY'S MOD
// Должны лежать именно в window — движок зовёт их по имени.
// ---------------------------------------------------------------------

var engineSpoke = false;

function markEngine() {
    engineSpoke = true;
}

window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode) {

    markEngine();

    // Если в конфиге название не задано — берём настоящее, с сервера
    if (!configuredName && servername) {
        el.serverName.textContent = servername;
        el.footerName.textContent = servername;
    }

    if (C.showServerDetails === false) return;

    if (mapname) {
        el.metaMap.textContent = "Карта: " + mapname;
        el.metaMap.hidden = false;
    }

    if (gamemode) {
        el.metaGamemode.textContent = "Режим: " + gamemode;
        el.metaGamemode.hidden = false;
    }

    if (maxplayers) {
        el.metaPlayers.textContent = "Слотов: " + maxplayers;
        el.metaPlayers.hidden = false;
    }
};

window.SetFilesTotal = function (total) {

    markEngine();

    total = parseInt(total, 10) || 0;

    // Движок может начать новую партию (сначала Workshop, затем FastDL) —
    // тогда счёт стартует заново, и запрет на откат надо снять.
    state.filesTotal = total;
    state.doneShown  = 0;
    state.finished   = false;
    state.target     = 0;

    if (total > 0) {
        state.filesNeeded = total;
        setPhase(PHASE_DOWNLOAD);
        setStatus("Загрузка " + UNIT[2] + "...");   // "Загрузка аддонов..."
    } else {
        // Качать нечего — клиент уже всё имеет
        state.target = 1;
        setPhase(PHASE_FINALIZE);
        setStatus("Загрузка карты...");
    }

    recomputeProgress();
};

window.SetFilesNeeded = function (needed) {

    markEngine();

    if (state.finished) return;   // загрузка уже завершена, фазу не меняем

    state.filesNeeded = parseInt(needed, 10) || 0;

    if (state.filesTotal > 0) {
        setPhase(PHASE_DOWNLOAD);
    }

    recomputeProgress();
};

// Названия аддонов и пути к файлам намеренно не выводим — в интерфейсе
// остаётся только счётчик. Колбэк всё равно нужен: он служит запасным
// счётчиком, если SetFilesTotal от движка так и не пришёл.
window.DownloadingFile = function () {

    markEngine();

    if (state.finished) return;

    state.seenFiles++;

    if (state.filesTotal > 0) {
        setPhase(PHASE_DOWNLOAD);
    }

    recomputeProgress();
};

window.SetStatusChanged = function (status) {

    markEngine();

    // Движок ушёл дальше загрузки — догоняем полосу, иначе она застрянет на 0%
    if (!state.finished && isPostDownload(status)) {
        finishDownloads(false);
    }

    setStatus(translateStatus(status));
};

window.AllFilesDownloaded = function () {

    markEngine();

    // Досчитали честно — показываем N / N
    finishDownloads(true);

    setStatus("Загрузка карты...");
};

// ---------------------------------------------------------------------
// ДЕМО-РЕЖИМ
// Нужен только чтобы посмотреть вёрстку в обычном браузере / на GitHub Pages.
// Внутри GMod не включается: движок дописывает к URL параметр mapname и
// вызывает GameDetails — по этим двум признакам и определяем.
// ---------------------------------------------------------------------

function inGarrysMod() {
    return engineSpoke || /[?&]mapname=/.test(window.location.search);
}

function runDemo() {

    // Коллекция Workshop: движок считает аддоны, а не отдельные файлы
    var total = 30;

    window.SetStatusChanged("Retrieving server info");

    setTimeout(function () {
        window.GameDetails("NOVE Project | Metrostroi RP", "", "gm_metro_v3", 32, "0", "metrostroi");
        window.SetStatusChanged("Downloading Workshop Content");
        window.SetFilesTotal(total);
    }, 1200);

    var index = 0;

    function next() {

        if (index >= total) {

            window.AllFilesDownloaded();

            setTimeout(function () {
                window.SetStatusChanged("Starting Lua");
            }, 2000);

            return;
        }

        window.DownloadingFile("addon_" + index);

        index++;
        window.SetFilesNeeded(total - index);

        // Аддоны весят по-разному: контент-паки качаются заметно дольше мелких
        setTimeout(next, 350 + Math.floor(Math.random() * 1300));
    }

    setTimeout(next, 2000);
}

var demoMode = C.demo;

if (demoMode === true) {

    runDemo();

} else if (demoMode !== false) {

    // "auto" — ждём полторы секунды; если движок молчит, значит это браузер
    setTimeout(function () {
        if (!inGarrysMod()) runDemo();
    }, 1500);
}

})();
