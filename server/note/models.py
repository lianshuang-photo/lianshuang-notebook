from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
import uuid

class NoteGroup(models.Model):
    """笔记分组模型"""
    name = models.CharField(_('组名'), max_length=100)
    description = models.TextField(_('描述'), blank=True, null=True)
    created_at = models.DateTimeField(_('创建时间'), auto_now_add=True)
    updated_at = models.DateTimeField(_('更新时间'), auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_groups', verbose_name=_('所有者'))
    users = models.ManyToManyField(User, through='NoteGroupPermission', related_name='accessible_groups', verbose_name=_('可访问用户'))
    
    class Meta:
        verbose_name = _('笔记分组')
        verbose_name_plural = _('笔记分组')
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.name

class NoteGroupPermission(models.Model):
    """笔记分组权限模型"""
    PERMISSION_CHOICES = (
        ('read', _('只读')),
        ('write', _('读写')),
        ('admin', _('管理员')),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_('用户'))
    group = models.ForeignKey(NoteGroup, on_delete=models.CASCADE, verbose_name=_('笔记分组'))
    permission = models.CharField(_('权限'), max_length=10, choices=PERMISSION_CHOICES, default='read')
    created_at = models.DateTimeField(_('创建时间'), auto_now_add=True)
    updated_at = models.DateTimeField(_('更新时间'), auto_now=True)
    
    class Meta:
        verbose_name = _('笔记分组权限')
        verbose_name_plural = _('笔记分组权限')
        unique_together = ('user', 'group')
    
    def __str__(self):
        return f"{self.user.username} - {self.group.name} - {self.permission}"

class Note(models.Model):
    """笔记模型"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_('标题'), max_length=200)
    content = models.TextField(_('内容'))
    created_at = models.DateTimeField(_('创建时间'), auto_now_add=True)
    updated_at = models.DateTimeField(_('更新时间'), auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_notes', verbose_name=_('所有者'))
    group = models.ForeignKey(NoteGroup, on_delete=models.CASCADE, related_name='notes', verbose_name=_('所属分组'))
    is_public = models.BooleanField(_('是否公开'), default=False)
    
    class Meta:
        verbose_name = _('笔记')
        verbose_name_plural = _('笔记')
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.title

class AIConversation(models.Model):
    """AI对话历史模型"""
    CONVERSATION_TYPE_CHOICES = (
        ('chat', _('聊天')),
        ('summary', _('摘要')),
        ('qa', _('问答')),
        ('analysis', _('分析')),
        ('other', _('其他')),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_conversations', verbose_name=_('用户'))
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='ai_conversations', verbose_name=_('相关笔记'), null=True, blank=True)
    title = models.CharField(_('标题'), max_length=100, default='新对话')
    conversation_type = models.CharField(_('对话类型'), max_length=20, choices=CONVERSATION_TYPE_CHOICES, default='chat')
    created_at = models.DateTimeField(_('创建时间'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('AI对话')
        verbose_name_plural = _('AI对话')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_conversation_type_display()}) - {self.user.username}"

class AIMessage(models.Model):
    """AI对话消息模型"""
    MESSAGE_TYPE_CHOICES = (
        ('user', _('用户')),
        ('ai', _('AI')),
    )
    
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name='messages', verbose_name=_('所属对话'))
    message_type = models.CharField(_('消息类型'), max_length=10, choices=MESSAGE_TYPE_CHOICES)
    content = models.TextField(_('内容'))
    timestamp = models.DateTimeField(_('时间戳'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('AI消息')
        verbose_name_plural = _('AI消息')
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.message_type}: {self.content[:50]}"

class UserPreference(models.Model):
    """用户偏好设置模型"""
    THEME_CHOICES = (
        ('light', _('浅色')),
        ('dark', _('深色')),
        ('system', _('跟随系统')),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preference', verbose_name=_('用户'))
    theme = models.CharField(_('主题'), max_length=10, choices=THEME_CHOICES, default='system')
    enable_ai = models.BooleanField(_('启用AI'), default=True)
    ai_api_key = models.CharField(_('AI API密钥'), max_length=255, blank=True, null=True)
    ai_base_url = models.CharField(_('AI API基础URL'), max_length=255, default="https://api.deepseek.com")
    ai_model = models.CharField(_('AI模型名称'), max_length=100, default="deepseek-chat")
    created_at = models.DateTimeField(_('创建时间'), auto_now_add=True)
    updated_at = models.DateTimeField(_('更新时间'), auto_now=True)
    
    class Meta:
        verbose_name = _('用户偏好')
        verbose_name_plural = _('用户偏好')
    
    def __str__(self):
        return f"{self.user.username}的偏好设置"

class GroupHistory(models.Model):
    """分组历史记录模型"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_history', verbose_name=_('用户'))
    group = models.ForeignKey(NoteGroup, on_delete=models.CASCADE, related_name='history', verbose_name=_('分组'))
    last_accessed = models.DateTimeField(_('最后访问时间'), auto_now=True)
    
    class Meta:
        verbose_name = _('分组历史')
        verbose_name_plural = _('分组历史')
        unique_together = ('user', 'group')
        ordering = ['-last_accessed']
    
    def __str__(self):
        return f"{self.user.username} - {self.group.name}"

class GroupPermissionTemplate(models.Model):
    """分组权限模板模型"""
    name = models.CharField(_('模板名称'), max_length=100)
    description = models.TextField(_('描述'), blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='permission_templates', verbose_name=_('创建者'))
    permission = models.CharField(_('默认权限'), max_length=10, choices=NoteGroupPermission.PERMISSION_CHOICES, default='read')
    created_at = models.DateTimeField(_('创建时间'), auto_now_add=True)
    updated_at = models.DateTimeField(_('更新时间'), auto_now=True)
    
    class Meta:
        verbose_name = _('权限模板')
        verbose_name_plural = _('权限模板')
    
    def __str__(self):
        return self.name
 
 