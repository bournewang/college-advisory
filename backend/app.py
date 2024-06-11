from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import uuid
import os
from openai import OpenAI

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Session-Id'

# 设置OpenAI API密钥
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
print(f'open api key: {os.getenv("OPENAI_API_KEY"):s}')

sessions = {}

@app.route('/api/start_session', methods=['POST'])
@cross_origin()
def start_session():
    token = str(uuid.uuid4())
    sessions[token] = []
    return jsonify({'token': token})

@app.route('/api/send_message', methods=['POST'])
@cross_origin()
def send_message():
    data = request.json
    token = request.headers.get('Token')
    message = data.get('message')
    
    if token not in sessions:
        return jsonify({'error': 'token not exists!'})

    # 调用OpenAI API生成响应
    sessions[token].append({'role': 'user', 'content': message})
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=sessions[token]
    )

    response_text = response.choices[0].message.content
    sessions[token].append({'role': 'assistant', 'content': response_text})
    return jsonify({'messages': sessions[token]})

@app.route('/api/fetch_messages', methods=['GET'])
def fetch_messages():
    token = request.headers.get('Token')
    print(f"token: {token:s}")
    print(sessions)
    if not token or token not in sessions:
        return jsonify({'error': 'Invalid session ID'}), 400

    return jsonify({'messages': sessions[token]})

if __name__ == '__main__':
    app.run(debug=True)
