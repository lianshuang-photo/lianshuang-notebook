from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView, CurrentUserView,
    ThirdPartyConfigView, HealthCheckView, TokenValidationView,
    UserListView, UserDetailView, UserStatusUpdateView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('third-party-config/', ThirdPartyConfigView.as_view(), name='third_party_config'),
    path('token-validation/', TokenValidationView.as_view(), name='token_validation'),
    path('health/', HealthCheckView.as_view(), name='health_check'),
    
    # 用户管理API
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('users/<int:pk>/status/', UserStatusUpdateView.as_view(), name='user_status_update'),
] 
 
 