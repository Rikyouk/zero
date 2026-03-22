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

### EdgeOne 完整部署方案

项目采用**前后端分离架构**，需要分别部署前端页面和后端API服务。

---

#### 🏗️ 部署架构总览

```
┌─────────────────────────────────────────────────────────┐
│ 用户浏览器                                               │
│    ┌───────────────────┐     ┌──────────────────────┐   │
│    │   前端静态页面     │────►│   EdgeOne CDN        │   │
│    │ (HTML/CSS/JS)     │     │ (托管前端静态资源)    │   │
│    └───────────────────┘     └──────────────────────┘   │
│              │                                           │
│              ▼                                           │
│    ┌───────────────────┐     ┌──────────────────────┐   │
│    │   AI聊天请求      │────►│   后端API服务        │   │
│    │   /api/chat       │     │ (Python/Flask)       │   │
│    └───────────────────┘     └──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

#### 📦 方案一：独立域名部署（推荐）

**架构说明**：
- 前端：EdgeOne CDN（如 `https://eat.example.com`）
- 后端：独立服务器（如 `https://api.eat.example.com`）
- 优点：架构清晰，易于维护和扩展

**部署步骤**：

##### 步骤1：部署前端到 EdgeOne

```bash
1. 登录 EdgeOne 控制台
2. 创建新站点 → 选择 "GitHub 部署"
3. 连接 GitHub 账号 → 选择本仓库
4. 配置部署设置：
   - 构建命令：无需配置
   - 输出目录：./ （根目录）
   - 环境变量：无需配置（前端已自动检测）
5. 点击 "部署" → 等待部署完成
6. 绑定你的域名（如 eat.example.com）
```

##### 步骤2：部署后端API服务

选择以下任一方式部署后端：

**选项A：使用云服务器**
```bash
# 1. 在云服务器上安装 Python 3.8+
# 2. 克隆代码
git clone https://github.com/Rikyouk/zero.git
cd zero

# 3. 安装依赖
pip install flask flask-cors python-dotenv requests

# 4. 配置环境变量（重要！）
vi .env
# 修改以下配置：
# ALLOWED_ORIGINS=https://eat.example.com
# DEEPSEEK_API_KEY=你的API密钥
# DEBUG=False

# 5. 启动服务（生产模式推荐使用 gunicorn）
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 server:app --daemon
```

**选项B：使用 Serverless 函数**
- 腾讯云函数 SCF / 阿里云函数计算 FC
- 将 `server.py` 改造为 Serverless 函数

##### 步骤3：配置前后端连通

```bash
# 方法1：在 env.js 中配置后端地址（推荐）
# 修改 env.js：
BACKEND_API_URL: 'https://api.eat.example.com'

# 方法2：在 EdgeOne 配置反向代理
# 将 /api/* 请求转发到你的后端服务
# 需要在 EdgeOne 控制台配置 "规则引擎" 或 "回源配置"
```

---

#### 🔄 方案二：同域名反向代理（最简单）

**架构说明**：
- 所有请求都经过 EdgeOne
- 静态请求由 EdgeOne 直接响应
- API 请求由 EdgeOne 转发到后端服务
- 优点：前端无需额外配置，避免跨域问题

**部署步骤**：

1. **部署前端到 EdgeOne**（同方案一步骤1）

2. **在 EdgeOne 控制台配置反向代理规则**：
   ```
   匹配路径：/api/*
   转发动作：回源到你的后端服务器地址
   回源地址：https://api.eat.example.com/api/*
   ```

3. **部署后端服务**（同方案一步骤2）
   ```
   # .env 配置：
   ALLOWED_ORIGINS=https://eat.example.com
   ```

---

#### 🔧 环境变量配置说明

后端 `.env` 文件关键配置项：

```env
# =============================================================================
# 生产环境关键配置
# =============================================================================

# 运行模式（生产环境设为 False）
DEBUG=False

# CORS 跨域配置（重要！只允许你的前端域名）
# 多个域名用逗号分隔
ALLOWED_ORIGINS=https://eat.example.com,https://www.eat.example.com

# DeepSeek API Key（AI功能必需）
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# =============================================================================
# 可选配置
# =============================================================================

# 服务端口（默认5000）
PORT=5000

# Supabase 配置（用于菜品数据云端同步）
SUPABASE_URL=https://lvhluqnuztzfsvpuzbad.supabase.co
SUPABASE_ANON_KEY=你的密钥
```

---

#### ✅ 部署验证清单

```
✅ 前端部署验证：
   [ ] 访问前端域名，页面正常加载
   [ ] 菜品添加/删除功能正常
   [ ] 随机推荐功能正常

✅ 后端部署验证：
   [ ] 访问 https://api.eat.example.com/api/health，返回 {"status":"ok"}
   [ ] 检查 API Key 配置状态：api_key_configured: true

✅ 前后端连通验证：
   [ ] 在前端页面测试 AI 聊天功能
   [ ] 浏览器控制台无跨域(CORS)错误
   [ ] AI 能够正常返回回答
```

---

#### ❓ 常见问题排查

| 问题现象 | 可能原因 | 解决方案 |
|---------|---------|---------|
| 前端显示"无法连接到后端服务" | 后端服务未启动或地址错误 | 1. 检查后端服务是否运行<br>2. 检查 `BACKEND_API_URL` 配置<br>3. 检查防火墙/安全组配置 |
| 浏览器控制台显示 CORS 错误 | 后端 CORS 配置不正确 | 检查 `.env` 中 `ALLOWED_ORIGINS` 是否包含前端域名 |
| AI 无响应，显示"API Key未配置" | 后端未正确配置 DeepSeek API Key | 检查 `.env` 中 `DEEPSEEK_API_KEY` |
| 本地正常但部署后无法使用 | 生产环境配置问题 | 1. 确认 `DEBUG=False`<br>2. 确认 `ALLOWED_ORIGINS` 正确配置<br>3. 检查后端服务日志 |

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