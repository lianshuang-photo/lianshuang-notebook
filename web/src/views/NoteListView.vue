<template>
  <div class="container mx-auto px-4 py-6 sm:px-6 max-w-6xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-medium text-apple-gray-text-primary dark:text-white">
        我的笔记
      </h1>
      
      <div class="flex items-center space-x-3">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索笔记" 
            class="py-2 px-4 pr-10 bg-apple-gray-background-light dark:bg-gray-700 border-0 rounded-lg text-apple-gray-text-primary dark:text-white placeholder-apple-gray-text-secondary text-sm focus:ring-1 focus:ring-apple-blue/30 focus:outline-none w-60"
            @input="searchNotes"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- 筛选按钮 -->
        <div class="relative" ref="filterContainer">
          <button 
            @click="toggleFilterMenu" 
            class="py-2 px-4 bg-apple-gray-background-light dark:bg-gray-700 rounded-lg text-apple-gray-text-primary dark:text-white text-sm hover:bg-apple-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            aria-haspopup="true"
            :aria-expanded="showFilterMenu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
            <span v-if="isFilterActive" class="ml-1.5 w-2 h-2 rounded-full bg-apple-blue"></span>
          </button>
          
          <!-- 筛选菜单 -->
          <div
            v-if="showFilterMenu"
            class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-apple-lg border border-apple-gray-border-secondary dark:border-gray-700 z-10 animate-scaleUp"
          >
            <div class="p-4">
              <h3 class="text-sm font-medium text-apple-gray-text-primary dark:text-white mb-3">按时间筛选</h3>
              <div class="space-y-2 mb-4">
                <label class="flex items-center">
                  <input type="radio" v-model="timeFilter" value="all" class="mr-2 text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">所有时间</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="timeFilter" value="today" class="mr-2 text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">今天</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="timeFilter" value="week" class="mr-2 text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">本周</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="timeFilter" value="month" class="mr-2 text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">本月</span>
                </label>
              </div>
              
              <h3 class="text-sm font-medium text-apple-gray-text-primary dark:text-white mb-3">按内容筛选</h3>
              <div class="space-y-2 mb-4">
                <label class="flex items-center">
                  <input type="checkbox" v-model="showEmptyNotes" class="mr-2 rounded text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">显示空笔记</span>
                </label>
              </div>
              
              <h3 class="text-sm font-medium text-apple-gray-text-primary dark:text-white mb-3">排序方式</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="radio" v-model="sortOrder" value="updated_desc" class="mr-2 text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">最近更新</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="sortOrder" value="updated_asc" class="mr-2 text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">最早更新</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="sortOrder" value="title_asc" class="mr-2 text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">标题 A-Z</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="sortOrder" value="title_desc" class="mr-2 text-apple-blue focus:ring-apple-blue/30">
                  <span class="text-sm text-apple-gray-text-primary dark:text-white">标题 Z-A</span>
                </label>
              </div>
              
              <div class="flex justify-end mt-4">
                <button @click="resetFilters" class="text-sm text-apple-blue hover:underline">重置筛选</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 导入按钮 - 始终显示 -->
        <NoteExportImport 
          @import-success="handleImportSuccess"
          v-if="!selectionMode"
        />
        
        <button 
          @click="toggleSelectionMode" 
          v-if="!selectionMode && filteredNotes.length > 0"
          class="py-2 px-4 bg-apple-gray-background-light dark:bg-gray-700 rounded-lg text-apple-gray-text-primary dark:text-white text-sm hover:bg-apple-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            选择
          </span>
        </button>
        
        <div v-if="selectionMode" class="flex items-center space-x-2">
          <NoteExportImport 
            :selectedNotes="selectedNotes" 
            @import-success="handleImportSuccess"
          />
          
          <button 
            @click="cancelSelectionMode" 
            class="py-2 px-4 bg-apple-gray-background-light dark:bg-gray-700 rounded-lg text-apple-gray-text-primary dark:text-white text-sm hover:bg-apple-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            取消选择
          </button>
          
          <button 
            @click="selectAllNotes" 
            class="py-2 px-4 bg-apple-gray-background-light dark:bg-gray-700 rounded-lg text-apple-gray-text-primary dark:text-white text-sm hover:bg-apple-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {{ isAllSelected ? '取消全选' : '全选' }}
          </button>
        </div>
        
        <router-link to="/notes/new" class="bg-apple-blue text-white rounded-full py-2 px-4 text-sm font-medium hover:opacity-90 active:scale-95 transition-all duration-200 ease-apple-ease shadow-apple-sm hover:shadow-apple-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          新建笔记
        </router-link>
      </div>
    </div>

    <!-- 分组过滤 -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button 
        @click="selectedGroup = null" 
        class="px-3 py-1.5 text-sm rounded-full transition-all duration-200 ease-apple-ease"
        :class="selectedGroup === null ? 
          'bg-apple-blue/10 text-apple-blue dark:bg-blue-900/30 dark:text-blue-400' : 
          'bg-apple-gray-100 dark:bg-gray-800 text-apple-gray-text-secondary dark:text-gray-400 hover:bg-apple-gray-200 dark:hover:bg-gray-700'"
      >
        全部
      </button>
      <button 
        v-for="group in groups" 
        :key="group.id" 
        @click="selectedGroup = group.id"
        class="px-3 py-1.5 text-sm rounded-full transition-all duration-200 ease-apple-ease"
        :class="selectedGroup === group.id ? 
          'bg-apple-blue/10 text-apple-blue dark:bg-blue-900/30 dark:text-blue-400' : 
          'bg-apple-gray-100 dark:bg-gray-800 text-apple-gray-text-secondary dark:text-gray-400 hover:bg-apple-gray-200 dark:hover:bg-gray-700'"
      >
        {{ group.name }}
      </button>
    </div>

    <!-- 选中笔记数量显示 -->
    <div v-if="selectionMode && selectedNotes.length > 0" class="mb-4 p-3 bg-apple-blue/10 dark:bg-blue-900/30 rounded-xl">
      <p class="text-apple-blue dark:text-blue-400">
        已选择 {{ selectedNotes.length }} 个笔记
      </p>
    </div>

    <!-- 筛选信息显示 -->
    <div v-if="isFilterActive && !selectionMode" class="mb-4 p-3 bg-apple-gray-100 dark:bg-gray-800 rounded-xl">
      <div class="flex items-center justify-between">
        <p class="text-apple-gray-text-primary dark:text-white text-sm">
          已筛选 {{ filteredNotes.length }} 个笔记
          <span v-if="timeFilter !== 'all'" class="ml-2 text-apple-gray-text-secondary dark:text-gray-400">
            {{ timeFilterLabel }}
          </span>
          <span v-if="sortOrder !== 'updated_desc'" class="ml-2 text-apple-gray-text-secondary dark:text-gray-400">
            {{ sortOrderLabel }}
          </span>
        </p>
        <button @click="resetFilters" class="text-xs text-apple-blue hover:underline">
          清除筛选
        </button>
      </div>
    </div>

    <!-- 笔记列表 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="flex space-x-1">
        <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce"></div>
        <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
    </div>

    <div v-else-if="filteredNotes.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-apple-sm border border-apple-gray-border-secondary">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-apple-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-apple-gray-text-primary dark:text-white">暂无笔记</h3>
      <p class="mt-1 text-apple-gray-text-secondary dark:text-gray-400">
        {{ searchQuery ? '没有找到符合条件的笔记。' : '开始创建你的第一个笔记吧。' }}
      </p>
      <div class="mt-6">
        <router-link to="/notes/new" class="bg-apple-blue text-white rounded-full py-2 px-4 text-sm font-medium hover:opacity-90 inline-block transition-opacity duration-200 ease-apple-ease">
          创建新笔记
        </router-link>
      </div>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="note in filteredNotes" :key="note.id" 
          class="group bg-white dark:bg-gray-800 rounded-2xl border border-apple-gray-border-secondary dark:border-gray-700 hover:shadow-apple-md transition-all duration-200 ease-apple-ease overflow-hidden"
          :class="{'border-apple-blue dark:border-blue-500': isNoteSelected(note)}"
        >
          <div class="flex" v-if="selectionMode">
            <div class="p-4 flex items-center">
              <input 
                type="checkbox" 
                :checked="isNoteSelected(note)"
                @change="toggleNoteSelection(note)"
                class="w-5 h-5 rounded border-apple-gray-300 dark:border-gray-600 text-apple-blue focus:ring-apple-blue/30 dark:focus:ring-blue-700"
              />
            </div>
            <div class="flex-1 p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <h2 class="text-lg font-medium text-apple-gray-text-primary dark:text-white truncate mb-1">
                    {{ note.title || '无标题笔记' }}
                  </h2>
                  <div class="text-sm text-apple-gray-text-secondary dark:text-gray-400 mb-2">
                    <span>{{ formatDate(note.updated_at) }}</span>
                    <span class="mx-1.5">•</span>
                    <span>{{ getGroupName(note.group.id) }}</span>
                  </div>
                </div>
              </div>
              <p class="text-apple-gray-text-secondary dark:text-gray-400 text-sm line-clamp-2">
                {{ getContentPreview(note.content) }}
              </p>
            </div>
          </div>
          <router-link :to="`/notes/${note.id}`" class="block p-5" v-else>
            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-medium text-apple-gray-text-primary dark:text-white truncate mb-1">
                  {{ note.title || '无标题笔记' }}
                </h2>
                <div class="text-sm text-apple-gray-text-secondary dark:text-gray-400 mb-2">
                  <span>{{ formatDate(note.updated_at) }}</span>
                  <span class="mx-1.5">•</span>
                  <span>{{ getGroupName(note.group.id) }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <router-link :to="`/notes/${note.id}/edit`" class="p-1.5 rounded-full text-apple-gray-500 hover:text-apple-blue hover:bg-apple-gray-100 dark:hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </router-link>
                <button @click.prevent="deleteNoteConfirm(note)" class="p-1.5 rounded-full text-apple-gray-500 hover:text-red-500 hover:bg-apple-gray-100 dark:hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-apple-gray-text-secondary dark:text-gray-400 text-sm line-clamp-2">
              {{ getContentPreview(note.content) }}
            </p>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 确认删除对话框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-apple-xl max-w-md w-full p-6 scale-in">
        <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white mb-2">确认删除</h3>
        <p class="text-apple-gray-text-secondary dark:text-gray-400 mb-6">
          你确定要删除笔记 "{{ noteToDelete?.title || '无标题' }}" 吗？此操作不可撤销。
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelDelete" class="bg-white dark:bg-gray-700 text-apple-gray-text-primary dark:text-white rounded-full py-2 px-4 text-sm font-medium border border-apple-gray-300 dark:border-gray-600 hover:bg-apple-gray-50 dark:hover:bg-gray-600">
            取消
          </button>
          <button @click="confirmDelete" class="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-4 text-sm font-medium">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useNoteStore } from '@/store/note'
import { useRoute, useRouter } from 'vue-router'
import NoteExportImport from '@/components/NoteExportImport.vue'
import { useToast } from '@/composables/useToast'

const noteStore = useNoteStore()
const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

const loading = ref(true)
const searchQuery = ref('')
const searchTimeout = ref(null)
const selectedGroup = ref(null)
const showDeleteConfirm = ref(false)
const noteToDelete = ref(null)
const selectionMode = ref(false)
const selectedNotes = ref([])

// 筛选相关
const showFilterMenu = ref(false)
const filterContainer = ref(null)
const timeFilter = ref('all')
const showEmptyNotes = ref(true)
const sortOrder = ref('updated_desc')

// 获取所有笔记和分组
onMounted(async () => {
  loading.value = true
  try {
    // 检查URL参数中是否有group参数
    const groupParam = route.query.group
    
    if (groupParam) {
      console.log('从URL参数获取分组:', groupParam)
      selectedGroup.value = groupParam
      await Promise.all([
        noteStore.fetchNotesByGroup(groupParam),
        noteStore.fetchGroups()
      ])
    } 
    // 如果有分组ID路由参数，则显示该分组的笔记
    else if (route.params.id) {
      console.log('显示分组笔记:', route.params.id)
      selectedGroup.value = route.params.id
      await Promise.all([
        noteStore.fetchNotesByGroup(route.params.id),
        noteStore.fetchGroups()
      ])
    } else {
      await Promise.all([
        noteStore.fetchNotes(),
        noteStore.fetchGroups()
      ])
    }

    // 添加点击外部关闭筛选菜单
    document.addEventListener('click', handleClickOutside)
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 处理点击外部关闭筛选菜单
const handleClickOutside = (event) => {
  if (filterContainer.value && !filterContainer.value.contains(event.target)) {
    showFilterMenu.value = false
  }
}

// 切换筛选菜单
const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value
}

// 重置筛选条件
const resetFilters = () => {
  timeFilter.value = 'all'
  showEmptyNotes.value = true
  sortOrder.value = 'updated_desc'
  showFilterMenu.value = false
}

// 监听分组选择变化
watch(selectedGroup, async (newGroupId) => {
  loading.value = true
  try {
    if (newGroupId) {
      await noteStore.fetchNotesByGroup(newGroupId)
    } else {
      await noteStore.fetchNotes()
    }
  } catch (error) {
    console.error('加载笔记失败:', error)
  } finally {
    loading.value = false
  }
})

// 笔记总数
const totalNotes = computed(() => noteStore.notes.length)

// 分组列表
const groups = computed(() => noteStore.groups)

// 是否有筛选条件激活
const isFilterActive = computed(() => {
  return timeFilter.value !== 'all' || !showEmptyNotes.value || sortOrder.value !== 'updated_desc'
})

// 时间筛选标签
const timeFilterLabel = computed(() => {
  switch (timeFilter.value) {
    case 'today': return '今天'
    case 'week': return '本周'
    case 'month': return '本月'
    default: return ''
  }
})

// 排序方式标签
const sortOrderLabel = computed(() => {
  switch (sortOrder.value) {
    case 'updated_asc': return '最早更新'
    case 'title_asc': return '标题 A-Z'
    case 'title_desc': return '标题 Z-A'
    default: return ''
  }
})

// 过滤后的笔记列表
const filteredNotes = computed(() => {
  let notes = noteStore.notes
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    notes = notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      (note.content_preview && note.content_preview.toLowerCase().includes(query))
    )
  }
  
  // 内容筛选
  if (!showEmptyNotes.value) {
    notes = notes.filter(note => note.content && note.content.trim() !== '')
  }
  
  // 时间筛选
  if (timeFilter.value !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (timeFilter.value === 'today') {
      notes = notes.filter(note => {
        const noteDate = new Date(note.updated_at)
        return noteDate >= today
      })
    } else if (timeFilter.value === 'week') {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay()) // 本周日为起点
      weekStart.setHours(0, 0, 0, 0)
      
      notes = notes.filter(note => {
        const noteDate = new Date(note.updated_at)
        return noteDate >= weekStart
      })
    } else if (timeFilter.value === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      notes = notes.filter(note => {
        const noteDate = new Date(note.updated_at)
        return noteDate >= monthStart
      })
    }
  }
  
  // 排序
  return [...notes].sort((a, b) => {
    if (sortOrder.value === 'updated_desc') {
      return new Date(b.updated_at) - new Date(a.updated_at)
    } else if (sortOrder.value === 'updated_asc') {
      return new Date(a.updated_at) - new Date(b.updated_at)
    } else if (sortOrder.value === 'title_asc') {
      return (a.title || '').localeCompare(b.title || '')
    } else if (sortOrder.value === 'title_desc') {
      return (b.title || '').localeCompare(a.title || '')
    }
    return 0
  })
})

// 搜索笔记，带防抖
const searchNotes = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    // 搜索逻辑由计算属性处理
    searchTimeout.value = null
  }, 300)
}

// 获取分组名称
const getGroupName = (groupId) => {
  const group = noteStore.getGroupById(groupId)
  return group ? group.name : '未分组'
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
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

// 删除笔记相关
const deleteNoteConfirm = (note) => {
  noteToDelete.value = note
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  noteToDelete.value = null
  showDeleteConfirm.value = false
}

const confirmDelete = async () => {
  if (!noteToDelete.value) return
  
  try {
    await noteStore.removeNote(noteToDelete.value.id)
    showDeleteConfirm.value = false
    noteToDelete.value = null
  } catch (error) {
    console.error('删除笔记失败:', error)
  }
}

// 批量选择相关
const toggleSelectionMode = () => {
  selectionMode.value = true
  selectedNotes.value = []
}

const cancelSelectionMode = () => {
  selectionMode.value = false
  selectedNotes.value = []
}

const toggleNoteSelection = (note) => {
  const index = selectedNotes.value.findIndex(n => n.id === note.id)
  if (index === -1) {
    selectedNotes.value.push(note)
  } else {
    selectedNotes.value.splice(index, 1)
  }
}

const isNoteSelected = (note) => {
  return selectedNotes.value.some(n => n.id === note.id)
}

const selectAllNotes = () => {
  if (selectedNotes.value.length === filteredNotes.value.length) {
    // 取消全选
    selectedNotes.value = []
  } else {
    // 全选
    selectedNotes.value = [...filteredNotes.value]
  }
}

const isAllSelected = computed(() => {
  return selectedNotes.value.length === filteredNotes.value.length && filteredNotes.value.length > 0
})

// 处理导入成功
const handleImportSuccess = async (notes) => {
  if (!notes || notes.length === 0) return
  
  try {
    loading.value = true
    
    // 获取当前选中的分组ID
    const groupId = selectedGroup.value || (groups.value.length > 0 ? groups.value[0].id : null)
    
    if (!groupId) {
      showToast('导入失败：没有可用的笔记分组', 'error')
      return
    }
    
    // 导入每个笔记
    for (const note of notes) {
      await noteStore.saveNote({
        title: note.title,
        content: note.content,
        group: groupId
      })
    }
    
    // 刷新笔记列表
    if (selectedGroup.value) {
      await noteStore.fetchNotesByGroup(selectedGroup.value)
    } else {
      await noteStore.fetchNotes()
    }
    
    showToast(`成功导入 ${notes.length} 个笔记`, 'success')
  } catch (error) {
    console.error('保存导入笔记失败:', error)
    showToast('导入失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
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
 
