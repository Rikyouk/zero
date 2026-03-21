#!/bin/bash
echo "================================================"
echo "美食顾问 - 后端服务启动脚本"
echo "================================================"
echo ""

echo "检查Python环境..."
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到Python3，请先安装Python 3.8+"
    exit 1
fi

echo "检查依赖包..."
if ! python3 -c "import flask; import flask_cors; import dotenv; import requests" &> /dev/null; then
    echo "安装依赖包..."
    pip3 install flask flask-cors python-dotenv requests
    if [ $? -ne 0 ]; then
        echo "错误: 依赖包安装失败"
        exit 1
    fi
fi

echo ""
echo "启动后端服务..."
echo "服务地址: http://localhost:5000"
echo "健康检查: http://localhost:5000/api/health"
echo ""
echo "按 Ctrl+C 停止服务"
echo "================================================"
echo ""

python3 server.py
