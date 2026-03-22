#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PRD配置同步脚本 - 用于从PRD.md中读取System Prompt配置并自动更新server.py

使用方法：
    python sync_prompt_config.py

功能：
    1. 从PRD.md中读取 <!-- START_SYSTEM_PROMPT --> 和 <!-- END_SYSTEM_PROMPT --> 之间的配置
    2. 自动更新server.py中的SYSTEM_PROMPT变量
    3. 备份原server.py（可选）
"""
import re
import sys
import shutil
from datetime import datetime

# 设置控制台输出编码为UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def read_prd_system_prompt(prd_path='PRD.md'):
    """从PRD.md中读取System Prompt配置"""
    try:
        with open(prd_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 使用正则匹配标记之间的内容（更宽松的匹配，处理不同的换行格式）
        pattern = r'<!-- START_SYSTEM_PROMPT -->.*?```system_prompt\s*(.*?)\s*```.*?<!-- END_SYSTEM_PROMPT -->'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            system_prompt = match.group(1).strip()
            print("[OK] 成功从PRD.md读取System Prompt:")
            print("=" * 50)
            print(system_prompt[:200] + "..." if len(system_prompt) > 200 else system_prompt)
            print("=" * 50)
            return system_prompt
        else:
            print("[ERROR] 未找到System Prompt配置标记，请检查PRD.md格式")
            return None
            
    except FileNotFoundError:
        print(f"[ERROR] 未找到文件: {prd_path}")
        return None
    except Exception as e:
        print(f"[ERROR] 读取PRD.md失败: {e}")
        return None

def read_prd_ai_config(prd_path='PRD.md'):
    """从PRD.md中读取AI配置"""
    try:
        with open(prd_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        pattern = r'<!-- START_AI_CONFIG -->.*?```ai_config\s*(.*?)\s*```.*?<!-- END_AI_CONFIG -->'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            print("[OK] 成功从PRD.md读取AI配置")
            return match.group(1).strip()
        return None
    except Exception as e:
        print(f"[WARN] 读取AI配置失败: {e}")
        return None

def update_server_py(system_prompt, server_path='server.py', backup=True):
    """更新server.py中的SYSTEM_PROMPT变量"""
    if not system_prompt:
        print("[ERROR] System Prompt为空，取消更新")
        return False
    
    try:
        # 备份原文件
        if backup:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_path = f'{server_path}.backup_{timestamp}'
            shutil.copy2(server_path, backup_path)
            print(f"[BACKUP] 已备份原文件到: {backup_path}")
        
        # 读取server.py
        with open(server_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 构建新的SYSTEM_PROMPT定义
        # 使用三重引号转义
        escaped_prompt = system_prompt.replace('"""', '\'\'\'')
        new_system_prompt = f'SYSTEM_PROMPT = """{escaped_prompt}"""'
        
        # 匹配并替换SYSTEM_PROMPT
        # 匹配从SYSTEM_PROMPT = """开始到下一个"""结束的内容
        pattern = r'SYSTEM_PROMPT\s*=\s*""".*?"""'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            new_content = content[:match.start()] + new_system_prompt + content[match.end():]
            
            # 写入更新后的内容
            with open(server_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print("[OK] server.py 已成功更新!")
            return True
        else:
            print("[ERROR] 未找到SYSTEM_PROMPT变量定义，请检查server.py格式")
            return False
            
    except Exception as e:
        print(f"[ERROR] 更新server.py失败: {e}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("PRD System Prompt 配置同步工具")
    print("=" * 60)
    
    # 读取配置
    system_prompt = read_prd_system_prompt()
    if not system_prompt:
        return 1
    
    # 读取AI配置（可选）
    ai_config = read_prd_ai_config()
    
    # 更新server.py
    print("\n 准备更新 server.py...")
    success = update_server_py(system_prompt)
    
    print("\n" + "=" * 60)
    if success:
        print(" 配置同步完成!")
        print(" 提示: 修改PRD.md中的System Prompt后，重新运行此脚本即可同步")
    else:
        print(" 配置同步失败!")
    print("=" * 60)
    
    return 0 if success else 1

if __name__ == '__main__':
    exit(main())
