let timer;
let timeLeft = 25 * 60; // 25分
let isRunning = false;
let sessionCount = 0;
const sessionCountElem = document.getElementById('session-count');
const sessionLabelElem = document.getElementById('session-label');

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// モードごとの秒数
const MODES = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};
let currentMode = 'pomodoro';

const modeBtns = {
    pomodoro: document.getElementById('pomodoro-mode'),
    short: document.getElementById('short-break-mode'),
    long: document.getElementById('long-break-mode')
};

// 既存の #history-list 要素を使用（重複ID生成を防止）
const historyListElem = document.getElementById('history-list');

const LANGS = {
    ja: {
        title: 'ポモドーロタイマー',
        start: '開始', pause: '一時停止', reset: 'リセット',
        pomodoro: 'ポモドーロ', short: '短い休憩', long: '長い休憩',
        session: '完了セッション',
        timerEnd: 'タイマー終了',
        timerEndBody: mode => `${mode}が終了しました`
    },
    en: {
        title: 'Pomodoro Timer',
        start: 'Start', pause: 'Pause', reset: 'Reset',
        pomodoro: 'Pomodoro', short: 'Short Break', long: 'Long Break',
        session: 'Sessions Done',
        timerEnd: 'Timer Finished',
        timerEndBody: mode => `${mode} finished!`
    }
};
let currentLang = 'ja';

const langBtns = {
    ja: document.getElementById('lang-ja'),
    en: document.getElementById('lang-en')
};

function updateDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    display.textContent = `${min}:${sec}`;
}

function addHistory(mode) {
    fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
    }).then(() => fetchHistory());
}

function fetchHistory() {
    fetch('/api/history')
        .then(res => res.json())
        .then(data => {
            historyListElem.innerHTML = '';
            data.slice().reverse().forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `${entry.timestamp} - ${modeLabelCurrent(entry.mode)}`;
                historyListElem.appendChild(li);
            });
        });
}

function modeLabelCurrent(mode) {
    return modeLabel(mode, currentLang);
}

// 通知許可リクエスト
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

function notifyEnd() {
    display.textContent = currentLang === 'ja' ? '終了！' : 'Finished!';
    // 音声通知
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 880;
        osc.connect(ctx.destination);
        osc.start();
        setTimeout(() => {
            osc.stop();
            ctx.close();
        }, 400);
    } catch (e) {}
    // セッションカウント
    if (currentMode === 'pomodoro') {
        sessionCount++;
        sessionCountElem.textContent = sessionCount;
    }
    addHistory(currentMode);
    // ブラウザ通知
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(LANGS[currentLang].timerEnd, {
            body: LANGS[currentLang].timerEndBody(modeLabelCurrent(currentMode)),
            icon: ''
        });
    }
}

function tick() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
    } else {
        clearInterval(timer);
        isRunning = false;
        notifyEnd();
    }
}

startBtn.onclick = function() {
    if (!isRunning) {
        timer = setInterval(tick, 1000);
        isRunning = true;
    }
};

pauseBtn.onclick = function() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
};

resetBtn.onclick = function() {
    clearInterval(timer);
    timeLeft = MODES[currentMode];
    updateDisplay();
    isRunning = false;
};

setMode('pomodoro'); // 初期化

function setMode(mode) {
    clearInterval(timer);
    isRunning = false;
    currentMode = mode;
    timeLeft = MODES[mode];
    updateDisplay();
    // ボタンのactive切替とaria-pressed更新
    Object.keys(modeBtns).forEach(m => {
        if (m === mode) {
            modeBtns[m].classList.add('active');
            modeBtns[m].setAttribute('aria-pressed', 'true');
        } else {
            modeBtns[m].classList.remove('active');
            modeBtns[m].setAttribute('aria-pressed', 'false');
        }
    });
}

modeBtns.pomodoro.onclick = () => setMode('pomodoro');
modeBtns.short.onclick = () => setMode('short');
modeBtns.long.onclick = () => setMode('long');

function setLang(lang) {
    currentLang = lang;
    document.querySelector('h1').textContent = LANGS[lang].title;
    document.title = LANGS[lang].title;
    startBtn.textContent = LANGS[lang].start;
    pauseBtn.textContent = LANGS[lang].pause;
    resetBtn.textContent = LANGS[lang].reset;
    modeBtns.pomodoro.textContent = LANGS[lang].pomodoro;
    modeBtns.short.textContent = LANGS[lang].short;
    modeBtns.long.textContent = LANGS[lang].long;
    sessionLabelElem.textContent = LANGS[lang].session;
    // active切替とaria-pressed更新
    Object.keys(langBtns).forEach(l => {
        if (l === lang) {
            langBtns[l].classList.add('active');
            langBtns[l].setAttribute('aria-pressed', 'true');
        } else {
            langBtns[l].classList.remove('active');
            langBtns[l].setAttribute('aria-pressed', 'false');
        }
    });
    fetchHistory();
}

langBtns.ja.onclick = () => setLang('ja');
langBtns.en.onclick = () => setLang('en');

setLang('ja');
