<template>
  <div class="min-h-screen flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="@/assets/logo.svg" alt="LS笔记" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        登录到LS笔记
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        简洁高效的Markdown笔记应用
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              用户名
            </label>
            <div class="mt-1">
              <input 
                id="username" 
                name="username" 
                type="text" 
                required 
                v-model="username"
                class="input w-full"
                :class="{ 'border-red-500': errors.username }"
              />
              <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密码
            </label>
            <div class="mt-1">
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                v-model="password"
                class="input w-full"
                :class="{ 'border-red-500': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                v-model="rememberMe"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" 
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                记住我
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                忘记密码?
              </a>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="loading"
            >
              <span v-if="loading">登录中...</span>
              <span v-else>登录</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                或者
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <div>
              <router-link to="/register" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <span>注册新账户</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 错误消息 -->
    <div v-if="globalError" class="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-red-50 dark:bg-red-900 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              登录失败
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ globalError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { isLoggedIn } from '@/middleware/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errors = ref({})
const globalError = ref('')

// 验证登录状态，如果已登录则跳转
onMounted(() => {
  console.log('登录页面初始化，检查登录状态')
  if (isLoggedIn()) {
    console.log('用户已登录，跳转到首页')
    router.replace('/')
  } else {
    console.log('用户未登录，停留在登录页面')
  }
})

const handleLogin = async () => {
  // 重置错误
  errors.value = {}
  globalError.value = ''
  
  // 验证表单
  if (!username.value) {
    errors.value.username = '请输入用户名'
    return
  }
  
  if (!password.value) {
    errors.value.password = '请输入密码'
    return
  }
  
  loading.value = true
  
  try {
    console.log('正在尝试登录', { username: username.value })
    
    // 调用登录
    const user = await authStore.login({
      username: username.value,
      password: password.value
    })
    
    console.log('登录成功', { 
      userId: user.id, 
      username: user.username,
      isActive: user.is_active 
    })
    
    // 清除可能存在的旧状态
    localStorage.removeItem('user_token')
    
    // 验证用户状态
    if (!user.is_active) {
      console.error('用户账号已停用')
      globalError.value = '此账号已被停用，请联系管理员'
      return
    }
    
    // 确认已经登录
    if (isLoggedIn() && authStore.isAuthenticated) {
      console.log('访问令牌已保存，认证状态:', authStore.isAuthenticated)
      console.log('准备跳转到首页')
      
      // 使用replace而不是push，防止返回循环
      router.replace('/')
    } else {
      console.error('令牌存储失败')
      globalError.value = '登录处理失败，请刷新页面后再试'
    }
  } catch (error) {
    console.error('登录失败:', error.response?.status, error.response?.data)
    
    if (error.response?.data) {
      const data = error.response.data
      
      // 处理字段错误
      if (data.username) {
        errors.value.username = Array.isArray(data.username) ? data.username[0] : data.username
      }
      
      if (data.password) {
        errors.value.password = Array.isArray(data.password) ? data.password[0] : data.password
      }
      
      // 处理非字段错误
      if (data.detail || data.non_field_errors) {
        globalError.value = data.detail || (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors)
      } else if (!errors.value.username && !errors.value.password) {
        globalError.value = '登录失败，请检查用户名和密码'
      }
    } else if (authStore.error && authStore.error.message) {
      globalError.value = authStore.error.message
    } else {
      globalError.value = '登录失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
</script> 
 

