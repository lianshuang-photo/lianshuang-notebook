from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NoteGroupViewSet, NoteViewSet, AIConversationViewSet, UserPreferenceViewSet,
    GroupHistoryViewSet, GroupPermissionTemplateViewSet,
    ai_summarize_note, ai_ask_about_note, ai_chat, ai_available_models, ai_chat_stream,
    test_ai_connection, record_group_history
)

router = DefaultRouter()
router.register(r'groups', NoteGroupViewSet, basename='note-group')
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'ai-conversations', AIConversationViewSet, basename='ai-conversation')
router.register(r'preferences', UserPreferenceViewSet, basename='user-preference')
router.register(r'group-history', GroupHistoryViewSet, basename='group-history')
router.register(r'permission-templates', GroupPermissionTemplateViewSet, basename='permission-template')

urlpatterns = [
    path('', include(router.urls)),
    # 添加获取和更新当前用户偏好设置的直接路径
    path('preferences/current/', UserPreferenceViewSet.as_view({'get': 'retrieve', 'patch': 'update', 'put': 'update'})),
    # 添加访问最近分组历史的快捷路径
    path('group-history/recent/', GroupHistoryViewSet.as_view({'get': 'recent'}), name='recent-groups'),
    # 修改路径支持create方法和record_access动作
    path('group-history/record/', GroupHistoryViewSet.as_view({
        'post': 'record_access',
        'put': 'record_access',
        'get': 'record_access'
    }), name='record-group-access'),
    # 保留兼容性路径
    path('group-history/record_access/', GroupHistoryViewSet.as_view({'post': 'record_access'}), name='record-group-access-alias'),
    # 添加直接API函数路径 
    path('group-history/add-record/', record_group_history, name='add-group-history'),
    # AI相关的URL
    path('ai/summarize/', ai_summarize_note, name='ai-summarize'),
    path('ai/ask/', ai_ask_about_note, name='ai-ask'),
    path('ai/chat/', ai_chat, name='ai-chat'),
    path('ai/chat/stream/', ai_chat_stream, name='ai-chat-stream'),
    path('ai/models/', ai_available_models, name='ai-models'),
    path('ai/test-connection/', test_ai_connection, name='test-ai-connection'),
] 
 
 