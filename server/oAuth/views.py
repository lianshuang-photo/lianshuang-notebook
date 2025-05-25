from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import (
    UserSerializer, UserCreateSerializer, ThirdPartyConfigSerializer,
    UserAdminSerializer, UserStatusUpdateSerializer
)
from .models import ThirdPartyConfig
from .utils import check_token, health_check
import logging

class RegisterView(generics.CreateAPIView):
    """用户注册视图"""
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(TokenObtainPairView):
    """用户登录视图"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        username = request.data.get('username')
        password = request.data.get('password')
        logger.info(f"用户尝试登录: {username}")
        
        try:
            # 先尝试直接通过用户名查找用户
            try:
                user = User.objects.get(username=username)
                logger.info(f"找到用户 {username}")
                
                # 检查用户是否处于活跃状态
                if not user.is_active:
                    logger.warning(f"用户 {username} 尝试登录，但账号已被停用")
                    return Response(
                        {"detail": "此账号已被停用，请联系管理员"},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                # 手动验证密码
                authenticated_user = authenticate(request, username=username, password=password)
                if not authenticated_user:
                    logger.warning(f"用户 {username} 密码验证失败")
                    return Response(
                        {"detail": "密码不正确"},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                logger.info(f"用户 {username} 密码验证成功")
            except User.DoesNotExist:
                logger.warning(f"用户 {username} 不存在")
                return Response(
                    {"detail": "用户不存在"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
            # 正常流程，调用父类方法生成token
            response = super().post(request, *args, **kwargs)
            
            # 添加用户信息到响应
            user_serializer = UserSerializer(user)
            response.data['user'] = user_serializer.data
            
            logger.info(f"用户 {username} 登录成功")
            return response
            
        except Exception as e:
            logger.error(f"用户 {username} 登录失败: {str(e)}")
            return Response(
                {"detail": "登录失败，请检查用户名和密码"},
                status=status.HTTP_401_UNAUTHORIZED
            )

class LogoutView(APIView):
    """用户登出视图"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    """获取当前用户信息"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class ThirdPartyConfigView(APIView):
    """第三方登录配置视图"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # 一般用户只能看到配置列表，不包含密钥
        if not request.user.is_staff:
            configs = ThirdPartyConfig.objects.all().values('provider', 'is_enabled')
            return Response(configs)
        
        # 管理员可以看到完整配置
        configs = ThirdPartyConfig.objects.all()
        serializer = ThirdPartyConfigSerializer(configs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # 只有管理员可以添加或更新配置
        if not request.user.is_staff:
            return Response({"detail": "只有管理员可以修改配置"}, status=status.HTTP_403_FORBIDDEN)
        
        provider = request.data.get('provider')
        if not provider:
            return Response({"detail": "必须提供provider字段"}, status=status.HTTP_400_BAD_REQUEST)
        
        # 尝试查找现有配置
        try:
            config = ThirdPartyConfig.objects.get(provider=provider)
            serializer = ThirdPartyConfigSerializer(config, data=request.data, partial=True)
        except ThirdPartyConfig.DoesNotExist:
            serializer = ThirdPartyConfigSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HealthCheckView(APIView):
    """健康检查视图"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        result = health_check()
        if result['status'] == 'ok':
            return Response(result)
        return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TokenValidationView(APIView):
    """验证令牌有效性"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"detail": "必须提供token字段"}, status=status.HTTP_400_BAD_REQUEST)
        
        is_valid, user_id = check_token(token)
        if is_valid:
            return Response({"is_valid": True, "user_id": user_id})
        return Response({"is_valid": False}, status=status.HTTP_401_UNAUTHORIZED)

# 用户管理API
class IsAdminUser(permissions.BasePermission):
    """检查用户是否是管理员或超级用户"""
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)

class UserListView(generics.ListCreateAPIView):
    """用户列表视图"""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    def list(self, request, *args, **kwargs):
        # 添加日志记录
        logger = logging.getLogger(__name__)
        logger.info("获取用户列表")
        
        # 获取查询集
        queryset = self.filter_queryset(self.get_queryset())
        
        # 分页处理
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            logger.info(f"返回分页用户列表，用户数: {len(serializer.data)}")
            return self.get_paginated_response(serializer.data)
        
        # 未分页的情况
        serializer = self.get_serializer(queryset, many=True)
        logger.info(f"返回完整用户列表，用户数: {len(serializer.data)}")
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        
        # 记录请求数据
        logger.info(f"创建用户请求数据: {request.data}")
        
        serializer = UserCreateSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"用户创建验证错误: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # 使用Django内置的User.objects.create_user创建用户
            username = serializer.validated_data['username']
            email = serializer.validated_data.get('email', '')
            password = serializer.validated_data['password']
            first_name = serializer.validated_data.get('first_name', '')
            last_name = serializer.validated_data.get('last_name', '')
            
            logger.info(f"创建用户: {username}, email: {email}")
            
            # 使用Django的User.objects.create_user方法创建用户，这会正确处理密码
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # 确保用户是激活状态
            user.is_active = True
        
            # 设置管理员权限
            if request.data.get('is_staff'):
                user.is_staff = True
                logger.info(f"设置用户 {username} 为管理员")
                
            user.save()
        
            # 测试密码是否正确设置
            test_auth = authenticate(username=username, password=password)
            if test_auth:
                logger.info(f"用户 {username} 密码验证成功")
            else:
                logger.warning(f"用户 {username} 密码验证失败，请检查密码设置")
        
            return Response(
                UserAdminSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"创建用户时出错: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveUpdateAPIView):
    """用户详情视图"""
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminUser]
    
    def update(self, request, *args, **kwargs):
        # 禁止修改超级用户状态，除非当前用户也是超级用户
        user = self.get_object()
        if user.is_superuser and not request.user.is_superuser:
            return Response(
                {"detail": "无法修改超级用户的信息"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)

class UserStatusUpdateView(generics.UpdateAPIView):
    """用户状态更新视图"""
    queryset = User.objects.all()
    serializer_class = UserStatusUpdateSerializer
    permission_classes = [IsAdminUser]
    
    def update(self, request, *args, **kwargs):
        # 禁止停用超级用户
        user = self.get_object()
        if user.is_superuser and not request.user.is_superuser:
            return Response(
                {"detail": "无法更改超级用户的状态"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # 不允许停用自己
        if user.id == request.user.id and not request.data.get('is_active', True):
            return Response(
                {"detail": "无法停用你自己的账号"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().update(request, *args, **kwargs) 