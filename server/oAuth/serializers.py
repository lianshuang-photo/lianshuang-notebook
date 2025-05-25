from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import ThirdPartyConfig

class UserSerializer(serializers.ModelSerializer):
    """用户信息序列化器"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_superuser', 'date_joined', 'last_login')
        read_only_fields = ('id', 'is_staff', 'is_superuser', 'date_joined', 'last_login')

class UserAdminSerializer(serializers.ModelSerializer):
    """管理员用户序列化器 - 提供完整的用户信息"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'is_staff', 'is_active', 'is_superuser', 
                 'date_joined', 'last_login', 'groups')
        read_only_fields = ('id', 'date_joined', 'last_login')

class UserStatusUpdateSerializer(serializers.ModelSerializer):
    """用户状态更新序列化器"""
    class Meta:
        model = User
        fields = ('is_active',)

class UserCreateSerializer(serializers.ModelSerializer):
    """用户注册序列化器"""
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "两次密码不一致"})
        
        # 检查用户名是否已存在
        username = attrs.get('username')
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": f"用户名 '{username}' 已被使用"})
        
        # 检查邮箱是否已存在（如果提供）
        email = attrs.get('email')
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": f"邮箱 '{email}' 已被使用"})
            
        return attrs
    
    def create(self, validated_data):
        # 创建用户
        validated_data.pop('password2')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=True  # 确保新用户默认处于激活状态
        )
        
        user.set_password(validated_data['password'])
        user.save()
        
        return user

class ThirdPartyConfigSerializer(serializers.ModelSerializer):
    """第三方登录配置序列化器"""
    class Meta:
        model = ThirdPartyConfig
        fields = ('id', 'provider', 'client_id', 'client_secret', 'is_enabled')
    
    def validate_provider(self, value):
        """检查提供商名称"""
        valid_providers = ['github', 'google', 'wechat']
        if value not in valid_providers:
            raise serializers.ValidationError(
                f"不支持的提供商。有效选项: {', '.join(valid_providers)}"
            )
        return value 
 
 