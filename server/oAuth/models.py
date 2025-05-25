from django.db import models
from django.utils.translation import gettext_lazy as _

class ThirdPartyConfig(models.Model):
    """第三方登录配置模型"""
    PROVIDER_CHOICES = (
        ('github', 'GitHub'),
        ('google', 'Google'),
        ('wechat', 'WeChat'),
    )
    
    provider = models.CharField(_('提供商'), max_length=20, choices=PROVIDER_CHOICES, unique=True)
    client_id = models.CharField(_('Client ID'), max_length=100)
    client_secret = models.CharField(_('Client Secret'), max_length=100)
    is_enabled = models.BooleanField(_('是否启用'), default=True)
    created_at = models.DateTimeField(_('创建时间'), auto_now_add=True)
    updated_at = models.DateTimeField(_('更新时间'), auto_now=True)
    
    class Meta:
        verbose_name = _('第三方登录配置')
        verbose_name_plural = _('第三方登录配置')
    
    def __str__(self):
        return f"{self.get_provider_display()} {'(已启用)' if self.is_enabled else '(已禁用)'}" 
 
 