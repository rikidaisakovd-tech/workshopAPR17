// timer.jsのユニットテスト例（Jest形式）
// ※実際のJest実行にはNode.js環境と設定が必要です

describe('modeLabel', () => {
  const { modeLabel } = require('./timer');
  test('ポモドーロ', () => {
    expect(modeLabel('pomodoro')).toBe('ポモドーロ');
  });
  test('短い休憩', () => {
    expect(modeLabel('short')).toBe('短い休憩');
  });
  test('長い休憩', () => {
    expect(modeLabel('long')).toBe('長い休憩');
  });
  test('その他', () => {
    expect(modeLabel('other')).toBe('other');
  });
});
