# 今天吃什么 - 随机推荐系统

一个简单的网页应用，帮助你随机选择今天吃什么，支持输入忌口，记录推荐次数，并与 Supabase 同步数据。

## 功能特性

- 🍽️ 随机推荐菜品
- 🚫 支持输入忌口
- 🔄 与 Supabase 同步数据
- 📊 记录推荐次数
- 📅 显示上次推荐
- 💾 本地存储备份

## 技术栈

- HTML5 + CSS3 + JavaScript
- Python + Flask (后端API代理)
- Supabase (云端数据库)
- DeepSeek API (AI美食顾问)
- LocalStorage (本地存储)

## AI 美食顾问功能

项目集成了 DeepSeek AI 大语言模型，提供智能美食咨询服务。

### System Prompt 配置

AI 美食顾问的角色定位和行为规范通过 System Prompt 进行配置，存储在后端 `server.py` 文件中：

```
角色定位：你是一个专业的美食顾问，为用户提供友好、专业的餐饮建议。

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
- 尽量结合用户已添加的菜品列表和忌口来给出个性化建议
```

### 动态上下文增强

在实际调用时，系统会自动将用户的菜品列表和忌口信息追加到 System Prompt 中，以提供更个性化的建议：

```
用户当前的菜品列表：番茄炒蛋、红烧肉、清蒸鱼
用户当前的忌口列表：辣、海鲜
```

## 本地运行

### 后端服务启动（AI功能必需）

AI 美食顾问功能需要启动后端 Flask 服务：

```bash
# 安装依赖
pip install flask flask-cors python-dotenv requests

# 启动后端服务（Windows）
start_backend.bat

# 启动后端服务（Linux/Mac）
./start_backend.sh

# 或手动启动
python server.py
```

后端服务默认运行在 `http://localhost:5000`

### 前端页面访问

直接在浏览器中打开 `index.html` 即可使用所有功能。

## 部署说明

### 架构说明

项目采用前后端分离架构：
- **前端页面**：可部署到 EdgeOne、CDN 等静态托管服务
- **后端API**：需要部署到支持 Python 的服务器

### EdgeOne 部署（前端静态页面）

1. **准备工作**
   - 确保项目已上传到 GitHub 仓库
   - 注册并登录 EdgeOne 控制台

2. **部署步骤**
   - 在 EdgeOne 控制台中创建新的站点
   - 选择 "GitHub 部署"
   - 连接你的 GitHub 账号
   - 选择本仓库
   - 配置部署设置（使用默认设置即可）
   - 点击 "部署"

3. **注意事项**
   - EdgeOne 仅托管前端静态页面
   - AI 功能需要单独部署后端服务

### 环境变量配置

项目使用 `.env` 文件存储配置：
```
# Supabase 配置
SUPABASE_URL=https://lvhluqnuztzfsvpuzbad.supabase.co
SUPABASE_ANON_KEY=你的密钥

# DeepSeek API 配置（后端使用）
DEEPSEEK_API_KEY=你的DeepSeek API密钥
```

## 使用说明

1. **添加菜品**：在输入框中输入菜名，点击 "添加" 按钮
2. **添加忌口**：在输入框中输入忌口，点击 "添加" 按钮
3. **随机推荐**：点击 "随机推荐" 按钮，系统会从可用菜品中随机选择一个
4. **查看推荐次数**：每个菜品旁边显示推荐次数
5. **查看上次推荐**：页面顶部显示上次推荐的菜品和时间

## 项目结构

```
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 功能实现
├── env.js              # 环境变量加载（前端）
├── supabase-config.js  # Supabase 配置
├── server.py           # 后端 Flask 服务
├── start_backend.bat   # Windows 启动脚本
├── start_backend.sh    # Linux/Mac 启动脚本
├── .env                # 环境变量配置
├── .gitignore          # Git 忽略文件
├── README.md           # 项目说明文档
├── PRD.md              # 产品需求文档
└── supabase_schema.sql # 数据库结构
```

## 数据库结构

使用 Supabase 创建以下表：

### foods 表
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) NOT NULL UNIQUE)
- `recommend_count` (INTEGER DEFAULT 0)
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License