import { defineStore } from 'pinia'
import { 
  getAIConversations, getAIConversation, createAIConversation,
  getNoteAISummary, askAboutNote, chatWithAI,
  deleteAIConversation, deleteAIMessage, clearAIConversation
} from '@/api/ai'

export const useAIStore = defineStore('ai', {
  state: () => ({
    conversations: [],
    currentConversation: null,
    lastSummary: null,
    lastAnswer: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getConversationById: (state) => (id) => {
      return state.conversations.find(conversation => conversation.id === id) || null
    }
  },
  
  actions: {
    async fetchConversations() {
      this.loading = true
      this.error = null
      
      try {
        const response = await getAIConversations()
        this.conversations = response.data.results || response.data
        return this.conversations
      } catch (error) {
        this.error = error.response?.data || { message: '获取对话列表失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchConversation(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await getAIConversation(id)
        this.currentConversation = response.data
        return this.currentConversation
      } catch (error) {
        this.error = error.response?.data || { message: '获取对话详情失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async createConversation(data) {
      this.loading = true
      this.error = null
      
      try {
        const response = await createAIConversation(data)
        
        // 更新状态
        this.conversations.unshift(response.data)
        this.currentConversation = response.data
        
        return response.data
      } catch (error) {
        this.error = error.response?.data || { message: '创建对话失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteConversation(id) {
      this.loading = true
      this.error = null
      
      try {
        await deleteAIConversation(id)
        
        // 从列表中移除
        this.conversations = this.conversations.filter(c => c.id !== id)
        
        // 如果当前选中的对话被删除，则清空当前对话
        if (this.currentConversation && this.currentConversation.id === id) {
          this.currentConversation = null
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data || { message: '删除对话失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteMessage(conversationId, messageId) {
      this.loading = true
      this.error = null
      
      try {
        await deleteAIMessage(conversationId, messageId)
        
        // 如果是当前对话，则更新当前对话
        if (this.currentConversation && this.currentConversation.id === conversationId) {
          await this.fetchConversation(conversationId)
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data || { message: '删除消息失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async clearConversation(conversationId) {
      this.loading = true
      this.error = null
      
      try {
        await clearAIConversation(conversationId)
        
        // 如果是当前对话，则更新当前对话
        if (this.currentConversation && this.currentConversation.id === conversationId) {
          await this.fetchConversation(conversationId)
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data || { message: '清空对话失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async getSummary(noteId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await getNoteAISummary(noteId)
        this.lastSummary = response.data.summary
        
        // 添加到当前对话，如果有的话
        if (response.data.conversation_id) {
          await this.fetchConversation(response.data.conversation_id)
        }
        
        return this.lastSummary
      } catch (error) {
        this.error = error.response?.data || { message: '获取笔记摘要失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async askQuestion(noteId, question, conversationId = null) {
      this.loading = true
      this.error = null
      
      try {
        const response = await askAboutNote(noteId, question, conversationId)
        this.lastAnswer = response.data.answer
        
        // 更新或设置当前对话
        await this.fetchConversation(response.data.conversation_id)
        
        return this.lastAnswer
      } catch (error) {
        this.error = error.response?.data || { message: '提问失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async chat(message, conversationId = null, noteId = null) {
      this.loading = true
      this.error = null
      
      try {
        const response = await chatWithAI(message, conversationId, noteId)
        
        // 更新或设置当前对话
        if (response.data.conversation_id) {
          await this.fetchConversation(response.data.conversation_id)
        }
        
        return response.data.message
      } catch (error) {
        this.error = error.response?.data || { message: '聊天失败' }
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 
 
 