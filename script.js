const statusText = document.getElementById("status");
const progressBar = document.getElementById("progress");
const percentText = document.getElementById("percent");
const tip = document.getElementById("tip");

const tips = [
    "Совет: Соблюдайте интервалы движения.",
    "Совет: Не открывайте двери до полной остановки.",
    "Совет: Проверяйте АРС перед отправлением.",
    "Совет: Следите за сигналами светофоров.",
    "Совет: Желаем приятной игры!"
];

tip.innerHTML = tips[Math.floor(Math.random() * tips.length)];

let percent = 0;

const stages = [
    { p: 5,  text: "Подключение к серверу..." },
    { p: 15, text: "Получение информации..." },
    { p: 30, text: "Проверка Workshop..." },
    { p: 50, text: "Загрузка контента..." },
    { p: 70, text: "Загрузка Lua..." },
    { p: 90, text: "Подготовка клиента..." },
    { p: 100, text: "Добро пожаловать!" }
];

let stageIndex = 0;

function updateLoading() {

    if (stageIndex >= stages.length)
        return;

    let target = stages[stageIndex].p;

    let interval = setInterval(() => {

        percent++;

        progressBar.style.width = percent + "%";
        percentText.innerHTML = percent + "%";

        if (percent >= target) {

            statusText.innerHTML = stages[stageIndex].text;

            clearInterval(interval);

            stageIndex++;

            setTimeout(updateLoading,500);

        }

    },25);

}

updateLoading();