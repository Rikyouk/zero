// 环境配置文件
// 注意：DeepSeek API Key 已移至 EdgeOne 边缘函数环境变量
// 前端不再需要存储敏感的 API 密钥

function loadEnv() {
    const env = {
        // Supabase 配置（匿名密钥设计上可公开，建议启用 RLS 行级安全）
        SUPABASE_URL: 'https://lvhluqnuztzfsvpuzbad.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aGx1cW51enR6ZnN2cHV6YmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDM0NDQsImV4cCI6MjA4ODYxOTQ0NH0.G8XU88CYbCMVNREmf7ToU8kOAUAGhuFcx3rYYf8oJqY',
        
        // DeepSeek API 代理地址（EdgeOne 边缘函数）
        // 前端通过此代理调用 DeepSeek API，不再直接暴露 API Key
        DEEPSEEK_API_PROXY: '/api/deepseek',
        
        // 标记：API Key 已安全移至后端代理
        DEEPSEEK_API_KEY: 'PROTECTED_BY_EDGE_FUNCTION'
    };
    
    return env;
}
