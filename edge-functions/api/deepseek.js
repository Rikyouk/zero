// DeepSeek API 安全代理函数 - EdgeOne Pages Function
// 所有 DeepSeek API 请求通过此代理转发，API Key 仅在边缘节点可见

export async function onRequest(context) {
  const { request, env } = context;
  
  // CORS 安全头配置
  const corsHeaders = {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 仅允许 POST 请求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed', message: '仅支持 POST 请求' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  try {
    // 解析请求体
    const body = await request.json();
    
    // 从环境变量获取 API Key（前端不可见）
    const apiKey = env.DEEPSEEK_API_KEY;
    
    if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
      return new Response(JSON.stringify({ error: 'API Key 未配置', message: '请在 EdgeOne 控制台配置 DEEPSEEK_API_KEY 环境变量' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // 构建发送到 DeepSeek API 的请求
    const deepseekRequest = {
      model: body.model || 'deepseek-chat',
      messages: body.messages,
      temperature: body.temperature || 0.7,
      max_tokens: body.max_tokens || 2000,
      stream: body.stream || false,
    };

    // 转发请求到 DeepSeek API
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(deepseekRequest),
    });

    // 处理流式响应（支持打字机效果）
    if (body.stream) {
      const { readable, writable } = new TransformStream();
      
      deepseekResponse.body.pipeTo(writable).catch(err => {
        console.error('Stream error:', err);
      });
      
      return new Response(readable, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // 非流式响应
    const data = await deepseekResponse.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: '代理请求失败', message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
