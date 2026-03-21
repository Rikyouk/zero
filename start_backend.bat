@echo off
echo ================================================
echo 美食顾问 - 后端服务启动脚本
echo ================================================
echo.

echo 检查Python环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Python，请先安装Python 3.8+
    pause
    exit /b 1
)

echo 检查依赖包...
python -c "import flask; import flask_cors; import dotenv; import requests" >nul 2>&1
if errorlevel 1 (
    echo 安装依赖包...
    pip install flask flask-cors python-dotenv requests
    if errorlevel 1 (
        echo 错误: 依赖包安装失败
        pause
        exit /b 1
    )
)

echo.
echo 启动后端服务...
echo 服务地址: http://localhost:5000
echo 健康检查: http://localhost:5000/api/health
echo.
echo 按 Ctrl+C 停止服务
echo ================================================
echo.

python server.py

pause
