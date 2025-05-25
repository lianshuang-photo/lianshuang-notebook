import api from './index'

/**
 * 获取用户偏好设置
 * @returns {Promise} 返回用户偏好设置
 */
export const getUserPreference = () => {
  return api.get('/notes/preferences/')
}

/**
 * 更新用户偏好设置
 * @param {Object} preferences 偏好设置数据
 * @returns {Promise} 返回更新结果
 */
export const updateUserPreference = (preferences) => {
  // 使用更合适的HTTP方法
  return api.patch('/notes/preferences/current/', preferences)
}

/**
 * 获取可用的AI模型列表
 * @returns {Promise} 返回AI模型列表
 */
export const getAvailableModels = () => {
  return api.get('/notes/ai/models/')
} 
 
