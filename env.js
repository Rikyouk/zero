// 环境配置文件
// 注意：敏感的 API Key 已移至后端 .env 文件管理，前端不再暴露
function loadEnv() {
    const env = {
        SUPABASE_URL: 'https://lvhluqnuztzfsvpuzbad.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aGx1cW51enR6ZnN2cHV6YmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDM0NDQsImV4cCI6MjA4ODYxOTQ0NH0.G8XU88CYbCMVNREmf7ToU8kOAUAGhuFcx3rYYf8oJqY',
        // DEEPSEEK_API_KEY 已移至后端 .env 文件，前端不再需要
        BACKEND_API_URL: 'http://localhost:5000/api'
    };
    
    return env;
}