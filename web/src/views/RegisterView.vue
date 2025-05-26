<template>
  <div class="min-h-screen flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-apple-gray-100 dark:bg-gray-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-14 w-auto" src="@/assets/logo.svg" alt="LS笔记" />
      <h2 class="mt-6 text-center text-3xl font-bold text-apple-gray-text-primary dark:text-white tracking-tight">
        注册LS笔记账户
      </h2>
      <p class="mt-2 text-center text-sm text-apple-gray-text-secondary dark:text-gray-400">
        开始记录和分享你的想法
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-6 shadow-apple-md sm:rounded-2xl sm:px-10 border border-apple-gray-border-secondary dark:border-gray-700">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label for="username" class="form-label">
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
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.username }"
                placeholder="创建一个用户名"
              />
              <p v-if="errors.username" class="mt-1.5 text-sm text-red-600 dark:text-red-400">{{ errors.username }}</p>
            </div>
          </div>

          <div>
            <label for="email" class="form-label">
              电子邮箱
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                name="email" 
                type="email" 
                v-model="email"
                class="input w-full"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
                placeholder="example@mail.com"
              />
              <p v-if="errors.email" class="mt-1.5 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="form-label">
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
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password }"
                placeholder="设置密码"
              />
              <p v-if="errors.password" class="mt-1.5 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
            </div>
          </div>

          <div>
            <label for="password2" class="form-label">
              确认密码
            </label>
            <div class="mt-1">
              <input 
                id="password2" 
                name="password2" 
                type="password" 
                required 
                v-model="password2"
                class="input w-full"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password2 }"
                placeholder="再次输入密码"
              />
              <p v-if="errors.password2" class="mt-1.5 text-sm text-red-600 dark:text-red-400">{{ errors.password2 }}</p>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="btn-primary w-full flex justify-center py-2.5"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                注册中...
              </span>
              <span v-else>注册</span>
            </button>
          </div>
        </form>

        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-apple-gray-border-secondary dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-3 bg-white dark:bg-gray-800 text-apple-gray-text-secondary dark:text-gray-400">
                已有账户?
              </span>
            </div>
          </div>

          <div class="mt-6">
            <router-link to="/login" class="btn-secondary w-full inline-flex justify-center">
              登录现有账户
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 错误消息 -->
    <div v-if="globalError" class="mt-4 sm:mx-auto sm:w-full sm:max-w-md animate-fadeIn">
      <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl border border-red-200 dark:border-red-800">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
              注册失败
            </h3>
            <div class="mt-1.5 text-sm text-red-700 dark:text-red-400">
              <p>{{ globalError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 成功消息 -->
    <div v-if="success" class="mt-4 sm:mx-auto sm:w-full sm:max-w-md animate-fadeIn">
      <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-300">
              注册成功
            </h3>
            <div class="mt-1.5 text-sm text-green-700 dark:text-green-400">
              <p>{{ success }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const errors = ref({})
const globalError = ref('')
const success = ref('')

const handleRegister = async () => {
  // 重置错误和成功消息
  errors.value = {}
  globalError.value = ''
  success.value = ''
  
  // 验证表单
  if (!username.value) {
    errors.value.username = '请输入用户名'
    return
  }
  
  if (!password.value) {
    errors.value.password = '请输入密码'
    return
  }
  
  if (password.value !== password2.value) {
    errors.value.password2 = '两次输入的密码不一致'
    return
  }
  
  loading.value = true
  
  try {
    // 调用注册
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value,
      password2: password2.value
    })
    
    // 注册成功
    success.value = '注册成功！即将跳转到登录页面...'
    
    // 3秒后跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    console.error('注册失败:', error)
    
    if (error.response?.data) {
      const data = error.response.data
      
      // 处理字段错误
      if (data.username) {
        errors.value.username = Array.isArray(data.username) ? data.username[0] : data.username
      }
      
      if (data.email) {
        errors.value.email = Array.isArray(data.email) ? data.email[0] : data.email
      }
      
      if (data.password) {
        errors.value.password = Array.isArray(data.password) ? data.password[0] : data.password
      }
      
      if (data.password2) {
        errors.value.password2 = Array.isArray(data.password2) ? data.password2[0] : data.password2
      }
      
      // 处理非字段错误
      if (data.detail || data.non_field_errors) {
        globalError.value = data.detail || (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors)
      } else if (!Object.keys(errors.value).length) {
        globalError.value = '注册失败，请稍后重试'
      }
    } else {
      globalError.value = '注册失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
</script> 
 
 