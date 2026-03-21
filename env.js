// .env 文件加载器
function loadEnv() {
    const env = {
        SUPABASE_URL: 'https://lvhluqnuztzfsvpuzbad.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aGx1cW51enR6ZnN2cHV6YmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDM0NDQsImV4cCI6MjA4ODYxOTQ0NH0.G8XU88CYbCMVNREmf7ToU8kOAUAGhuFcx3rYYf8oJqY',
        DEEPSEEK_API_KEY: 'sk-fd283d7fef444153afa6d9ba9c05f760'
    };
    
    // 检查是否存在 .env 文件内容
    // 这里使用硬编码值，因为浏览器环境无法直接读取 .env 文件
    // 请将 your_deepseek_api_key_here 替换为实际的 DeepSeek API Key
    
    return env;
}