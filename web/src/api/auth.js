import api from './index'

/**
 * 用户登录
 * @param {Object} credentials 登录凭证
 * @returns {Promise} 登录结果
 */
export const login = (credentials) => {
  console.log('尝试登录用户:', credentials.username)
  return api.post('/auth/login/', credentials)
    .catch(error => {
      console.error('登录失败:', error.response?.status, error.response?.data)
      throw error
    })
}

/**
 * 用户注册
 * @param {Object} userData 用户数据
 * @returns {Promise} 注册结果
 */
export const register = (userData) => {
  return api.post('/auth/register/', userData)
}

/**
 * 用户登出
 * @returns {Promise} 登出结果
 */
export const logout = () => {
  return api.post('/auth/logout/')
}

/**
 * 刷新令牌
 * @param {string} refreshToken 刷新令牌
 * @returns {Promise} 返回刷新结果
 */
export const refreshToken = (refreshToken) => {
  return api.post('/auth/refresh/', { refresh: refreshToken })
}

/**
 * 获取当前用户信息
 * @returns {Promise} 用户信息
 */
export const getCurrentUser = () => {
  return api.get('/auth/user/')
}

/**
 * 获取所有用户列表（仅管理员）
 * @returns {Promise} 用户列表
 */
export const getUsers = () => {
  console.log('请求获取用户列表')
  return api.get('/auth/users/')
    .then(response => {
      console.log('获取用户列表成功:', response.data)
      return response
    })
    .catch(error => {
      console.error('获取用户列表错误:', error.response?.status, error.response?.data)
      throw error
    })
}

/**
 * 获取单个用户详情（仅管理员）
 * @param {string} id 用户ID
 * @returns {Promise} 用户详情
 */
export const getUser = (id) => {
  return api.get(`/auth/users/${id}/`)
}

/**
 * 创建新用户（仅管理员）
 * @param {Object} userData 用户数据
 * @returns {Promise} 创建结果
 */
export const createUser = (userData) => {
  console.log('创建用户请求数据:', userData)
  return api.post('/auth/users/', userData)
    .catch(error => {
      console.error('创建用户错误详情:', error.response?.status, error.response?.data)
      throw error
    })
}

/**
 * 更新用户（仅管理员）
 * @param {string} id 用户ID
 * @param {Object} userData 用户数据
 * @returns {Promise} 更新结果
 */
export const updateUser = (id, userData) => {
  return api.put(`/auth/users/${id}/`, userData)
}

/**
 * 更新用户状态（激活/停用）（仅管理员）
 * @param {string} id 用户ID
 * @param {boolean} isActive 是否激活
 * @returns {Promise} 更新结果
 */
export const updateUserStatus = (id, isActive) => {
  return api.patch(`/auth/users/${id}/status/`, { is_active: isActive })
}

/**
 * 获取第三方登录配置
 * @returns {Promise} 返回第三方登录配置
 */
export const getThirdPartyConfigs = () => {
  return api.get('/auth/third-party-config/')
}

/**
 * 更新第三方登录配置
 * @param {Object} config 配置数据
 * @returns {Promise} 返回更新结果
 */
export const updateThirdPartyConfig = (config) => {
  return api.post('/auth/third-party-config/', config)
}

/**
 * 验证令牌有效性
 * @param {string} token 令牌
 * @returns {Promise} 返回验证结果
 */
export const validateToken = (token) => {
  return api.post('/auth/token-validation/', { token })
} 
 