/**
 * 身份验证中间件文件
 * 提供登录状态检查和用户角色管理功能
 */

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  const accessToken = localStorage.getItem('access_token')
  return accessToken !== null
}

/**
 * 获取用户角色
 * @returns {string|null} 用户角色
 */
export const getUserRole = () => {
  return localStorage.getItem('user_role')
}

/**
 * 检查用户是否为管理员
 * @returns {boolean} 是否为管理员
 */
export const isAdmin = () => {
  const role = getUserRole()
  return role === 'admin' || role === 'superuser'
}

/**
 * 保存用户登录状态
 * @param {object} data 包含令牌和用户信息的对象
 */
export const saveAuthData = (data) => {
  if (data.access) {
    localStorage.setItem('access_token', data.access)
  }
  
  if (data.refresh) {
    localStorage.setItem('refresh_token', data.refresh)
  }
  
  if (data.user) {
    if (data.user.is_superuser) {
      localStorage.setItem('user_role', 'superuser')
    } else if (data.user.is_staff) {
      localStorage.setItem('user_role', 'admin')
    } else {
      localStorage.setItem('user_role', 'user')
    }
  }
}

/**
 * 清除用户登录状态
 */
export const clearAuthData = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_role')
}

/**
 * 检查并刷新身份验证数据
 * @param {object} store pinia 认证存储器
 */
export const refreshAuthState = async (store) => {
  if (!isLoggedIn()) return false
  
  try {
    await store.restoreSession()
    return true
  } catch (error) {
    console.error('刷新认证状态失败:', error)
    clearAuthData()
    return false
  }
} 