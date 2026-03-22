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
6. **AI 美食顾问**：在页面底部的 AI 对话区域，可以向美食顾问提问

## AI 美食顾问配置

### System Prompt 自定义

项目支持通过修改 System Prompt 来定制 AI 美食顾问的行为和回答风格。

#### 配置位置

在 `script.js` 文件中找到 `callDeepSeekAPI` 函数，修改 `systemPrompt` 常量即可：

```javascript
const systemPrompt = `你是一个专业的美食顾问
## 核心职责
- 作为专业的美食顾问，为用户提供精准、实用的美食建议
- 结合用户已添加的菜品列表和忌口，给出个性化推荐
- 回答要简洁、实用、有温度
## 回答规范
1. **推荐菜品时**：可以参考用户的菜品列表，但也可推荐新菜品
2. **忌口处理**：严格避开用户提到的忌口食材
3. **语气**：友好、专业、有耐心
4. 推荐菜品时采用以下格式：
本次我为您推荐的菜品是<推荐菜品名称>。
<介绍菜品的来源，特色，口味，风味，营养价值，价格等等>。
本菜品<相关或搭配>的菜品是<相关或者搭配的菜品名称>
适当使用换行和 emoji 提升可读性
5. 当用户询问与美食无关的问题时，请用委婉礼貌的方式避开此类问题

请用友好、简洁的中文回答用户的问题。`;
```

#### 优化建议

可以通过动态获取用户数据来增强 AI 的个性化推荐：

```javascript
// 获取用户当前的菜品列表和忌口
const foodItems = Array.from(document.querySelectorAll('#foodList li')).map(li => 
    li.textContent.replace('×', '').trim()
);
const avoidItems = Array.from(document.querySelectorAll('#avoidList li')).map(li => 
    li.textContent.replace('×', '').trim()
);

// 在 System Prompt 中使用这些数据
const systemPrompt = `...
## 用户当前数据
- 用户菜品列表：${foodItems.length > 0 ? foodItems.join('、') : '暂无菜品'}
- 用户忌口列表：${avoidItems.length > 0 ? avoidItems.join('、') : '无忌口'}
...`;
```

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