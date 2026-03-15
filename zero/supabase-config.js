// Supabase 配置
const envConfig = loadEnv();

// 初始化 Supabase 客户端
let supabaseClient;

// 暴露到全局作用域，供 script.js 使用
if (typeof window !== 'undefined') {
    window.supabaseClient = supabaseClient;
    window.initSupabase = initSupabase;
    window.isSupabaseAvailable = isSupabaseAvailable;
    window.getFoodsFromSupabase = getFoodsFromSupabase;
    window.getFoodFromSupabase = getFoodFromSupabase;
    window.addFoodToSupabase = addFoodToSupabase;
    window.incrementFoodCountInSupabase = incrementFoodCountInSupabase;
    window.deleteFoodFromSupabase = deleteFoodFromSupabase;
    window.syncFoodsToSupabase = syncFoodsToSupabase;
}

function initSupabase() {
    if (typeof window !== 'undefined' && window.supabase) {
        supabaseClient = window.supabase.createClient(envConfig.SUPABASE_URL, envConfig.SUPABASE_ANON_KEY);
        // 更新全局变量
        if (typeof window !== 'undefined') {
            window.supabaseClient = supabaseClient;
        }
        console.log('Supabase 初始化成功');
        return true;
    } else {
        console.error('Supabase 库未加载');
        return false;
    }
}

// 检查 Supabase 是否可用
function isSupabaseAvailable() {
    return supabaseClient !== undefined && supabaseClient !== null;
}

// 从 Supabase 获取所有菜品及其推荐次数
async function getFoodsFromSupabase() {
    if (!isSupabaseAvailable()) {
        console.error('Supabase 未初始化');
        return null;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('foods')
            .select('*')
            .order('name');
        
        if (error) {
            console.error('获取菜品失败:', error);
            return null;
        }
        
        return data;
    } catch (err) {
        console.error('获取菜品异常:', err);
        return null;
    }
}

// 从 Supabase 获取单个菜品
async function getFoodFromSupabase(foodName) {
    if (!isSupabaseAvailable()) {
        console.error('Supabase 未初始化');
        return null;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('foods')
            .select('*')
            .eq('name', foodName)
            .single();
        
        if (error) {
            console.error('获取菜品失败:', error);
            return null;
        }
        
        return data;
    } catch (err) {
        console.error('获取菜品异常:', err);
        return null;
    }
}

// 添加菜品到 Supabase
async function addFoodToSupabase(foodName) {
    if (!isSupabaseAvailable()) {
        console.error('Supabase 未初始化');
        return null;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('foods')
            .insert([{ name: foodName, recommend_count: 0 }])
            .select()
            .single();
        
        if (error) {
            // 如果菜品已存在，返回已存在的记录
            if (error.code === '23505') {
                return await getFoodFromSupabase(foodName);
            }
            console.error('添加菜品失败:', error);
            return null;
        }
        
        return data;
    } catch (err) {
        console.error('添加菜品异常:', err);
        return null;
    }
}

// 增加菜品推荐次数
async function incrementFoodCountInSupabase(foodName) {
    if (!isSupabaseAvailable()) {
        console.error('Supabase 未初始化');
        return null;
    }
    
    try {
        // 先获取当前菜品
        const food = await getFoodFromSupabase(foodName);
        
        if (!food) {
            // 如果菜品不存在，先创建
            const newFood = await addFoodToSupabase(foodName);
            if (newFood) {
                // 新创建的菜品推荐次数为1
                const { data, error } = await supabaseClient
                    .from('foods')
                    .update({ recommend_count: 1 })
                    .eq('id', newFood.id)
                    .select()
                    .single();
                
                if (error) {
                    console.error('更新推荐次数失败:', error);
                    return null;
                }
                return data;
            }
            return null;
        }
        
        // 更新推荐次数
        const { data, error } = await supabaseClient
            .from('foods')
            .update({ recommend_count: food.recommend_count + 1 })
            .eq('id', food.id)
            .select()
            .single();
        
        if (error) {
            console.error('更新推荐次数失败:', error);
            return null;
        }
        
        return data;
    } catch (err) {
        console.error('增加推荐次数异常:', err);
        return null;
    }
}

// 删除菜品
async function deleteFoodFromSupabase(foodName) {
    if (!isSupabaseAvailable()) {
        console.error('Supabase 未初始化');
        return false;
    }
    
    try {
        const { error } = await supabaseClient
            .from('foods')
            .delete()
            .eq('name', foodName);
        
        if (error) {
            console.error('删除菜品失败:', error);
            return false;
        }
        
        return true;
    } catch (err) {
        console.error('删除菜品异常:', err);
        return false;
    }
}

// 同步本地菜品到 Supabase
async function syncFoodsToSupabase(foods) {
    if (!isSupabaseAvailable()) {
        console.error('Supabase 未初始化');
        return;
    }
    
    for (const foodName of foods) {
        await addFoodToSupabase(foodName);
    }
    console.log('菜品同步完成');
}