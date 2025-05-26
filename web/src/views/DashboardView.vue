<template>
  <div class="bg-apple-gray-100 dark:bg-gray-900 min-h-screen pb-12">
    <div class="container mx-auto px-4 py-12 sm:px-6 max-w-6xl">
      <!-- 欢迎横幅 - 类似demo设计 -->
      <div class="py-16 bg-white dark:bg-gray-800 rounded-2xl mb-16 text-center shadow-apple-sm border border-apple-gray-border-secondary dark:border-gray-700">
        <h1 class="text-4xl font-semibold text-apple-gray-text-primary dark:text-white mb-4">
          漣灀笔记 - 知识管理系统
        </h1>
        <p class="text-lg text-apple-gray-text-secondary dark:text-gray-400 max-w-2xl mx-auto mb-8">
          轻松记录知识、整理笔记，结合AI辅助提升学习效率。
        </p>
        <router-link 
          to="/notes/new" 
          class="bg-apple-blue text-white rounded-full py-3 px-8 text-base font-medium hover:opacity-90 active:scale-95 transition-all duration-200 ease-apple-ease shadow-apple-md hover:shadow-apple-lg inline-flex items-center"
        >
          创建新笔记
        </router-link>
      </div>

      <!-- 笔记本部分 -->
      <div class="mb-16 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-apple-sm border border-apple-gray-border-secondary dark:border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-apple-gray-text-primary dark:text-white">
            你的笔记本
          </h2>
          <router-link to="/groups" class="text-apple-link hover:underline">
            查看全部
          </router-link>
        </div>

        <div v-if="loading" class="p-6 text-center text-apple-gray-text-secondary dark:text-gray-400">
          <div class="flex justify-center items-center space-x-1">
            <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce"></div>
            <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
          <p class="mt-2">加载笔记本中...</p>
        </div>

        <div v-else-if="groups.length === 0" class="p-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-apple-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
          <p class="text-apple-gray-text-secondary dark:text-gray-400 mb-4">
            暂无笔记本，创建一个分组开始整理笔记吧
          </p>
          <router-link to="/groups" class="bg-apple-blue text-white rounded-full py-2 px-4 text-sm font-medium hover:opacity-90 inline-block transition-opacity duration-200 ease-apple-ease">
            创建笔记本
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 笔记本卡片示例 -->
          <div v-for="group in groups.slice(0, 3)" :key="group.id" 
            class="bg-apple-gray-background-light dark:bg-gray-700 rounded-2xl border border-apple-gray-border-secondary dark:border-gray-600 hover:shadow-apple-md transition-all duration-200 ease-apple-ease overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white mb-1">
                {{ group.name }}
              </h3>
              <p class="text-apple-gray-text-secondary dark:text-gray-400 text-sm mb-4">
                {{ group.note_count || 0 }} 篇笔记
              </p>
              <p class="text-apple-gray-text-secondary dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {{ group.description || '暂无描述' }}
              </p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-apple-gray-text-secondary dark:text-gray-400">
                  更新于 {{ formatDate(group.updated_at) }}
                </span>
                <router-link :to="`/groups/${group.id}`" class="text-apple-link text-sm hover:underline">
                  打开 →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近笔记 -->
      <div class="mb-16 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-apple-sm border border-apple-gray-border-secondary dark:border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-apple-gray-text-primary dark:text-white">
            最近笔记
          </h2>
          <router-link to="/notes" class="text-apple-link hover:underline">
            查看全部
          </router-link>
        </div>

        <div v-if="loading" class="p-6 text-center text-apple-gray-text-secondary dark:text-gray-400">
          <div class="flex justify-center items-center space-x-1">
            <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce"></div>
            <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
          <p class="mt-2">加载笔记中...</p>
        </div>
          
        <div v-else-if="recentNotes.length === 0" class="p-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-apple-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-apple-gray-text-secondary dark:text-gray-400 mb-4">
            暂无笔记，开始创建你的第一篇笔记吧
          </p>
          <router-link to="/notes/new" class="bg-apple-blue text-white rounded-full py-2 px-4 text-sm font-medium hover:opacity-90 inline-block transition-opacity duration-200 ease-apple-ease">
            新建笔记
          </router-link>
        </div>
          
        <div v-else>
          <div v-for="note in recentNotes.slice(0, 3)" :key="note.id" class="bg-apple-gray-background-light dark:bg-gray-700 rounded-2xl border border-apple-gray-border-secondary dark:border-gray-600 overflow-hidden mb-4 last:mb-0">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-sm text-apple-gray-text-secondary dark:text-gray-400 mb-1">
                    {{ note.group?.name || '无分组' }}
                  </div>
                  <h3 class="text-xl font-medium text-apple-gray-text-primary dark:text-white mb-2">
                    {{ note.title || '无标题笔记' }}
                  </h3>
                  <p class="text-apple-gray-text-secondary dark:text-gray-400 mb-4 line-clamp-3">
                    {{ getContentPreview(note.content) }}
                  </p>
                </div>
                <div class="text-sm text-apple-gray-text-secondary dark:text-gray-400">
                  编辑于 {{ formatDate(note.updated_at) }}
                </div>
              </div>
              <div class="flex justify-end">
                <router-link :to="`/notes/${note.id}`" class="text-apple-link text-sm hover:underline">
                  打开 →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- AI功能展示区域 -->
    <AIFeature />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useNoteStore } from '@/store/note'
import AIFeature from '@/components/AIFeature.vue'

const authStore = useAuthStore()
const noteStore = useNoteStore()

const loading = ref(true)
const recentNotes = ref([])
const groups = ref([])

const username = computed(() => {
  const user = authStore.user
  return user ? (user.first_name || user.username) : '用户'
})

const formattedDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  return new Date().toLocaleDateString('zh-CN', options)
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  // 一天内
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    if (hours === 0) {
      const minutes = Math.floor(diff / 60000)
      if (minutes === 0) {
        return '刚刚'
      }
      return `${minutes}分钟前`
    }
    return `${hours}小时前`
  }
  
  // 一周内
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}天前`
  }
  
  // 超过一周
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric'
  })
}

// 获取内容预览
const getContentPreview = (content) => {
  if (!content) return '暂无内容'
  // 移除Markdown标记，保留纯文本
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 移除标题标记 
    .replace(/\*\*(.+?)\*\*/g, '$1') // 移除加粗
    .replace(/\*(.+?)\*/g, '$1') // 移除斜体
    .replace(/!\[.*?\]\(.*?\)/g, '[图片]') // 图片替换为[图片]
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // 链接替换为链接文本
    .replace(/```[\s\S]*?```/g, '[代码]') // 代码块替换为[代码]
    .replace(/`([^`]+)`/g, '$1') // 内联代码
    .replace(/\n/g, ' ') // 换行替换为空格
  
  // 限制字数
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
}

onMounted(async () => {
  loading.value = true
  
  try {
    // 获取最近笔记
    recentNotes.value = await noteStore.fetchRecentNotes()
    
    // 获取分组
    groups.value = await noteStore.fetchGroups()
  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script> 