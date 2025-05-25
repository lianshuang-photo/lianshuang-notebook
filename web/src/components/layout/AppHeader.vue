<template>
  <header class="fixed top-0 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-apple-gray-border-secondary z-50 transition-all duration-300 ease-apple-ease">
    <div class="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
      <!-- Logo和应用名称 -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center" aria-label="LS笔记 首页">
          <span class="text-lg font-semibold text-apple-gray-text-primary dark:text-white tracking-tight">LS笔记</span>
        </router-link>
      </div>
      
      <!-- 主导航 -->
      <div class="hidden md:flex items-center space-x-8">
        <router-link to="/" class="text-sm" :class="[
          route.path === '/' ? 'text-apple-gray-text-primary dark:text-white font-medium' : 'text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-400 dark:hover:text-white transition-colors duration-200 ease-apple-ease'
        ]">
          仪表盘
        </router-link>
        
        <router-link to="/notes" class="text-sm" :class="[
          route.path.includes('/notes') ? 'text-apple-gray-text-primary dark:text-white font-medium' : 'text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-400 dark:hover:text-white transition-colors duration-200 ease-apple-ease'
        ]">
          笔记
        </router-link>
        
        <router-link to="/groups" class="text-sm" :class="[
          route.path.includes('/groups') ? 'text-apple-gray-text-primary dark:text-white font-medium' : 'text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-400 dark:hover:text-white transition-colors duration-200 ease-apple-ease'
        ]">
          分组
        </router-link>
        
        <router-link to="/ai-assistant" class="text-sm" :class="[
          route.path.includes('/ai-assistant') ? 'text-apple-gray-text-primary dark:text-white font-medium' : 'text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-400 dark:hover:text-white transition-colors duration-200 ease-apple-ease'
        ]">
          AI助手
        </router-link>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- 搜索按钮 -->
        <button 
          @click="toggleSearch"
          class="text-apple-gray-600 hover:text-apple-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 ease-apple-ease p-1.5 rounded-full hover:bg-apple-gray-100 dark:hover:bg-gray-700"
          aria-label="搜索"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <!-- 主题切换按钮 -->
        <ThemeToggle />
        
        <!-- 设置按钮 -->
        <router-link 
          to="/settings" 
          class="text-apple-gray-600 hover:text-apple-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 ease-apple-ease p-1.5 rounded-full hover:bg-apple-gray-100 dark:hover:bg-gray-700"
          aria-label="设置"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </router-link>
        
        <!-- 用户头像/菜单 -->
        <div class="relative">
          <button 
            id="user-menu-button"
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="w-8 h-8 rounded-full bg-apple-gray-200 dark:bg-gray-700 flex items-center justify-center text-apple-gray-text-primary dark:text-white font-medium text-sm focus:outline-none"
            aria-label="用户菜单"
            aria-expanded="isUserMenuOpen"
            aria-haspopup="true"
          >
            {{ userInitials }}
          </button>
          
          <div 
            id="user-menu-dropdown"
            v-if="isUserMenuOpen" 
            class="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-apple-lg bg-white dark:bg-gray-800 ring-1 ring-black/5 z-10 animate-scaleUp"
          >
            <div class="py-1" role="menu" aria-orientation="vertical">
              <div class="px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white border-b border-apple-gray-border-secondary dark:border-gray-700">
                {{ authStore.user?.username }}
              </div>
              
              <router-link to="/settings" class="block px-4 py-2 text-sm text-apple-gray-text-secondary dark:text-gray-300 hover:bg-apple-gray-100 dark:hover:bg-gray-700" role="menuitem">
                设置
              </router-link>
              
              <router-link v-if="isAdmin" to="/admin" class="block px-4 py-2 text-sm text-apple-gray-text-secondary dark:text-gray-300 hover:bg-apple-gray-100 dark:hover:bg-gray-700" role="menuitem">
                管理
              </router-link>
              
              <button @click="logout" class="w-full text-left block px-4 py-2 text-sm text-apple-gray-text-secondary dark:text-gray-300 hover:bg-apple-gray-100 dark:hover:bg-gray-700" role="menuitem">
                退出登录
              </button>
            </div>
          </div>
        </div>
        
        <!-- 移动端菜单按钮 -->
        <div class="md:hidden">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="text-apple-gray-600 hover:text-apple-gray-900 dark:text-gray-400 dark:hover:text-white p-1.5 rounded-full hover:bg-apple-gray-100 dark:hover:bg-gray-700"
            aria-label="打开菜单"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div 
      v-if="isMobileMenuOpen" 
      class="md:hidden bg-white dark:bg-gray-800 border-t border-apple-gray-border-secondary dark:border-gray-700 animate-fadeIn"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link to="/" class="block px-3 py-2 rounded-md text-base" :class="[
          route.path === '/' ? 'text-apple-gray-text-primary dark:text-white font-medium' : 'text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-300 dark:hover:text-white'
        ]">
          仪表盘
        </router-link>
        
        <router-link to="/notes" class="block px-3 py-2 rounded-md text-base" :class="[
          route.path.includes('/notes') ? 'text-apple-gray-text-primary dark:text-white font-medium' : 'text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-300 dark:hover:text-white'
        ]">
          笔记
        </router-link>
        
        <router-link to="/groups" class="block px-3 py-2 rounded-md text-base" :class="[
          route.path.includes('/groups') ? 'text-apple-gray-text-primary dark:text-white font-medium' : 'text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-300 dark:hover:text-white'
        ]">
          分组
        </router-link>
        
        <router-link to="/ai-assistant" class="block px-3 py-2 rounded-md text-base" :class="[
          route.path.includes('/ai-assistant') ? 'text-apple-gray-text-primary dark:text-white font-medium' : 'text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-300 dark:hover:text-white'
        ]">
          AI助手
        </router-link>
      </div>
    </div>
  </header>
  
  <!-- 占位符，避免内容被固定头部遮挡 -->
  <div class="h-14"></div>
  
  <!-- 全局搜索框 -->
  <div 
    v-if="showSearch" 
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4 fade-in"
    @click.self="showSearch = false"
  >
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-apple-xl max-w-2xl w-full p-4 scale-in">
      <div class="relative">
        <input 
          ref="searchInput"
          type="text" 
          v-model="globalSearchQuery" 
          placeholder="搜索笔记、标签和内容..." 
          class="w-full py-3 px-5 pr-10 bg-apple-gray-background-light dark:bg-gray-700 border-0 rounded-xl text-apple-gray-text-primary dark:text-white placeholder-apple-gray-text-secondary text-base focus:ring-1 focus:ring-apple-blue/30 focus:outline-none"
          @keydown.esc="showSearch = false"
          @keydown.enter="performSearch"
        >
        <button 
          @click="performSearch"
          class="absolute right-0 inset-y-0 flex items-center pr-4 text-apple-gray-500 hover:text-apple-gray-700 dark:hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      <!-- 搜索结果容器 -->
      <div class="mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-apple-gray-border-secondary dark:border-gray-700 overflow-hidden scale-in">
        <!-- 搜索结果加载中 -->
        <div v-if="searchLoading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-apple-blue border-r-2 mb-2"></div>
          <p class="text-apple-gray-text-secondary dark:text-gray-400">搜索中...</p>
        </div>
        
        <!-- 搜索错误提示 -->
        <div v-else-if="searchError" class="text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-apple-gray-text-secondary dark:text-gray-400">{{ searchError }}</p>
          <p class="text-xs text-apple-gray-text-secondary dark:text-gray-500 mt-1">已切换到本地搜索模式</p>
        </div>
        
        <!-- 空搜索结果 -->
        <div v-else-if="searchResults.length === 0 && hasSearched" class="text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-apple-gray-text-secondary dark:text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-apple-gray-text-secondary dark:text-gray-400">未找到匹配的笔记</p>
        </div>

        <!-- 尚未搜索 -->
        <div v-else-if="!hasSearched" class="text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-apple-blue mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="text-apple-gray-text-secondary dark:text-gray-400">输入关键词进行搜索</p>
          <p class="text-xs text-apple-gray-text-secondary dark:text-gray-500 mt-1">支持标题和内容搜索</p>
        </div>
        
        <!-- 搜索结果列表 -->
        <div v-else class="divide-y divide-apple-gray-border-secondary dark:divide-gray-700 max-h-96 overflow-y-auto">
          <router-link
            v-for="note in searchResults"
            :key="note.id"
            :to="`/notes/${note.id}`"
            class="block px-4 py-3 hover:bg-apple-gray-background-light dark:hover:bg-gray-700 transition-colors"
            @click="showSearch = false"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-apple-gray-text-primary dark:text-white text-sm truncate">
                {{ note.title }}
              </h3>
              <span v-if="note.group_name" class="text-xs bg-apple-blue/10 dark:bg-blue-900/30 text-apple-blue dark:text-blue-400 px-2 py-0.5 rounded-full">
                {{ note.group_name }}
              </span>
            </div>
            <p class="text-apple-gray-text-secondary dark:text-gray-400 text-xs mt-1 line-clamp-1">
              {{ note.content_preview || '无内容预览' }}
            </p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUserPreferenceStore } from '@/store/userPreference'
import { useNoteStore } from '@/store/note'
import { useToast } from '@/composables/useToast'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const preferenceStore = useUserPreferenceStore()
const noteStore = useNoteStore()
const { showToast } = useToast()

const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isDarkMode = ref(false)
const showSearch = ref(false)
const globalSearchQuery = ref('')
const searchInput = ref(null)
const searchResults = ref([])
const searchLoading = ref(false)
const hasSearched = ref(false)
const searchError = ref('')

// 检查当前主题
onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark')
  
  // 点击页面其他地方关闭菜单
  document.addEventListener('click', handleClickOutside)
  
  // 监听全局搜索快捷键
  document.addEventListener('keydown', handleGlobalShortcuts)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleGlobalShortcuts)
})

// 全局键盘快捷键
const handleGlobalShortcuts = (event) => {
  // Cmd+K 或 Ctrl+K 打开搜索
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    toggleSearch()
  }
}

// 切换搜索显示
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

// 监听搜索框关闭时清空查询
watch(showSearch, (newValue) => {
  if (!newValue) {
    // 保留搜索关键词，但是重置其他状态
    hasSearched.value = false
    searchResults.value = []
    searchError.value = ''
  }
})

// 执行搜索
const performSearch = async () => {
  if (!globalSearchQuery.value.trim()) return
  
  searchLoading.value = true
  hasSearched.value = true
  searchError.value = ''
  searchResults.value = [] // 清空上一次搜索结果
  
  try {
    console.log('正在搜索:', globalSearchQuery.value)
    const results = await noteStore.searchNotesAction(globalSearchQuery.value)
    
    // 确保结果是数组
    searchResults.value = Array.isArray(results) ? results : []
    console.log('搜索结果:', searchResults.value)
    
    if (searchResults.value.length > 0) {
      console.log(`找到 ${searchResults.value.length} 条匹配的笔记`)
      showToast(`找到 ${searchResults.value.length} 条匹配结果`, 'success')
    } else {
      console.log('未找到匹配的笔记')
    }
  } catch (error) {
    console.error('搜索失败:', error)
    searchError.value = '搜索服务暂时不可用'
    showToast('搜索已切换到本地模式', 'info')
    
    // 尝试直接在本组件进行本地搜索
    try {
      // 从localStorage获取缓存的笔记数据
      const notesString = localStorage.getItem('cached_notes')
      if (notesString) {
        const notes = JSON.parse(notesString)
        const queryLower = globalSearchQuery.value.toLowerCase()
        
        // 本地过滤笔记
        searchResults.value = notes.filter(note => 
          note.title.toLowerCase().includes(queryLower) || 
          (note.content && note.content.toLowerCase().includes(queryLower))
        )
        
        console.log('组件本地搜索结果:', searchResults.value.length, '条记录')
        
        if (searchResults.value.length > 0) {
          showToast(`找到 ${searchResults.value.length} 条匹配结果（本地搜索）`, 'success')
        }
      }
    } catch (localError) {
      console.error('本地搜索失败:', localError)
    }
  } finally {
    searchLoading.value = false
  }
}

const handleClickOutside = (event) => {
  // 关闭用户菜单（除非点击的是用户菜单按钮）
  if (isUserMenuOpen.value) {
    const userMenuBtn = document.getElementById('user-menu-button')
    const userMenuDropdown = document.getElementById('user-menu-dropdown')
    
    if (!(userMenuBtn && userMenuBtn.contains(event.target)) && 
        !(userMenuDropdown && userMenuDropdown.contains(event.target))) {
      isUserMenuOpen.value = false
    }
  }
  
  // 关闭移动端菜单（仅在点击非菜单按钮区域时）
  const mobileMenuBtn = document.querySelector('.md\\:hidden button')
  if (isMobileMenuOpen.value && mobileMenuBtn && !mobileMenuBtn.contains(event.target)) {
    isMobileMenuOpen.value = false
  }
}

// 获取用户名首字母
const userInitials = computed(() => {
  const user = authStore.user
  if (!user) return '?'
  
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
  }
  
  return user.username[0].toUpperCase()
})

// 是否为管理员
const isAdmin = computed(() => {
  return authStore.isAdmin || authStore.isSuperuser
})

// 退出登录
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

.scale-in {
  animation: scaleIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style> 
 







