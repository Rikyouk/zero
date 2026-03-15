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
- Supabase (云端数据库)
- LocalStorage (本地存储)

## 部署说明

### EdgeOne 部署

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

3. **环境变量**
   项目使用 `.env` 文件存储 Supabase 配置：
   ```
   SUPABASE_URL=https://lvhluqnuztzfsvpuzbad.supabase.co
   SUPABASE_ANON_KEY=你的密钥
   ```
   在 EdgeOne 部署时，需要在环境变量设置中添加这些配置。

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
├── env.js              # 环境变量加载
├── supabase-config.js  # Supabase 配置
├── .env                # 环境变量配置
├── .gitignore          # Git 忽略文件
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