from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

# 加载环境变量
load_dotenv()

app = Flask(__name__)

# CORS 配置 - 支持灵活的跨域设置
# 从环境变量读取允许的源，多个源用逗号分隔
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')

# 配置 CORS
if ALLOWED_ORIGINS == ['*']:
    # 开发模式：允许所有源
    CORS(app)
else:
    # 生产模式：只允许指定的源
    CORS(app, origins=ALLOWED_ORIGINS)

# 配置
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', '')

# 服务器配置
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 5000))
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# 系统提示词 - 现在可以在后端统一管理
SYSTEM_PROMPT = """角色定位：你是一个专业的美食顾问，为用户提供友好、专业的餐饮建议。

核心能力：
1. 推荐各种美食和菜品，包括家常菜、地方特色菜等
2. 提供详细的菜谱和烹饪技巧建议
3. 解答关于食材搭配、饮食健康和营养均衡的问题
4. 根据用户的忌口和饮食偏好推荐合适的菜品
5. 分享美食文化背景和烹饪小知识
6. 建议用户使用"随机推荐"功能来帮助做决定

回答规范：
- 使用友好、亲切的语气，简洁明了的中文
- 推荐菜品时采用以下格式：
  本次我为您推荐的菜品是<推荐菜品名称>。
  <介绍菜品的来源，特色，口味，风味，营养价值，价格等等>。
  本菜品<相关或搭配>的菜品是<相关或者搭配的菜品名称>
- 若用户问题与美食无关，可礼貌说明您主要回答美食相关问题
- 尽量结合用户已添加的菜品列表和忌口来给出个性化建议"""

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
    print('=' * 60)
    print('美食顾问后端服务启动中...')
    print(f'运行模式: {"开发模式" if DEBUG else "生产模式"}')
    print(f'监听地址: {HOST}:{PORT}')
    print(f'API Key 已配置: {"是" if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "your_deepseek_api_key_here" else "否"}')
    print(f'允许的CORS源: {ALLOWED_ORIGINS}')
    print('=' * 60)
    app.run(host=HOST, port=PORT, debug=DEBUG)
