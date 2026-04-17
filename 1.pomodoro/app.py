from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__, template_folder="templates", static_folder="static")

# メモリ上の履歴リスト（最大100件保持）
history = []
HISTORY_MAX = 100

ALLOWED_MODES = {'pomodoro', 'short', 'long'}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(history)

@app.route('/api/history', methods=['POST'])
def add_history():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid request body'}), 400

    mode = data.get('mode')
    if mode not in ALLOWED_MODES:
        return jsonify({'error': 'Invalid mode'}), 400

    entry = {
        'mode': mode,
        'timestamp': datetime.now().isoformat(timespec='seconds')
    }
    history.append(entry)
    # 上限を超えた場合は古いエントリを削除
    if len(history) > HISTORY_MAX:
        del history[:-HISTORY_MAX]
    return jsonify({'result': 'ok', 'entry': entry})

if __name__ == '__main__':
    app.run(debug=False)
