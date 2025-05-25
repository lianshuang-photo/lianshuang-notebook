from rest_framework import serializers
from django.contrib.auth.models import User
from .models import NoteGroup, NoteGroupPermission, Note, AIConversation, AIMessage, UserPreference, GroupHistory, GroupPermissionTemplate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class NoteGroupPermissionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, source='user')
    
    class Meta:
        model = NoteGroupPermission
        fields = ['id', 'user', 'user_id', 'permission', 'created_at', 'updated_at']

class NoteGroupSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    permissions = NoteGroupPermissionSerializer(source='notegrouppermission_set', many=True, read_only=True)
    note_count = serializers.SerializerMethodField()
    users = serializers.SerializerMethodField()
    
    class Meta:
        model = NoteGroup
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'owner', 'permissions', 'note_count', 'users']
    
    def get_note_count(self, obj):
        return obj.notes.count()
    
    def get_users(self, obj):
        """获取分组的所有用户及其权限信息"""
        permissions = obj.notegrouppermission_set.all().select_related('user')
        result = []
        for perm in permissions:
            result.append({
                'user_id': perm.user.id,
                'user': UserSerializer(perm.user).data,
                'permission': perm.permission
            })
        return result

class NoteSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    group = NoteGroupSerializer(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(queryset=NoteGroup.objects.all(), write_only=True, source='group')
    
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'owner', 'group', 'group_id', 'is_public']
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']

class AIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIMessage
        fields = ['id', 'conversation', 'message_type', 'content', 'timestamp']
        read_only_fields = ['id', 'timestamp']

class AIConversationSerializer(serializers.ModelSerializer):
    messages = AIMessageSerializer(many=True, read_only=True)
    note = NoteSerializer(read_only=True)
    note_id = serializers.PrimaryKeyRelatedField(queryset=Note.objects.all(), write_only=True, source='note', required=False, allow_null=True)
    conversation_type_display = serializers.CharField(source='get_conversation_type_display', read_only=True)
    
    class Meta:
        model = AIConversation
        fields = ['id', 'user', 'note', 'note_id', 'title', 'conversation_type', 'conversation_type_display', 'created_at', 'messages']
        read_only_fields = ['id', 'user', 'created_at']

class UserPreferenceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserPreference
        fields = ['id', 'user', 'theme', 'enable_ai', 'ai_api_key', 'ai_base_url', 'ai_model', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def validate_ai_api_key(self, value):
        """对API密钥进行验证"""
        # 允许空值
        if value is None or value == "":
            return None
        
        # 如果提供了密钥，进行简单的格式验证（例如长度检查）
        if len(value) < 10:
            raise serializers.ValidationError("API密钥格式不正确或长度不足")
            
        return value
    
    def to_representation(self, instance):
        """自定义序列化表示"""
        ret = super().to_representation(instance)
        
        # 如果有API密钥，用占位符替换实际值
        if instance.ai_api_key:
            ret['ai_api_key'] = '******'  # 使用固定长度的占位符
        else:
            ret['ai_api_key'] = ''
            
        return ret

class GroupHistorySerializer(serializers.ModelSerializer):
    group = NoteGroupSerializer(read_only=True)
    
    class Meta:
        model = GroupHistory
        fields = ['id', 'user', 'group', 'last_accessed']
        read_only_fields = ['id', 'user', 'last_accessed']

class GroupPermissionTemplateSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    
    class Meta:
        model = GroupPermissionTemplate
        fields = ['id', 'name', 'description', 'creator', 'permission', 'created_at', 'updated_at']
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at'] 
 
 