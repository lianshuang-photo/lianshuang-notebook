"""
认证相关的辅助函数
"""
import jwt
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.db import connection

def check_token(token):
    """
    检查令牌有效性
    
    返回:
        is_valid (bool): 令牌是否有效
        user_id (int): 用户ID，如果令牌无效则为None
    """
    try:
        # 使用SimpleJWT解析token
        token_obj = AccessToken(token)
        payload = token_obj.payload
        return True, payload.get('user_id')
    except TokenError:
        return False, None
    except Exception:
        return False, None

def health_check():
    """
    健康检查
    
    返回:
        dict: 状态信息
    """
    status = "ok"
    message = "Service is healthy"
    
    # 检查数据库连接
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "ok"
    except Exception as e:
        status = "error"
        db_status = str(e)
        message = "Database connection error"
    
    return {
        "status": status,
        "message": message,
        "details": {
            "database": db_status
        }
    } 
 
 