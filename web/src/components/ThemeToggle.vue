<template>
  <div class="theme-toggle">
    <div class="relative">
      <button 
        @click="toggleDropdown" 
        class="p-1.5 rounded-full bg-apple-gray-background-light dark:bg-gray-700 text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-background-medium dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-apple-blue"
        :aria-expanded="isOpen"
        aria-haspopup="true"
      >
        <!-- 浅色模式图标 -->
        <svg v-if="currentTheme === 'light'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        
        <!-- 深色模式图标 -->
        <svg v-else-if="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        
        <!-- 系统模式图标 -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
      
      <!-- 下拉菜单 -->
      <div 
        v-if="isOpen" 
        class="absolute right-0 mt-2 py-1 w-36 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-apple-lg border border-apple-gray-border-secondary dark:border-gray-700 z-10"
      >
        <button
          @click="setTheme('light')"
          class="w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-background-light dark:hover:bg-gray-700 flex items-center"
          :class="{ 'bg-apple-blue/10 dark:bg-blue-900/20': currentTheme === 'light' }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          浅色主题
        </button>
        
        <button
          @click="setTheme('dark')"
          class="w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-background-light dark:hover:bg-gray-700 flex items-center"
          :class="{ 'bg-apple-blue/10 dark:bg-blue-900/20': currentTheme === 'dark' }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          深色主题
        </button>
        
        <button
          @click="setTheme('system')"
          class="w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-background-light dark:hover:bg-gray-700 flex items-center"
          :class="{ 'bg-apple-blue/10 dark:bg-blue-900/20': currentTheme === 'system' }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          跟随系统
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useUserPreferenceStore } from '@/store/userPreference'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/composables/useToast'

const preferenceStore = useUserPreferenceStore()
const authStore = useAuthStore()
const { showToast } = useToast()

const isOpen = ref(false)

// 计算当前主题
const currentTheme = computed(() => {
  return preferenceStore.theme
})

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  const toggle = document.querySelector('.theme-toggle')
  if (toggle && !toggle.contains(event.target)) {
    isOpen.value = false
  }
}

// 设置主题
const setTheme = async (theme) => {
  try {
    console.log('设置主题:', theme)
    // 立即应用主题，确保UI立即更新
    preferenceStore.applyTheme(theme)
    preferenceStore.theme = theme
    
    // 保存到本地存储，确保即使服务器不可用也能保持主题
    localStorage.setItem('theme_preference', theme)
    
    // 无论是否登录，都显示成功消息
    showToast('主题已应用', 'success')
    
    // 如果用户已登录，尝试保存到服务器，但不影响用户体验
    if (authStore.isAuthenticated) {
      try {
        // 默认情况下，不等待服务器响应，只在本地更改
        preferenceStore.updatePreference({ theme })
          .then(() => console.log('主题设置已同步到服务器'))
          .catch(err => console.error('主题同步到服务器失败，但不影响使用:', err))
      } catch (saveError) {
        console.error('保存主题到服务器失败，但本地已应用:', saveError)
      }
    } else {
      console.log('用户未登录，主题设置已保存到本地')
    }
  } catch (error) {
    console.error('应用主题失败:', error)
    showToast('主题设置失败', 'error')
  }
  
  isOpen.value = false
}

// 初始化
onMounted(async () => {
  // 添加点击事件监听器
  document.addEventListener('click', handleClickOutside)
  
  // 如果用户未登录，尝试从localStorage读取主题设置
  if (!authStore.isAuthenticated) {
    const savedTheme = localStorage.getItem('theme_preference')
    if (savedTheme) {
      preferenceStore.theme = savedTheme
      preferenceStore.applyTheme(savedTheme)
    }
  }
})

onBeforeUnmount(() => {
  // 移除点击事件监听器
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-toggle {
  position: relative;
  display: inline-block;
}
</style> 