import { defineStore } from 'pinia'
import { getUserPreference, updateUserPreference } from '@/api/userPreference'

export const useUserPreferenceStore = defineStore('userPreference', {
  state: () => ({
    id: null,
    theme: 'system', // system, light, dark
    enableAI: true,
    ai_api_key: '',
    ai_base_url: 'https://api.deepseek.com',
    ai_model: 'deepseek-chat',
    loading: false,
    error: null
  }),
  
  actions: {
    async getUserPreference() {
      this.loading = true
      this.error = null
      
      try {
        const response = await getUserPreference()
        const data = response.data.results?.[0] || response.data
        
        this.id = data.id
        this.theme = data.theme
        this.enableAI = data.enable_ai
        this.ai_api_key = data.ai_api_key || ''
        this.ai_base_url = data.ai_base_url || 'https://api.deepseek.com'
        this.ai_model = data.ai_model || 'deepseek-chat'
        
        this.applyTheme(this.theme)
        
        return data
      } catch (error) {
        this.error = error.response?.data || { message: '获取用户偏好设置失败' }
        console.error('获取用户偏好设置失败:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async updatePreference(preferences) {
      this.loading = true
      this.error = null
      
      try {
        // 无论API请求成功与否，先更新本地状态
        if (preferences.theme !== undefined) {
          this.theme = preferences.theme
          this.applyTheme(this.theme)
        }
        
        if (preferences.enableAI !== undefined) {
          this.enableAI = preferences.enableAI
        }
        
        if (preferences.ai_api_key !== undefined) {
          this.ai_api_key = preferences.ai_api_key
        }
        
        if (preferences.ai_base_url !== undefined) {
          this.ai_base_url = preferences.ai_base_url
        }
        
        if (preferences.ai_model !== undefined) {
          this.ai_model = preferences.ai_model
        }
        
        // 准备API请求数据
        const data = {
          theme: preferences.theme || this.theme,
          enable_ai: preferences.enableAI !== undefined ? preferences.enableAI : this.enableAI
        }
        
        // 只有在显式提供API密钥时才将其包含在请求中
        if (preferences.ai_api_key !== undefined) {
          data.ai_api_key = preferences.ai_api_key
        }
        
        if (preferences.ai_base_url) {
          data.ai_base_url = preferences.ai_base_url
        }
        
        if (preferences.ai_model) {
          data.ai_model = preferences.ai_model
        }
        
        // 发送API请求
        const response = await updateUserPreference(data)
        const updatedData = response.data
        
        // 如果服务器返回数据，再次更新本地状态
        if (updatedData) {
          this.id = updatedData.id || this.id
          this.theme = updatedData.theme || this.theme
          this.enableAI = updatedData.enable_ai !== undefined ? updatedData.enable_ai : this.enableAI
          // API密钥一般不会在响应中返回，所以不更新本地状态
          this.ai_base_url = updatedData.ai_base_url || this.ai_base_url
          this.ai_model = updatedData.ai_model || this.ai_model
        }
        
        return updatedData || data
      } catch (error) {
        console.error('更新用户偏好设置API错误:', error.response?.status, error.response?.data || error.message)
        this.error = error.response?.data || { message: '更新用户偏好设置失败' }
        throw error // 抛出异常，让调用者处理错误
      } finally {
        this.loading = false
      }
    },
    
    applyTheme(theme) {
      // 应用主题设置
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        // 系统主题
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.classList.toggle('dark', prefersDarkMode)
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          document.documentElement.classList.toggle('dark', e.matches)
        })
      }
    }
  }
}) 
 
