// modeLabelのユニットテスト例（Jest形式）
// ※DOMを参照するtimer.jsではなく、純粋関数を切り出した専用モジュールをテストする

describe('modeLabel', () => {
  const { modeLabel } = require('./timer-mode-label');

  describe('日本語', () => {
    test('ポモドーロ', () => {
      expect(modeLabel('pomodoro', 'ja')).toBe('ポモドーロ');
    });
    test('短い休憩', () => {
      expect(modeLabel('short', 'ja')).toBe('短い休憩');
    });
    test('長い休憩', () => {
      expect(modeLabel('long', 'ja')).toBe('長い休憩');
    });
    test('その他', () => {
      expect(modeLabel('other', 'ja')).toBe('other');
    });
  });

  describe('English', () => {
    test('Pomodoro', () => {
      expect(modeLabel('pomodoro', 'en')).toBe('Pomodoro');
    });
    test('Short Break', () => {
      expect(modeLabel('short', 'en')).toBe('Short Break');
    });
    test('Long Break', () => {
      expect(modeLabel('long', 'en')).toBe('Long Break');
    });
    test('unknown falls back to mode key', () => {
      expect(modeLabel('other', 'en')).toBe('other');
    });
  });
});
