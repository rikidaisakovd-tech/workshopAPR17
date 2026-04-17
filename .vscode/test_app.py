import unittest
from app import app

class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_index_status_code(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_index_content(self):
        response = self.client.get('/')
        self.assertIn('ポモドーロタイマー', response.data.decode('utf-8'))

    def test_history_post_and_get(self):
        # POST履歴追加
        res = self.client.post('/api/history', json={'mode': 'pomodoro'})
        self.assertEqual(res.status_code, 200)
        self.assertIn('ok', res.get_data(as_text=True))
        # GET履歴取得
        res2 = self.client.get('/api/history')
        self.assertEqual(res2.status_code, 200)
        data = res2.get_json()
        self.assertTrue(isinstance(data, list))
        self.assertGreaterEqual(len(data), 1)
        self.assertEqual(data[-1]['mode'], 'pomodoro')

if __name__ == '__main__':
    unittest.main()
