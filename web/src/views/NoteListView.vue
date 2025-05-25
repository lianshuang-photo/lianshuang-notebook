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
          class="group bg-white dark:bg-gray-800 rounded-2xl border border-apple-gray-border-secondary dark:border-gray-700 hover:shadow-apple-md transition-all duration-200 ease-apple-ease overflow-hidden">
          <router-link :to="`/notes/${note.id}`" class="block p-5">
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
              {{ note.content_preview || '暂无内容' }}
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
import { ref, computed, onMounted, watch } from 'vue'
import { useNoteStore } from '@/store/note'
import { useRoute } from 'vue-router'

const noteStore = useNoteStore()
const route = useRoute()

const loading = ref(true)
const searchQuery = ref('')
const searchTimeout = ref(null)
const selectedGroup = ref(null)
const showDeleteConfirm = ref(false)
const noteToDelete = ref(null)

// 获取所有笔记和分组
onMounted(async () => {
  loading.value = true
  try {
    // 如果有分组ID路由参数，则显示该分组的笔记
    const groupId = route.params.id
    if (groupId) {
      console.log('显示分组笔记:', groupId)
      selectedGroup.value = groupId
      await Promise.all([
        noteStore.fetchNotesByGroup(groupId),
        noteStore.fetchGroups()
      ])
    } else {
      await Promise.all([
        noteStore.fetchNotes(),
        noteStore.fetchGroups()
      ])
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})

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

// 过滤后的笔记列表
const filteredNotes = computed(() => {
  let notes = noteStore.notes
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    notes = notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      (note.content_preview && note.content_preview.toLowerCase().includes(query))
    )
  }
  
  return notes
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
 
