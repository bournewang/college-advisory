from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import uuid
import os
from openai import OpenAI

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 设置OpenAI API密钥
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
print(f'open api key: {os.getenv("OPENAI_API_KEY"):s}')

sessions = {}

@app.route('/api/start_session', methods=['POST'])
@cross_origin()
def start_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = []
    return jsonify({'session_id': session_id})

@app.route('/api/send_message', methods=['POST'])
@cross_origin()
def send_message():
    data = request.json
    session_id = data.get('session_id')
    message = data.get('message')

    if session_id not in sessions:
        return jsonify({'error': 'Invalid session ID'}), 400

    # 调用OpenAI API生成响应
    chat_completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": message}
        ]
    )

    response_text = chat_completion.choices[0].message.content
    # return jsonify({'messages': response_text})
    # chat_completion.choices[0].message['content'].strip()

    sessions[session_id].append({'sender': 'user', 'text': message})
    sessions[session_id].append({'sender': 'bot', 'text': response_text})

    return jsonify({'messages': sessions[session_id]})

if __name__ == '__main__':
    app.run(debug=True)
