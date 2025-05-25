from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import StreamingHttpResponse
from .models import NoteGroup, NoteGroupPermission, Note, AIConversation, AIMessage, UserPreference, User, GroupHistory, GroupPermissionTemplate
from .serializers import (
    NoteGroupSerializer, NoteGroupPermissionSerializer, NoteSerializer,
    AIConversationSerializer, AIMessageSerializer, UserPreferenceSerializer,
    GroupHistorySerializer, GroupPermissionTemplateSerializer
)
from .permissions import IsOwnerOrReadOnly, HasGroupPermission
from .ai_service import summarize_note, ask_about_note, get_ai_response, get_available_models, get_ai_stream_response, test_api_connection
import logging
from rest_framework import serializers

logger = logging.getLogger(__name__)

class NoteGroupViewSet(viewsets.ModelViewSet):
    """笔记分组视图集"""
    serializer_class = NoteGroupSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'updated_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:  # 管理员可以看到所有分组
            return NoteGroup.objects.all()
        # 普通用户只能看到自己的或有权限的分组
        return NoteGroup.objects.filter(
            Q(owner=user) | Q(users=user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_user(self, request, pk=None):
        note_group = self.get_object()
        user_id = request.data.get('user_id')
        permission = request.data.get('permission', 'read')
        
        # 记录请求信息
        logger.debug(f"添加用户到分组 - 组ID:{pk}, 请求数据:{request.data}")
        
        if not user_id:
            logger.warning(f"添加用户到分组失败 - 组ID:{pk}, 原因:未提供用户ID")
            return Response({'error': '用户ID必须提供'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 只有所有者或管理权限才能添加用户
        if note_group.owner != request.user and not note_group.notegrouppermission_set.filter(user=request.user, permission='admin').exists():
            logger.warning(f"添加用户到分组失败 - 组ID:{pk}, 用户ID:{user_id}, 原因:权限不足(用户:{request.user.username})")
            return Response({'error': '只有所有者或管理员才能添加用户'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # 检查用户是否存在
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                logger.error(f"添加用户到分组失败 - 组ID:{pk}, 用户ID:{user_id}, 原因:用户不存在")
                return Response({'error': f'ID为{user_id}的用户不存在'}, status=status.HTTP_400_BAD_REQUEST)
            
            permission_obj, created = NoteGroupPermission.objects.update_or_create(
                user_id=user_id,
                group=note_group,
                defaults={'permission': permission}
            )
            serializer = NoteGroupPermissionSerializer(permission_obj)
            logger.info(f"成功{'添加' if created else '更新'}用户到分组 - 组:{note_group.name}, 用户:{user.username}, 权限:{permission}")
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"添加用户到分组失败 - 组ID:{pk}, 用户ID:{user_id}, 错误:{str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], permission_classes=[permissions.IsAuthenticated])
    def remove_user(self, request, pk=None):
        note_group = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'error': '用户ID必须提供'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 只有所有者或管理权限才能移除用户
        if note_group.owner != request.user and not note_group.notegrouppermission_set.filter(user=request.user, permission='admin').exists():
            return Response({'error': '只有所有者或管理员才能移除用户'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # 不能移除所有者
            if note_group.owner.id == int(user_id):
                return Response({'error': '不能移除分组所有者'}, status=status.HTTP_400_BAD_REQUEST)
            
            NoteGroupPermission.objects.filter(user_id=user_id, group=note_group).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class NoteViewSet(viewsets.ModelViewSet):
    """笔记视图集"""
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly, HasGroupPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['title', 'created_at', 'updated_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:  # 管理员可以看到所有笔记
            return Note.objects.all()
        
        # 过滤条件：用户可以看到自己的笔记和有访问权限的分组中的笔记
        accessible_groups = NoteGroup.objects.filter(
            Q(owner=user) | Q(notegrouppermission__user=user)
        ).distinct()
        
        return Note.objects.filter(
            Q(owner=user) | Q(group__in=accessible_groups)
        ).distinct()
    
    def perform_create(self, serializer):
        group = serializer.validated_data.get('group')
        # 检查用户是否有权限在此分组创建笔记
        if group.owner != self.request.user and not group.notegrouppermission_set.filter(
            user=self.request.user, permission__in=['write', 'admin']
        ).exists():
            raise permissions.PermissionDenied("您没有在此分组创建笔记的权限")
        
        serializer.save(owner=self.request.user)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """获取最近的笔记"""
        recent_notes = self.get_queryset().order_by('-updated_at')[:5]
        serializer = self.get_serializer(recent_notes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_group(self, request):
        """按分组获取笔记"""
        group_id = request.query_params.get('group_id')
        if not group_id:
            return Response({'error': '必须提供分组ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        group = get_object_or_404(NoteGroup, id=group_id)
        # 检查用户是否有权限查看此分组的笔记
        if group.owner != request.user and not group.notegrouppermission_set.filter(user=request.user).exists():
            return Response({'error': '您没有查看此分组笔记的权限'}, status=status.HTTP_403_FORBIDDEN)
        
        notes = self.get_queryset().filter(group=group)
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)

class AIConversationViewSet(viewsets.ModelViewSet):
    """AI对话视图集"""
    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AIConversation.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        """添加消息到对话"""
        conversation = self.get_object()
        if conversation.user != request.user:
            return Response({'error': '您没有权限添加消息到此对话'}, status=status.HTTP_403_FORBIDDEN)
        
        message_type = request.data.get('message_type')
        content = request.data.get('content')
        
        if not message_type or not content:
            return Response({'error': '消息类型和内容必须提供'}, status=status.HTTP_400_BAD_REQUEST)
        
        message = AIMessage.objects.create(
            conversation=conversation,
            message_type=message_type,
            content=content
        )
        
        serializer = AIMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'])
    def delete_message(self, request, pk=None):
        """删除对话中的消息"""
        conversation = self.get_object()
        if conversation.user != request.user:
            return Response({'error': '您没有权限删除此对话中的消息'}, status=status.HTTP_403_FORBIDDEN)
        
        message_id = request.data.get('message_id')
        if not message_id:
            return Response({'error': '消息ID必须提供'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            message = AIMessage.objects.get(id=message_id, conversation=conversation)
            message.delete()
            return Response({'success': '消息已删除'}, status=status.HTTP_200_OK)
        except AIMessage.DoesNotExist:
            return Response({'error': '消息不存在'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['delete'])
    def clear_messages(self, request, pk=None):
        """清空对话中的所有消息"""
        conversation = self.get_object()
        if conversation.user != request.user:
            return Response({'error': '您没有权限清空此对话'}, status=status.HTTP_403_FORBIDDEN)
        
        conversation.messages.all().delete()
        return Response({'success': '对话已清空'}, status=status.HTTP_200_OK)

class UserPreferenceViewSet(viewsets.ModelViewSet):
    """用户偏好设置视图集"""
    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserPreference.objects.filter(user=self.request.user)
    
    def get_object(self):
        # 获取或创建用户的偏好设置
        obj, created = UserPreference.objects.get_or_create(user=self.request.user)
        return obj
    
    def perform_create(self, serializer):
        # 确保在创建新偏好设置时关联当前用户
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        # 重写update方法，确保只更新自己的设置
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"detail": "无权限修改其他用户的设置"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # 处理API密钥加密
        data = request.data.copy()
        
        # 特殊处理API密钥的情况
        if 'ai_api_key' in data:
            if data['ai_api_key'] in [None, 'undefined', '********', '******']:
                # 用户没有修改密钥，保留原值
                data.pop('ai_api_key', None)
            elif data['ai_api_key'] == '':
                # 用户明确设置为空字符串，表示要删除密钥
                # 保留空字符串，在序列化器中会被转换为None
                pass
        
        # 使用修改后的数据进行更新
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        try:
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"detail": f"更新失败: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def perform_update(self, serializer):
        serializer.save()

class GroupHistoryViewSet(viewsets.ModelViewSet):
    """分组历史记录视图集"""
    serializer_class = GroupHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return GroupHistory.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """获取最近访问的分组"""
        recent_groups = GroupHistory.objects.filter(user=request.user).order_by('-last_accessed')[:5]
        serializer = self.get_serializer(recent_groups, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def record_access(self, request):
        """记录分组访问"""
        group_id = request.data.get('group_id')
        if not group_id:
            return Response({"detail": "必须提供group_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            group = NoteGroup.objects.get(id=group_id)
            # 检查用户是否有权限访问该分组
            if group.owner != request.user and not group.notegrouppermission_set.filter(user=request.user).exists():
                return Response({"detail": "无权访问此分组"}, status=status.HTTP_403_FORBIDDEN)
            
            # 记录访问
            history, created = GroupHistory.objects.get_or_create(
                user=request.user,
                group=group
            )
            if not created:
                # 更新最后访问时间
                history.save()  # 这会触发auto_now字段更新
            
            return Response({"status": "success"})
        except NoteGroup.DoesNotExist:
            return Response({"detail": "分组不存在"}, status=status.HTTP_404_NOT_FOUND)

class GroupPermissionTemplateViewSet(viewsets.ModelViewSet):
    """分组权限模板视图集"""
    serializer_class = GroupPermissionTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # 用户可以查看自己创建的模板
        return GroupPermissionTemplate.objects.filter(creator=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    @action(detail=True, methods=['post'])
    def apply_template(self, request, pk=None):
        """应用权限模板到指定分组"""
        group_id = request.data.get('group_id')
        user_ids = request.data.get('user_ids', [])
        
        if not group_id:
            return Response({"detail": "必须提供group_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            template = self.get_object()
            group = NoteGroup.objects.get(id=group_id)
            
            # 检查用户是否有权限修改该分组
            if group.owner != request.user and not group.notegrouppermission_set.filter(
                user=request.user, permission='admin').exists():
                return Response({"detail": "无权修改此分组的权限"}, status=status.HTTP_403_FORBIDDEN)
            
            # 应用模板权限到指定用户
            results = []
            for user_id in user_ids:
                try:
                    user = User.objects.get(id=user_id)
                    # 创建或更新权限
                    permission, created = NoteGroupPermission.objects.update_or_create(
                        user=user,
                        group=group,
                        defaults={'permission': template.permission}
                    )
                    results.append({
                        'user_id': user_id,
                        'status': 'created' if created else 'updated',
                        'permission': template.permission
                    })
                except User.DoesNotExist:
                    results.append({
                        'user_id': user_id,
                        'status': 'error',
                        'message': '用户不存在'
                    })
            
            return Response({
                'template': template.name,
                'group': group.name,
                'results': results
            })
        except NoteGroup.DoesNotExist:
            return Response({"detail": "分组不存在"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def ai_summarize_note(request):
    """
    使用AI生成笔记摘要
    """
    note_id = request.data.get('note_id')
    if not note_id:
        return Response({'error': '笔记ID必须提供'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        note = Note.objects.get(id=note_id)
        
        # 检查用户是否有权限访问笔记
        if note.owner != request.user and not note.group.notegrouppermission_set.filter(user=request.user).exists():
            return Response({'error': '您没有访问此笔记的权限'}, status=status.HTTP_403_FORBIDDEN)
        
        # 获取用户偏好设置
        user_preference, _ = UserPreference.objects.get_or_create(user=request.user)
        if not user_preference.enable_ai:
            return Response({'error': '您已禁用AI功能'}, status=status.HTTP_400_BAD_REQUEST)
        
        summary = summarize_note(note.content, user_preference)
        
        # 创建AI对话记录，使用笔记标题作为对话标题，类型设为摘要
        conversation = AIConversation.objects.create(
            user=request.user, 
            note=note,
            title=f"{note.title}的摘要",
            conversation_type='summary'
        )
        
        # 添加用户消息（请求摘要）
        AIMessage.objects.create(
            conversation=conversation,
            message_type='user',
            content=f"请为这篇笔记生成摘要"
        )
        
        # 添加AI响应（摘要内容）
        AIMessage.objects.create(
            conversation=conversation,
            message_type='ai',
            content=summary
        )
        
        return Response({
            'summary': summary,
            'conversation_id': conversation.id
        })
    
    except Note.DoesNotExist:
        return Response({'error': '笔记不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def ai_ask_about_note(request):
    """
    基于笔记内容提问
    """
    note_id = request.data.get('note_id')
    question = request.data.get('question')
    
    if not note_id or not question:
        return Response({'error': '笔记ID和问题必须提供'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        note = Note.objects.get(id=note_id)
        
        # 检查用户是否有权限访问笔记
        if note.owner != request.user and not note.group.notegrouppermission_set.filter(user=request.user).exists():
            return Response({'error': '您没有访问此笔记的权限'}, status=status.HTTP_403_FORBIDDEN)
        
        # 获取用户偏好设置
        user_preference, _ = UserPreference.objects.get_or_create(user=request.user)
        if not user_preference.enable_ai:
            return Response({'error': '您已禁用AI功能'}, status=status.HTTP_400_BAD_REQUEST)
        
        answer = ask_about_note(note.content, question, user_preference)
        
        # 创建AI对话记录，或添加到现有对话中
        conversation_id = request.data.get('conversation_id')
        if conversation_id:
            try:
                conversation = AIConversation.objects.get(id=conversation_id, user=request.user)
            except AIConversation.DoesNotExist:
                # 如果找不到，创建新的问答对话
                conversation = AIConversation.objects.create(
                    user=request.user, 
                    note=note,
                    title=f'关于"{note.title}"的问答',
                    conversation_type='qa'
                )
        else:
            # 创建新的问答对话
            conversation = AIConversation.objects.create(
                user=request.user, 
                note=note,
                title=f'关于"{note.title}"的问答',
                conversation_type='qa'
            )
        
        # 添加用户消息（问题）
        AIMessage.objects.create(
            conversation=conversation,
            message_type='user',
            content=question
        )
        
        # 添加AI响应（回答）
        AIMessage.objects.create(
            conversation=conversation,
            message_type='ai',
            content=answer
        )
        
        return Response({
            'answer': answer,
            'conversation_id': conversation.id
        })
    
    except Note.DoesNotExist:
        return Response({'error': '笔记不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def ai_chat(request):
    """
    与AI聊天
    """
    message = request.data.get('message')
    conversation_id = request.data.get('conversation_id')
    note_id = request.data.get('note_id')
    conversation_type = request.data.get('conversation_type', 'chat')  # 默认为聊天类型
    
    if not message:
        return Response({'error': '消息内容必须提供'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # 获取用户偏好设置
        user_preference, _ = UserPreference.objects.get_or_create(user=request.user)
        if not user_preference.enable_ai:
            return Response({'error': '您已禁用AI功能'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 获取或创建对话
        if conversation_id:
            try:
                conversation = AIConversation.objects.get(id=conversation_id, user=request.user)
            except AIConversation.DoesNotExist:
                conversation = AIConversation.objects.create(
                    user=request.user,
                    conversation_type=conversation_type
                )
        else:
            conversation = AIConversation.objects.create(
                user=request.user,
                conversation_type=conversation_type
            )
        
        # 如果提供了笔记ID，关联到对话
        if note_id:
            try:
                note = Note.objects.get(id=note_id)
                # 检查用户是否有权限访问笔记
                if note.owner != request.user and not note.group.notegrouppermission_set.filter(user=request.user).exists():
                    return Response({'error': '您没有访问此笔记的权限'}, status=status.HTTP_403_FORBIDDEN)
                conversation.note = note
                conversation.save()
            except Note.DoesNotExist:
                pass
        
        # 获取对话历史
        messages = []
        for msg in conversation.messages.all():
            messages.append({
                'role': 'user' if msg.message_type == 'user' else 'assistant',
                'content': msg.content
            })
        
        # 添加新消息
        messages.append({
            'role': 'user',
            'content': message
        })
        
        # 保存用户消息
        user_message = AIMessage.objects.create(
            conversation=conversation,
            message_type='user',
            content=message
        )
        
        # 获取AI响应
        ai_response = get_ai_response(messages, user_preferences=user_preference)
        
        if ai_response['status'] == 'success':
            # 保存AI回复
            ai_message = AIMessage.objects.create(
                conversation=conversation,
                message_type='ai',
                content=ai_response['content']
            )
            
            # 如果这是对话的第一组消息，尝试生成一个更具描述性的标题并推断对话类型
            if conversation.messages.count() <= 2 and conversation.title in ['新对话', None, '']:
                try:
                    # 使用对话内容推断类型和生成标题
                    title_type_messages = [
                        {'role': 'user', 'content': message},
                        {'role': 'assistant', 'content': ai_response['content']}
                    ]
                    title_type_prompt = (
                        "请分析以下对话，并完成两项任务:\n"
                        "1. 根据对话内容生成一个简短的标题(不超过15个字)\n"
                        "2. 判断对话类型，仅选择以下之一：'聊天'、'问答'、'分析'、'摘要'、'其他'\n"
                        "以JSON格式返回，格式为：{\"title\":\"标题内容\", \"type\":\"类型\"}"
                    )
                    title_type_response = get_ai_response(title_type_messages, system_prompt=title_type_prompt, user_preferences=user_preference)
                    
                    if title_type_response['status'] == 'success' and title_type_response['content']:
                        try:
                            # 尝试解析JSON
                            import json
                            result = json.loads(title_type_response['content'])
                            
                            # 提取标题
                            if 'title' in result:
                                title = result['title'].strip()
                                if len(title) > 30:  # 如果标题太长，截断它
                                    title = title[:30] + '...'
                                conversation.title = title
                                
                                # 提取类型并转换为系统中的类型
                                if 'type' in result:
                                    type_map = {
                                        '聊天': 'chat',
                                        '问答': 'qa',
                                        '分析': 'analysis',
                                        '摘要': 'summary',
                                        '其他': 'other'
                                    }
                                    type_text = result['type']
                                    if type_text in type_map:
                                        conversation.conversation_type = type_map[type_text]
                            
                            conversation.save()
                        except Exception as json_error:
                            logger.error(f"解析AI生成的标题和类型失败: {str(json_error)}")
                            # 使用备选标题方法
                            conversation.title = message[:20] + "..." if len(message) > 20 else message
                        conversation.save()
                except Exception as title_type_error:
                    # 如果生成标题和类型失败，使用默认值，记录错误但不影响主要功能
                    logger.error(f"生成对话标题和类型失败: {str(title_type_error)}")
                    # 使用消息内容前20个字符作为标题
                    conversation.title = message[:20] + "..." if len(message) > 20 else message
                    conversation.save()
            
            return Response({
                'message': ai_response['content'],
                'conversation_id': conversation.id,
                'title': conversation.title,
                'conversation_type': conversation.conversation_type,
                'conversation_type_display': conversation.get_conversation_type_display()
            })
        else:
            return Response({'error': ai_response['message']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def ai_available_models(request):
    """
    获取可用的AI模型列表
    """
    try:
        # 获取用户偏好设置
        user_preference, _ = UserPreference.objects.get_or_create(user=request.user)
        if not user_preference.enable_ai:
            return Response({'error': '您已禁用AI功能'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 如果未设置API密钥，返回空列表而不是错误
        if not user_preference.ai_api_key:
            return Response({
                'models': [], 
                'message': '未设置AI API密钥，请在设置中配置'
            })
        
        # 获取模型列表
        models_response = get_available_models(user_preference)
        
        if models_response['status'] == 'success':
            return Response({
                'models': models_response['models']
            })
        else:
            # 将错误代码改为400而不是500，更清晰地向前端传达这是用户配置问题
            return Response({
                'error': models_response['message'],
                'models': []
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"获取模型列表错误: {str(e)}")
        return Response({'error': str(e), 'models': []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def ai_chat_stream(request):
    """
    与AI聊天（流式响应）
    """
    message = request.data.get('message')
    conversation_id = request.data.get('conversation_id')
    note_id = request.data.get('note_id')
    
    if not message:
        return Response({'error': '消息内容必须提供'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # 获取用户偏好设置
        user_preference, _ = UserPreference.objects.get_or_create(user=request.user)
        if not user_preference.enable_ai:
            return Response({'error': '您已禁用AI功能'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 获取或创建对话
        if conversation_id:
            try:
                conversation = AIConversation.objects.get(id=conversation_id, user=request.user)
            except AIConversation.DoesNotExist:
                conversation = AIConversation.objects.create(user=request.user)
        else:
            conversation = AIConversation.objects.create(user=request.user)
        
        # 如果提供了笔记ID，关联到对话
        if note_id:
            try:
                note = Note.objects.get(id=note_id)
                # 检查用户是否有权限访问笔记
                if note.owner != request.user and not note.group.notegrouppermission_set.filter(user=request.user).exists():
                    return Response({'error': '您没有访问此笔记的权限'}, status=status.HTTP_403_FORBIDDEN)
                conversation.note = note
                conversation.save()
            except Note.DoesNotExist:
                pass
        
        # 获取对话历史
        messages = []
        for msg in conversation.messages.all():
            messages.append({
                'role': 'user' if msg.message_type == 'user' else 'assistant',
                'content': msg.content
            })
        
        # 添加新消息
        messages.append({
            'role': 'user',
            'content': message
        })
        
        # 保存用户消息
        user_message = AIMessage.objects.create(
            conversation=conversation,
            message_type='user',
            content=message
        )
        
        # 流式生成AI响应
        def stream_response():
            ai_response_content = ""
            
            # 使用生成器获取流式响应
            for chunk in get_ai_stream_response(messages, user_preferences=user_preference):
                ai_response_content += chunk
                yield chunk
            
            # 保存完整的AI响应
            AIMessage.objects.create(
                conversation=conversation,
                message_type='ai',
                content=ai_response_content
            )
            
            # 如果这是对话的第一组消息，尝试生成一个更具描述性的标题
            if conversation.messages.count() <= 3 and conversation.title in ['新对话', None, '']:
                # 使用简单方法生成标题，避免额外的API调用
                title = message[:20] + "..." if len(message) > 20 else message
                conversation.title = title
                conversation.save()
        
        # 返回流式响应
        response = StreamingHttpResponse(
            streaming_content=stream_response(),
            content_type='text/event-stream'
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'  # 禁用Nginx缓冲
        response['Access-Control-Allow-Origin'] = '*'  # 允许跨域访问
        response['Access-Control-Allow-Credentials'] = 'true'  # 允许带凭证的请求
        return response
    
    except Exception as e:
        logger.error(f"AI流式聊天错误: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def test_ai_connection(request):
    """
    测试AI API连接
    """
    try:
        # 获取用户偏好设置
        user_preference, _ = UserPreference.objects.get_or_create(user=request.user)
        
        # 如果AI功能被禁用，返回错误
        if not user_preference.enable_ai:
            return Response({'status': 'error', 'message': 'AI功能已被禁用'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 如果API密钥未设置，返回错误
        if not user_preference.ai_api_key:
            return Response({'status': 'error', 'message': 'API密钥未设置'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 测试API连接
        test_result = test_api_connection(user_preference)
        
        if test_result['status'] == 'success':
            return Response({'status': 'success', 'message': '连接成功'})
        else:
            # 使用400状态码而不是500，因为这是客户端配置问题
            return Response({'status': 'error', 'message': test_result['message']}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"测试API连接失败: {str(e)}")
        # 使用400状态码而不是500，保持一致的错误处理
        return Response({'status': 'error', 'message': f'测试连接失败: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def record_group_history(request):
    """
    记录分组访问历史 - 独立API函数
    这是一个后备方法，确保前端可以通过多种方式记录分组访问
    """
    group_id = request.data.get('group_id')
    if not group_id:
        return Response({"detail": "必须提供group_id"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        group = NoteGroup.objects.get(id=group_id)
        # 检查用户是否有权限访问该分组
        if group.owner != request.user and not group.notegrouppermission_set.filter(user=request.user).exists():
            return Response({"detail": "无权访问此分组"}, status=status.HTTP_403_FORBIDDEN)
        
        # 记录访问
        history, created = GroupHistory.objects.get_or_create(
            user=request.user,
            group=group
        )
        if not created:
            # 更新最后访问时间
            history.save()  # 这会触发auto_now字段更新
        
        return Response({"status": "success"})
    except NoteGroup.DoesNotExist:
        return Response({"detail": "分组不存在"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
 
 