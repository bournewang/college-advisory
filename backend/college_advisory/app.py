from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import uuid
import os
from openai import OpenAI
import redis
import json

def create_app():
    # 加载 .env 文件中的环境变量
    load_dotenv()

    # 获取当前文件的绝对路径
    current_file_path = os.path.abspath(__file__)

    # 获取父目录，即项目根目录
    project_root = os.path.dirname(os.path.dirname(current_file_path))

    # 构建静态文件目录的绝对路径
    static_folder = os.path.join(project_root, 'build')

    app = Flask(__name__, static_folder=static_folder)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Session-Id'

    # 设置OpenAI API密钥
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 设置 Redis 连接
    redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

    @app.route('/api/start_session', methods=['POST'])
    @cross_origin()
    def start_session():
        token = request.headers.get('Token')
        if not token or not redis_client.exists(token):
            token = str(uuid.uuid4())
            redis_client.set(token, json.dumps([]))
        return jsonify({'token': token})

    @app.route('/api/send_message', methods=['POST'])
    @cross_origin()
    def send_message():
        data = request.json
        token = request.headers.get('Token')
        message = data.get('message')

        if not redis_client.exists(token):
            return jsonify({'error': 'token not exists!'})

        # 从 Redis 获取会话数据
        session_data = json.loads(redis_client.get(token))
        session_data.append({'role': 'user', 'content': message})

        # 调用OpenAI API生成响应
        response = client.chat.completions.create(
            model="gpt-4",
            messages=session_data
        )

        response_text = response.choices[0].message.content
        session_data.append({'role': 'assistant', 'content': response_text})

        # 将更新的会话数据存储到 Redis
        redis_client.set(token, json.dumps(session_data))

        return jsonify({'messages': session_data})

    @app.route('/api/fetch_messages', methods=['GET'])
    def fetch_messages():
        token = request.headers.get('Token')
        if not token or not redis_client.exists(token):
            return jsonify({'error': 'Invalid session ID'}), 400

        session_data = json.loads(redis_client.get(token))
        return jsonify({'messages': session_data})

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
