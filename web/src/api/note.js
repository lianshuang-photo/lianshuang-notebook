import api from './index'

/**
 * 获取笔记列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回笔记列表
 */
export const getNotes = (params = {}) => {
  return api.get('/notes/notes/', { params })
}

/**
 * 搜索笔记
 * @param {string} query 搜索关键词
 * @returns {Promise} 返回搜索结果
 */
export const searchNotes = (query) => {
  console.log('搜索笔记，关键词:', query);
  // 使用原始API调用，请求将被拦截器处理
  return api.get('/notes/notes/search/', { params: { q: query } });
}

/**
 * 获取单个笔记详情
 * @param {string} id 笔记ID
 * @returns {Promise} 返回笔记详情
 */
export const getNote = (id) => {
  return api.get(`/notes/notes/${id}/`)
}

/**
 * 创建笔记
 * @param {Object} noteData 笔记数据
 * @returns {Promise} 返回创建结果
 */
export const createNote = (noteData) => {
  return api.post('/notes/notes/', noteData)
}

/**
 * 更新笔记
 * @param {string} id 笔记ID
 * @param {Object} noteData 笔记数据
 * @returns {Promise} 返回更新结果
 */
export const updateNote = (id, noteData) => {
  return api.put(`/notes/notes/${id}/`, noteData)
}

/**
 * 删除笔记
 * @param {string} id 笔记ID
 * @returns {Promise} 返回删除结果
 */
export const deleteNote = (id) => {
  return api.delete(`/notes/notes/${id}/`)
}

/**
 * 获取最近的笔记
 * @returns {Promise} 返回最近的笔记列表
 */
export const getRecentNotes = () => {
  return api.get('/notes/notes/recent/')
}

/**
 * 根据分组获取笔记
 * @param {string} groupId 分组ID
 * @returns {Promise} 返回笔记列表
 */
export const getNotesByGroup = (groupId) => {
  return api.get('/notes/notes/by_group/', { params: { group_id: groupId } })
}

/**
 * 获取笔记分组列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回笔记分组列表
 */
export const getNoteGroups = (params = {}) => {
  return api.get('/notes/groups/', { params })
}

/**
 * 获取单个笔记分组详情
 * @param {string} id 分组ID
 * @returns {Promise} 返回分组详情
 */
export const getNoteGroup = (id) => {
  return api.get(`/notes/groups/${id}/`)
}

/**
 * 创建笔记分组
 * @param {Object} groupData 分组数据
 * @returns {Promise} 返回创建结果
 */
export const createNoteGroup = (groupData) => {
  const data = {
    name: groupData.name,
    description: groupData.description || ''
  }
  
  return api.post('/notes/groups/', data)
    .catch(error => {
      console.error('创建笔记分组API错误:', error.response?.data || error.message)
      throw error
    })
}

/**
 * 更新笔记分组
 * @param {string} id 分组ID
 * @param {Object} groupData 分组数据
 * @returns {Promise} 返回更新结果
 */
export const updateNoteGroup = (id, groupData) => {
  const data = {
    name: groupData.name,
    description: groupData.description || ''
  }
  
  return api.put(`/notes/groups/${id}/`, data)
    .catch(error => {
      console.error('更新笔记分组API错误:', error.response?.data || error.message)
      throw error
    })
}

/**
 * 删除笔记分组
 * @param {string} id 分组ID
 * @returns {Promise} 返回删除结果
 */
export const deleteNoteGroup = (id) => {
  return api.delete(`/notes/groups/${id}/`)
}

/**
 * 向分组添加用户
 * @param {string} groupId 分组ID
 * @param {string} userId 用户ID
 * @param {string} permission 权限类型 (read, write, admin)
 * @returns {Promise} 返回添加结果
 */
export const addUserToGroup = (groupId, userId, permission = 'read') => {
  return api.post(`/notes/groups/${groupId}/add_user/`, {
    user_id: userId,
    permission
  })
}

/**
 * 从分组删除用户
 * @param {string} groupId 分组ID
 * @param {string} userId 用户ID
 * @returns {Promise} 返回删除结果
 */
export const removeUserFromGroup = (groupId, userId) => {
  return api.delete(`/notes/groups/${groupId}/remove_user/`, {
    data: { user_id: userId }
  })
}

/**
 * 获取最近访问的分组
 * @returns {Promise} 返回最近访问的分组列表
 */
export const getRecentGroups = () => {
  return api.get('/notes/group-history/recent/')
}

/**
 * 记录分组访问
 * @param {string} groupId 分组ID
 * @returns {Promise} 返回操作结果
 */
export const recordGroupAccess = (groupId) => {
  // 尝试原始路径
  return api.post('/notes/group-history/record/', { group_id: groupId })
    .catch(error => {
      if (error.response && error.response.status === 405) {
        // 如果遇到405错误，尝试备用路径
        console.log('尝试备用路径记录分组访问');
        return api.post('/notes/group-history/add-record/', { group_id: groupId });
      }
      // 如果不是405错误，继续抛出
      throw error;
    });
}

/**
 * 获取权限模板列表
 * @returns {Promise} 返回权限模板列表
 */
export const getPermissionTemplates = () => {
  return api.get('/notes/permission-templates/')
}

/**
 * 创建权限模板
 * @param {Object} templateData 模板数据
 * @returns {Promise} 返回创建结果
 */
export const createPermissionTemplate = (templateData) => {
  return api.post('/notes/permission-templates/', templateData)
}

/**
 * 更新权限模板
 * @param {string} id 模板ID
 * @param {Object} templateData 模板数据
 * @returns {Promise} 返回更新结果
 */
export const updatePermissionTemplate = (id, templateData) => {
  return api.put(`/notes/permission-templates/${id}/`, templateData)
}

/**
 * 删除权限模板
 * @param {string} id 模板ID
 * @returns {Promise} 返回删除结果
 */
export const deletePermissionTemplate = (id) => {
  return api.delete(`/notes/permission-templates/${id}/`)
}

/**
 * 应用权限模板
 * @param {string} templateId 模板ID
 * @param {string} groupId 分组ID
 * @param {Array} userIds 用户ID数组
 * @returns {Promise} 返回应用结果
 */
export const applyPermissionTemplate = (templateId, groupId, userIds) => {
  return api.post(`/notes/permission-templates/${templateId}/apply_template/`, {
    group_id: groupId,
    user_ids: userIds
  })
}

/**
 * 批量添加用户到分组
 * @param {string} groupId 分组ID
 * @param {Array} users 用户数组，每个元素包含user_id和permission
 * @returns {Promise} 返回添加结果
 */
export const addUsersToGroup = (groupId, users) => {
  const promises = users.map(user => {
    return addUserToGroup(groupId, user.user_id, user.permission)
  })
  
  return Promise.all(promises)
} 
 