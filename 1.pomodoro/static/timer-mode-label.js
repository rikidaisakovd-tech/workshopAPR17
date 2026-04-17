// timer.js から切り出した純粋関数モジュール（テスト用）
const MODE_LABELS = {
    ja: { pomodoro: 'ポモドーロ', short: '短い休憩', long: '長い休憩' },
    en: { pomodoro: 'Pomodoro', short: 'Short Break', long: 'Long Break' }
};

function modeLabel(mode, lang) {
    return (MODE_LABELS[lang] && MODE_LABELS[lang][mode]) || mode;
}

if (typeof module !== 'undefined') {
    module.exports = { modeLabel };
}
