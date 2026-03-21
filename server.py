from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 配置
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', '')

# 系统提示词 - 现在可以在后端统一管理
SYSTEM_PROMPT = """你是一个专业的美食顾问，擅长：
1. 推荐各种美食和菜品
2. 提供菜谱和烹饪建议
3. 解答关于食材搭配、饮食健康的问题
4. 根据用户的忌口推荐合适的菜品
5. 分享美食文化和烹饪技巧

请用友好、简洁的中文回答用户的问题。"""

@app.route('/api/chat', methods=['POST'])
def chat():
    """处理AI聊天请求"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        food_list = data.get('foodList', [])
        avoid_list = data.get('avoidList', [])
        
        if not user_message:
            return jsonify({'error': '消息内容不能为空'}), 400
        
        if not DEEPSEEK_API_KEY or DEEPSEEK_API_KEY == 'your_deepseek_api_key_here':
            return jsonify({'error': 'API Key 未配置，请联系管理员'}), 500
        
        # 构建增强版系统提示词，包含用户上下文
        enhanced_prompt = SYSTEM_PROMPT
        if food_list:
            enhanced_prompt += f"\n\n用户当前的菜品列表：{', '.join(food_list)}"
        if avoid_list:
            enhanced_prompt += f"\n用户当前的忌口列表：{', '.join(avoid_list)}"
        
        # 调用DeepSeek API
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}'
        }
        
        payload = {
            'model': 'deepseek-chat',
            'messages': [
                {'role': 'system', 'content': enhanced_prompt},
                {'role': 'user', 'content': user_message}
            ],
            'temperature': 0.7,
            'max_tokens': 1000
        }
        
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        ai_response = result['choices'][0]['message']['content']
        
        return jsonify({
            'response': ai_response,
            'success': True
        })
        
    except requests.exceptions.RequestException as e:
        error_msg = f'API请求失败: {str(e)}'
        print(error_msg)
        return jsonify({'error': 'AI服务暂时不可用，请稍后再试'}), 503
    except Exception as e:
        error_msg = f'服务器错误: {str(e)}'
        print(error_msg)
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({
        'status': 'ok',
        'api_key_configured': bool(DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != 'your_deepseek_api_key_here')
    })

if __name__ == '__main__':
    print('=' * 50)
    print('美食顾问后端服务启动中...')
    print(f'API Key 已配置: {"是" if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "your_deepseek_api_key_here" else "否"}')
    print('=' * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
