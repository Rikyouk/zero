// .env 文件加载器
function loadEnv() {
    const env = {
        SUPABASE_URL: 'https://lvhluqnuztzfsvpuzbad.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aGx1cW51enR6ZnN2cHV6YmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDM0NDQsImV4cCI6MjA4ODYxOTQ0NH0.G8XU88CYbCMVNREmf7ToU8kOAUAGhuFcx3rYYf8oJqY'
    };
    
    // 检查是否存在 .env 文件内容
    // 这里使用硬编码值，因为浏览器环境无法直接读取 .env 文件
    
    return env;
}