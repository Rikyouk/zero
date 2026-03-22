let foodList = [];
let avoidList = [];
let foodStats = {}; // 存储菜品推荐次数 { foodName: count }

const STORAGE_KEYS = {
    FOOD_LIST: 'todayEat_foodList',
    AVOID_LIST: 'todayEat_avoidList',
    LAST_RECOMMEND: 'todayEat_lastRecommend',
    FOOD_STATS: 'todayEat_foodStats'
};

// 初始化应用
function initApp() {
    // 初始化 Supabase
    initSupabase();
    
    // 加载本地数据
    loadData();
    
    // 同步推荐次数从 Supabase 到本地
    syncFoodStatsFromSupabase();
    
    // 同步数据到 Supabase
    syncToSupabase();
}

function loadData() {
    const savedFood = localStorage.getItem(STORAGE_KEYS.FOOD_LIST);
    const savedAvoid = localStorage.getItem(STORAGE_KEYS.AVOID_LIST);
    
    if (savedFood) {
        foodList = JSON.parse(savedFood);
    }
    
    if (savedAvoid) {
        avoidList = JSON.parse(savedAvoid);
    }
    
    renderFoodList();
    renderAvoidList();
    updateCounts();
    showLastRecommend();
}

// 加载菜品推荐次数统计
function loadFoodStats() {
    const savedStats = localStorage.getItem(STORAGE_KEYS.FOOD_STATS);
    if (savedStats) {
        foodStats = JSON.parse(savedStats);
    }
}

// 保存菜品推荐次数统计
function saveFoodStats() {
    localStorage.setItem(STORAGE_KEYS.FOOD_STATS, JSON.stringify(foodStats));
}

// 获取菜品推荐次数
function getFoodCount(foodName) {
    return foodStats[foodName] || 0;
}

// 增加菜品推荐次数
async function incrementFoodCount(foodName) {
    const currentCount = getFoodCount(foodName);
    foodStats[foodName] = currentCount + 1;
    saveFoodStats();
    
    // 如果 Supabase 可用，也同步到云端
    if (isSupabaseAvailable()) {
        await incrementFoodCountInSupabase(foodName);
    }
    
    return foodStats[foodName];
}

function saveData() {
    localStorage.setItem(STORAGE_KEYS.FOOD_LIST, JSON.stringify(foodList));
    localStorage.setItem(STORAGE_KEYS.AVOID_LIST, JSON.stringify(avoidList));
}

async function addFood(foodName) {
    if (foodName.trim() === '') {
        alert('请输入菜名！');
        return;
    }
    
    const trimmedName = foodName.trim();
    
    if (foodList.includes(trimmedName)) {
        alert('这个菜已经在列表中了！');
        return;
    }
    
    foodList.push(trimmedName);
    
    // 初始化推荐次数为0
    if (!foodStats[trimmedName]) {
        foodStats[trimmedName] = 0;
        saveFoodStats();
    }
    
    // 如果 Supabase 可用，同步到云端
    if (isSupabaseAvailable()) {
        await addFoodToSupabase(trimmedName);
    }
    
    saveData();
    renderFoodList();
    updateCounts();
}

function addAvoid(avoidName) {
    if (avoidName.trim() === '') {
        alert('请输入忌口！');
        return;
    }
    
    if (avoidList.includes(avoidName.trim())) {
        alert('这个忌口已经在列表中了！');
        return;
    }
    
    avoidList.push(avoidName.trim());
    saveData();
    renderAvoidList();
    updateCounts();
}

function removeFood(index) {
    foodList.splice(index, 1);
    
    // 只从本地列表中删除，保留 Supabase 中的数据
    
    saveData();
    renderFoodList();
    updateCounts();
}

function removeAvoid(index) {
    avoidList.splice(index, 1);
    saveData();
    renderAvoidList();
    updateCounts();
}

function renderFoodList() {
    const foodListEl = document.getElementById('foodList');
    foodListEl.innerHTML = '';
    
    foodList.forEach((food, index) => {
        const count = getFoodCount(food);
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${food} <small class="food-count">(${count}次)</small></span>
            <button class="delete-btn" onclick="removeFood(${index})">删除</button>
        `;
        foodListEl.appendChild(li);
    });
}

function renderAvoidList() {
    const avoidListEl = document.getElementById('avoidList');
    avoidListEl.innerHTML = '';
    
    avoidList.forEach((avoid, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${avoid}</span>
            <button class="delete-btn" onclick="removeAvoid(${index})">删除</button>
        `;
        avoidListEl.appendChild(li);
    });
}

function updateCounts() {
    document.getElementById('foodCount').textContent = `(${foodList.length})`;
    document.getElementById('avoidCount').textContent = `(${avoidList.length})`;
}

function showLastRecommend() {
    const lastRecommendEl = document.getElementById('lastRecommend');
    const lastRecommend = localStorage.getItem(STORAGE_KEYS.LAST_RECOMMEND);
    
    if (lastRecommend) {
        const data = JSON.parse(lastRecommend);
        const timeStr = new Date(data.time).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        lastRecommendEl.textContent = `📅 上次推荐：${data.food} (${timeStr})`;
        lastRecommendEl.style.display = 'block';
    } else {
        lastRecommendEl.style.display = 'none';
    }
}

async function recommendFood() {
    if (foodList.length === 0) {
        alert('请先添加一些菜品！');
        return;
    }
    
    let availableFood = foodList.filter(food => {
        return !avoidList.some(avoid => food.includes(avoid));
    });
    
    if (availableFood.length === 0) {
        alert('所有菜品都包含忌口，请调整忌口列表或添加新菜品！');
        return;
    }
    
    const resultEl = document.getElementById('result');
    resultEl.textContent = '🎰 抽取中...';
    
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(async () => {
        const randomIndex = Math.floor(Math.random() * availableFood.length);
        resultEl.textContent = availableFood[randomIndex];
        count++;
        
        if (count >= maxCount) {
            clearInterval(interval);
            const finalIndex = Math.floor(Math.random() * availableFood.length);
            const selectedFood = availableFood[finalIndex];
            
            // 增加推荐次数
            const newCount = await incrementFoodCount(selectedFood);
            
            // 显示推荐结果和次数
            resultEl.innerHTML = `🎉 今天吃：${selectedFood}！<br><small class="recommend-count">已累计推荐 ${newCount} 次</small>`;
            
            // 保存本次推荐作为下次的上次推荐
            localStorage.setItem(STORAGE_KEYS.LAST_RECOMMEND, JSON.stringify({
                food: selectedFood,
                time: new Date().getTime()
            }));
            
            // 更新菜品列表显示
            renderFoodList();
        }
    }, 100);
}

// 同步推荐次数从 Supabase 到本地
async function syncFoodStatsFromSupabase() {
    if (isSupabaseAvailable()) {
        console.log('开始从 Supabase 同步推荐次数...');
        
        try {
            const { data, error } = await window.supabaseClient
                .from('foods')
                .select('name, recommend_count');
            
            if (error) {
                console.error('获取推荐次数失败:', error);
                return;
            }
            
            // 更新本地推荐次数
            if (data && data.length > 0) {
                data.forEach(item => {
                    foodStats[item.name] = item.recommend_count;
                });
                saveFoodStats();
                console.log('推荐次数同步完成');
                
                // 更新菜品列表显示
                renderFoodList();
            }
        } catch (err) {
            console.error('同步推荐次数异常:', err);
        }
    }
}

// 同步本地数据到 Supabase
async function syncToSupabase() {
    if (isSupabaseAvailable()) {
        console.log('开始同步数据到 Supabase...');
        
        // 同步菜品
        for (const foodName of foodList) {
            await addFoodToSupabase(foodName);
        }
        
        console.log('数据同步完成');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initApp();
    
    const foodInput = document.getElementById('foodInput');
    const addFoodBtn = document.getElementById('addFoodBtn');
    const avoidInput = document.getElementById('avoidInput');
    const addAvoidBtn = document.getElementById('addAvoidBtn');
    const recommendBtn = document.getElementById('recommendBtn');
    
    addFoodBtn.addEventListener('click', function() {
        addFood(foodInput.value);
        foodInput.value = '';
        foodInput.focus();
    });
    
    foodInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addFood(foodInput.value);
            foodInput.value = '';
        }
    });
    
    addAvoidBtn.addEventListener('click', function() {
        addAvoid(avoidInput.value);
        avoidInput.value = '';
        avoidInput.focus();
    });
    
    avoidInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addAvoid(avoidInput.value);
            avoidInput.value = '';
        }
    });
    
    recommendBtn.addEventListener('click', recommendFood);
    
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const food = this.getAttribute('data-food');
            addFood(food);
        });
    });

    // AI 对话功能
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');

    // 发送消息
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 添加用户消息到界面
        addMessage(message, 'user');
        chatInput.value = '';

        // 显示正在输入指示器
        showTypingIndicator();

        // 调用 DeepSeek API
        callDeepSeekAPI(message);
    }

    // 添加消息到界面
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 显示正在输入指示器
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 移除正在输入指示器
    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // 调用 DeepSeek API（通过 EdgeOne 边缘函数代理）
    async function callDeepSeekAPI(userMessage) {
        const env = loadEnv();
        const apiProxy = env.DEEPSEEK_API_PROXY;

        try {
            // 构建提示词，结合美食顾问角色
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

            // 通过 EdgeOne 边缘函数代理调用，API Key 仅在后端可见
            const response = await fetch(apiProxy, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: false  // 设为 true 可启用流式响应（打字机效果）
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API 请求失败: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices?.[0]?.message?.content || '抱歉，我无法回答这个问题。';

            removeTypingIndicator();
            addMessage(aiResponse, 'ai');

        } catch (error) {
            console.error('DeepSeek API 调用失败:', error);
            removeTypingIndicator();
            addMessage('抱歉，AI 顾问暂时无法回答您的问题，请稍后再试。', 'ai');
        }
    }

    // 绑定事件
    chatSendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 添加欢迎消息
    addMessage('您好！我是您的 AI 美食顾问。我可以帮您推荐美食、提供菜谱建议、解答烹饪问题。请问有什么可以帮您的？', 'ai');
});