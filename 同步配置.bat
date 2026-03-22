@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ================================================
echo PRD System Prompt 配置同步工具
echo ================================================
echo.

echo 检查Python环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Python，请先安装Python 3.8+
    echo.
    pause
    exit /b 1
)

echo Python环境已就绪
echo.
echo 开始同步配置...
echo ================================================
echo.

python sync_prompt_config.py

echo.
echo ================================================
echo 同步完成！请查看上面的输出信息确认结果
echo ================================================
echo.
pause
