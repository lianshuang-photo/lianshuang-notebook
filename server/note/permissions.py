from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    自定义权限：只允许对象的所有者编辑它
    """
    
    def has_object_permission(self, request, view, obj):
        # 读取请求允许任何人访问
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # 写入权限只允许所有者或管理员
        return obj.owner == request.user or request.user.is_staff

class HasGroupPermission(permissions.BasePermission):
    """
    自定义权限：检查用户是否对笔记所属分组有适当的权限
    """
    
    def has_object_permission(self, request, view, obj):
        # 所有者和管理员有所有权限
        if obj.owner == request.user or request.user.is_staff:
            return True
        
        # 检查用户在笔记所属分组中的权限
        # 读请求需要至少有read权限
        if request.method in permissions.SAFE_METHODS:
            return obj.group.notegrouppermission_set.filter(user=request.user).exists()
        
        # 写请求需要至少有write或admin权限
        return obj.group.notegrouppermission_set.filter(
            user=request.user, permission__in=['write', 'admin']
        ).exists() 
 
 