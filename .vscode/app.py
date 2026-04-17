from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__, template_folder=".vscode/templates", static_folder=".vscode/static")

# メモリ上の履歴リスト
history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(history)

@app.route('/api/history', methods=['POST'])
def add_history():
    data = request.json
    entry = {
        'mode': data.get('mode'),
        'timestamp': datetime.now().isoformat(timespec='seconds')
    }
    history.append(entry)
    return jsonify({'result': 'ok', 'entry': entry})

if __name__ == '__main__':
    app.run(debug=True)
