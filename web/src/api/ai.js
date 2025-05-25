import api from './index'

/**
 * 获取AI对话列表
 * @returns {Promise} 返回AI对话列表
 */
export const getAIConversations = () => {
  return api.get('/notes/ai-conversations/')
}

/**
 * 获取单个AI对话详情
 * @param {string} id 对话ID
 * @returns {Promise} 返回对话详情
 */
export const getAIConversation = (id) => {
  return api.get(`/notes/ai-conversations/${id}/`)
}

/**
 * 创建新的AI对话
 * @param {Object} data 对话数据
 * @returns {Promise} 返回创建结果
 */
export const createAIConversation = (data) => {
  return api.post('/notes/ai-conversations/', data)
}

/**
 * 删除AI对话
 * @param {string} id 对话ID
 * @returns {Promise} 返回删除结果
 */
export const deleteAIConversation = (id) => {
  return api.delete(`/notes/ai-conversations/${id}/`)
}

/**
 * 删除对话中的单条消息
 * @param {string} conversationId 对话ID
 * @param {string} messageId 消息ID
 * @returns {Promise} 返回删除结果
 */
export const deleteAIMessage = (conversationId, messageId) => {
  return api.delete(`/notes/ai-conversations/${conversationId}/delete_message/`, {
    data: { message_id: messageId }
  })
}

/**
 * 清空对话中的所有消息
 * @param {string} conversationId 对话ID
 * @returns {Promise} 返回清空结果
 */
export const clearAIConversation = (conversationId) => {
  return api.delete(`/notes/ai-conversations/${conversationId}/clear_messages/`)
}

/**
 * 获取笔记摘要
 * @param {string} noteId 笔记ID
 * @returns {Promise} 返回摘要结果
 */
export const getNoteAISummary = (noteId) => {
  return api.post('/notes/ai/summarize/', { note_id: noteId })
}

/**
 * 向对话添加消息
 * @param {string} conversationId 对话ID
 * @param {string} messageType 消息类型 (user 或 ai)
 * @param {string} content 消息内容
 * @returns {Promise} 返回添加结果
 */
export const addMessageToConversation = (conversationId, messageType, content) => {
  return api.post(`/notes/ai-conversations/${conversationId}/add_message/`, {
    message_type: messageType,
    content
  })
}

/**
 * 基于笔记内容提问
 * @param {string} noteId 笔记ID
 * @param {string} question 问题
 * @param {string} conversationId 可选的对话ID，用于继续现有对话
 * @returns {Promise} 返回回答结果
 */
export const askAboutNote = (noteId, question, conversationId = null) => {
  const data = {
    note_id: noteId,
    question
  }
  
  if (conversationId) {
    data.conversation_id = conversationId
  }
  
  return api.post('/notes/ai/ask/', data)
}

/**
 * 与AI聊天
 * @param {string} message 消息内容
 * @param {string} conversationId 可选的对话ID，用于继续现有对话
 * @param {string} noteId 可选的笔记ID，用于关联到特定笔记
 * @returns {Promise} 返回聊天结果
 */
export const chatWithAI = (message, conversationId = null, noteId = null) => {
  const data = { message }
  
  if (conversationId) {
    data.conversation_id = conversationId
  }
  
  if (noteId) {
    data.note_id = noteId
  }
  
  return api.post('/notes/ai/chat/', data)
} 
 
 