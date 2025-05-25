"""
AI服务模块，用于处理AI相关的请求
"""
import os
import json
import requests
from django.conf import settings
import logging
from openai import OpenAI

logger = logging.getLogger(__name__)

# 系统默认API设置（如果用户未提供）
DEFAULT_AI_API_KEY = os.environ.get('AI_API_KEY', '')
DEFAULT_AI_BASE_URL = os.environ.get('AI_BASE_URL', 'https://api.deepseek.com')
DEFAULT_AI_MODEL = os.environ.get('AI_MODEL', 'deepseek-chat')

def get_ai_response(messages, system_prompt=None, user_preferences=None):
    """
    获取AI响应
    
    参数:
        messages (list): 消息列表，每个消息是一个dict，包含'role'和'content'字段
        system_prompt (str, optional): 系统提示，默认为None
        user_preferences (UserPreference, optional): 用户偏好设置，用于获取API密钥等
    
    返回:
        dict: AI响应对象
    """
    if not messages:
        return {
            'status': 'error',
            'message': '消息不能为空',
            'content': ''
        }
    
    # 默认系统提示
    if system_prompt is None:
        system_prompt = (
            "你是LS笔记应用中的AI助手。你的主要任务是帮助用户处理笔记相关的问题。"
            "请保持回答简洁、有用，并使用Markdown格式来提高可读性。"
        )
    
    # 使用用户设置的API参数或系统默认值
    ai_api_key = DEFAULT_AI_API_KEY
    ai_base_url = DEFAULT_AI_BASE_URL
    ai_model = DEFAULT_AI_MODEL
    
    if user_preferences:
        if user_preferences.ai_api_key:
            ai_api_key = user_preferences.ai_api_key
        if user_preferences.ai_base_url:
            ai_base_url = user_preferences.ai_base_url
        if user_preferences.ai_model:
            ai_model = user_preferences.ai_model
    
    # 如果没有API密钥，返回错误
    if not ai_api_key:
        return {
            'status': 'error',
            'message': '未设置AI API密钥，请在设置中配置',
            'content': ''
        }
    
    try:
        # 使用OpenAI客户端进行API调用
        client = OpenAI(api_key=ai_api_key, base_url=ai_base_url)
        
        # 准备消息，包括系统提示
        complete_messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # 添加历史消息，确保每条消息都有正确的role格式
        for msg in messages:
            # 确保消息格式正确
            if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                # 如果消息格式已经正确，直接添加
                complete_messages.append(msg)
            elif isinstance(msg, dict) and 'message_type' in msg and 'content' in msg:
                # 如果是从数据库模型转换而来的消息格式
                role = 'user' if msg['message_type'] == 'user' else 'assistant'
                complete_messages.append({"role": role, "content": msg['content']})
        
        # 记录API请求日志
        logger.debug(f"发送请求到DeepSeek API: model={ai_model}, messages={len(complete_messages)}条")
        logger.debug(f"消息内容: {json.dumps(complete_messages, ensure_ascii=False)}")
        
        try:
            # 发起请求
            response = client.chat.completions.create(
                model=ai_model,
                messages=complete_messages,
                stream=False
            )
            
            # 获取响应内容
            content = response.choices[0].message.content
        
            return {
                'status': 'success',
                'message': '请求成功',
                'content': content
            }
        except Exception as api_error:
            logger.error(f"DeepSeek API调用失败: {str(api_error)}")
            return {
                'status': 'error',
                'message': f'DeepSeek API调用失败: {str(api_error)}',
                'content': ''
            }
    
    except Exception as e:
        logger.error(f"AI服务错误: {str(e)}")
        return {
            'status': 'error',
            'message': f'AI服务错误: {str(e)}',
            'content': ''
        }

def get_ai_stream_response(messages, system_prompt=None, user_preferences=None):
    """
    获取AI流式响应
    
    参数:
        messages (list): 消息列表，每个消息是一个dict，包含'role'和'content'字段
        system_prompt (str, optional): 系统提示，默认为None
        user_preferences (UserPreference, optional): 用户偏好设置，用于获取API密钥等
    
    返回:
        生成器: 流式返回AI响应内容
    """
    if not messages:
        yield "错误: 消息不能为空"
        return
    
    # 默认系统提示
    if system_prompt is None:
        system_prompt = (
            "你是LS笔记应用中的AI助手。你的主要任务是帮助用户处理笔记相关的问题。"
            "请保持回答简洁、有用，并使用Markdown格式来提高可读性。"
        )
    
    # 使用用户设置的API参数或系统默认值
    ai_api_key = DEFAULT_AI_API_KEY
    ai_base_url = DEFAULT_AI_BASE_URL
    ai_model = DEFAULT_AI_MODEL
    
    if user_preferences:
        ai_api_key = user_preferences.ai_api_key or DEFAULT_AI_API_KEY
        ai_base_url = user_preferences.ai_base_url or DEFAULT_AI_BASE_URL
        ai_model = user_preferences.ai_model or DEFAULT_AI_MODEL
    
    # 添加系统提示
    complete_messages = [{"role": "system", "content": system_prompt}] + messages
    
    try:
        # 使用OpenAI客户端
        client = OpenAI(
            api_key=ai_api_key,
            base_url=ai_base_url
        )
        
        # 以流式方式获取回复
        stream = client.chat.completions.create(
            model=ai_model,
            messages=complete_messages,
            stream=True,
            temperature=0.7,
            max_tokens=1500
        )
        
        # 逐块返回内容
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    
    except Exception as e:
        logger.error(f"AI流式响应错误: {str(e)}")
        yield f"发生错误: {str(e)}"

def summarize_note(note_content, user_preferences=None):
    """
    获取笔记摘要
    
    参数:
        note_content (str): 笔记内容
        user_preferences (UserPreference, optional): 用户偏好设置
    
    返回:
        str: 笔记摘要
    """
    system_prompt = "你是一个笔记摘要助手。请提供简洁明了的摘要，突出要点。"
    messages = [
        {"role": "user", "content": f"请为以下笔记内容生成一个简洁的摘要：\n\n{note_content}"}
    ]
    
    result = get_ai_response(messages, system_prompt, user_preferences)
    return result.get('content', '')

def ask_about_note(note_content, question, user_preferences=None):
    """
    基于笔记内容回答问题
    
    参数:
        note_content (str): 笔记内容
        question (str): 问题
        user_preferences (UserPreference, optional): 用户偏好设置
    
    返回:
        str: 回答
    """
    system_prompt = "你是一个笔记助手。请根据提供的笔记内容回答用户的问题。如果笔记内容中没有相关信息，请明确告知。"
    messages = [
        {"role": "user", "content": f"基于以下笔记内容：\n\n{note_content}\n\n回答问题：{question}"}
    ]
    
    result = get_ai_response(messages, system_prompt, user_preferences)
    return result.get('content', '') 

def get_available_models(user_preferences=None):
    """
    获取可用的AI模型列表
    
    参数:
        user_preferences (UserPreference, optional): 用户偏好设置
    
    返回:
        dict: 包含模型列表的字典
    """
    # 使用用户设置的API参数或系统默认值
    ai_api_key = DEFAULT_AI_API_KEY
    ai_base_url = DEFAULT_AI_BASE_URL
    
    if user_preferences:
        if user_preferences.ai_api_key:
            ai_api_key = user_preferences.ai_api_key
        if user_preferences.ai_base_url:
            ai_base_url = user_preferences.ai_base_url
    
    # 如果没有API密钥，返回错误
    if not ai_api_key:
        return {
            'status': 'error',
            'message': '未设置AI API密钥，请在设置中配置',
            'models': []
        }
    
    try:
        # 使用OpenAI客户端进行API调用
        client = OpenAI(api_key=ai_api_key, base_url=ai_base_url)
        
            # 获取模型列表
        response = client.models.list()
            
        # 提取模型信息
        models = []
        for model in response.data:
            models.append({
                'id': model.id,
                'owned_by': model.owned_by,
                'created': model.created
            })
            
            return {
                'status': 'success',
                'message': '获取模型列表成功',
                'models': models
            }
    except Exception as e:
        logger.error(f"获取模型列表失败: {str(e)}")
        return {
            'status': 'error',
            'message': f'获取模型列表失败: {str(e)}',
            'models': []
        }

def test_api_connection(user_preferences=None):
    """
    测试AI API连接
    
    参数:
        user_preferences (UserPreference, optional): 用户偏好设置
    
    返回:
        dict: 测试结果
    """
    # 使用用户设置的API参数或系统默认值
    ai_api_key = DEFAULT_AI_API_KEY
    ai_base_url = DEFAULT_AI_BASE_URL
    ai_model = DEFAULT_AI_MODEL
    
    if user_preferences:
        if user_preferences.ai_api_key:
            ai_api_key = user_preferences.ai_api_key
        if user_preferences.ai_base_url:
            ai_base_url = user_preferences.ai_base_url
        if user_preferences.ai_model:
            ai_model = user_preferences.ai_model
    
    # 如果没有API密钥，返回错误
    if not ai_api_key:
            return {
            'status': 'error',
            'message': '未设置AI API密钥，请在设置中配置'
        }
    
    try:
        # 使用OpenAI客户端进行API调用
        client = OpenAI(api_key=ai_api_key, base_url=ai_base_url)
        
        # 发送一个简单的请求来测试连接
        response = client.chat.completions.create(
            model=ai_model,
            messages=[
                {"role": "system", "content": "你是一个测试助手。"},
                {"role": "user", "content": "测试连接，请回复\"连接成功\"。"}
            ],
            max_tokens=10  # 限制token数以减少API使用量
        )
        
        # 如果成功获得响应，表示连接成功
        return {
            'status': 'success',
            'message': '连接成功'
        }
    except Exception as e:
        logger.error(f"测试API连接失败: {str(e)}")
        return {
            'status': 'error',
            'message': f'连接失败: {str(e)}'
        } 
 
 