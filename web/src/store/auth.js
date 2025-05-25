import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '@/api/auth'
import { saveAuthData, clearAuthData } from '@/middleware/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    user: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    isAdmin: (state) => state.user && state.user.is_staff,
    isSuperuser: (state) => state.user && state.user.is_superuser
  },
  
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      console.log('开始登录流程', { username: credentials.username })
      
      try {
        console.log('调用登录API')
        const response = await apiLogin(credentials)
        console.log('登录API响应成功', response.status)
        
        const { access, refresh, user } = response.data
        
        // 更新状态
        this.accessToken = access
        this.refreshToken = refresh
        this.user = user
        
        // 使用中间件保存身份验证数据
        saveAuthData({ access, refresh, user })
        
        console.log('登录成功，已保存身份验证数据', { 
          userId: user.id,
          username: user.username,
          isActive: user.is_active,
          isStaff: user.is_staff
        })
        
        return user
      } catch (error) {
        console.error('登录失败', error.response?.status, error.response?.data)
        
        // 处理特定的错误情况
        if (error.response?.status === 401) {
          this.error = { 
            message: error.response.data?.detail || '用户名或密码错误' 
          }
        } else {
        this.error = error.response?.data || { message: '登录失败，请稍后重试' }
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiRegister(userData)
        return response.data
      } catch (error) {
        this.error = error.response?.data || { message: '注册失败，请稍后重试' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      this.loading = true
      this.error = null
      
      try {
        if (this.refreshToken) {
          await apiLogout(this.refreshToken)
        }
      } catch (error) {
        console.error('登出时出错:', error)
      } finally {
        // 清除状态
        this.accessToken = null
        this.refreshToken = null
        this.user = null
        
        // 使用中间件清除认证数据
        clearAuthData()
        
        console.log('已登出，清除身份验证数据')
        
        this.loading = false
      }
    },
    
    async restoreSession() {
      if (!this.accessToken) return null
      
      this.loading = true
      this.error = null
      
      try {
        const response = await getCurrentUser()
        this.user = response.data
        return this.user
      } catch (error) {
        // 清除状态
        this.accessToken = null
        this.refreshToken = null
        this.user = null
        
        // 使用中间件清除认证数据
        clearAuthData()
        
        this.error = { message: '会话已过期，请重新登录' }
        console.error('恢复会话失败:', error)
        return null
      } finally {
        this.loading = false
      }
    }
  }
}) 
 



