-- Supabase 数据库表结构
-- 今天吃什么 - 数据库设计

-- 菜品表 (Foods)
CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    recommend_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 忌口表 (Avoids)
CREATE TABLE avoids (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 推荐历史表 (RecommendHistory) - 可选，用于记录每次推荐
CREATE TABLE recommend_history (
    id SERIAL PRIMARY KEY,
    food_id INTEGER REFERENCES foods(id),
    recommended_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_foods_name ON foods(name);
CREATE INDEX idx_avoids_name ON avoids(name);
CREATE INDEX idx_recommend_history_food_id ON recommend_history(food_id);
CREATE INDEX idx_recommend_history_recommended_at ON recommend_history(recommended_at);

-- 创建触发器函数：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_foods_updated_at
    BEFORE UPDATE ON foods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 启用 RLS
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE avoids ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommend_history ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有操作（简化版，生产环境应该更严格）
CREATE POLICY "Allow all" ON foods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON avoids FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON recommend_history FOR ALL USING (true) WITH CHECK (true);

-- 插入示例数据
INSERT INTO foods (name, recommend_count) VALUES
('红烧肉', 0),
('宫保鸡丁', 0),
('鱼香肉丝', 0),
('麻婆豆腐', 0),
('糖醋排骨', 0),
('回锅肉', 0),
('水煮鱼', 0),
('西红柿鸡蛋', 0)
ON CONFLICT (name) DO NOTHING;