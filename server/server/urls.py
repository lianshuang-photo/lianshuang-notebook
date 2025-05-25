from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger API文档配置
schema_view = get_schema_view(
    openapi.Info(
        title="LS笔记 API",
        default_version='v1',
        description="LS笔记应用的API文档",
        terms_of_service="https://github.com/yourusername/lsnote",
        contact=openapi.Contact(email="contact@lsnote.example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # API文档
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    # 应用API
    path('api/auth/', include('oAuth.urls')),
    path('api/notes/', include('note.urls')),
]

# 添加媒体文件的URL
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 
 
 