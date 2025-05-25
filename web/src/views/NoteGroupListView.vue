<template>
  <div class="bg-apple-gray-100 dark:bg-gray-900 min-h-screen pt-8 pb-12">
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-apple-gray-text-primary dark:text-white">
            笔记分组
          </h1>
          <p class="mt-1 text-apple-gray-text-secondary dark:text-gray-400">
            管理笔记分组，整理你的知识库
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button 
            @click="openCreateGroupModal" 
            class="btn-primary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            新建分组
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-10 w-10 text-apple-blue mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-apple-gray-text-secondary dark:text-gray-400">加载分组中...</p>
      </div>

      <!-- 无分组状态 -->
      <div v-else-if="groups.length === 0" class="text-center py-12 content-block">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-apple-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-apple-gray-text-primary dark:text-white">暂无分组</h3>
        <p class="mt-1 text-apple-gray-text-secondary dark:text-gray-400">
          创建分组可以更好地组织和管理你的笔记
        </p>
        <div class="mt-6">
          <button @click="openCreateGroupModal" class="btn-primary">
            创建第一个分组
          </button>
        </div>
      </div>

      <!-- 分组列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="group in groups" :key="group.id" class="apple-card">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <router-link :to="`/groups/${group.id}`" class="text-lg font-semibold text-apple-gray-text-primary dark:text-white hover:text-apple-blue dark:hover:text-blue-400 transition-colors">
                {{ group.name }}
              </router-link>
              <div class="flex space-x-1">
                <button @click="openEditGroupModal(group)" class="p-1 rounded-full text-apple-gray-text-secondary hover:text-apple-blue transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button @click="confirmDeleteGroup(group)" class="p-1 rounded-full text-apple-gray-text-secondary hover:text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-apple-gray-text-secondary dark:text-gray-400 text-sm mb-3">
              {{ group.description || '暂无描述' }}
            </p>
            <div class="flex items-center justify-between text-xs text-apple-gray-text-secondary dark:text-gray-400">
              <span>{{ group.note_count || 0 }}篇笔记</span>
              <router-link :to="`/groups/${group.id}`" class="text-apple-blue hover:text-apple-blue/80 dark:text-blue-400 dark:hover:text-blue-300">
                查看详情
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 创建/编辑分组对话框 -->
      <div v-if="showGroupModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 class="text-xl font-medium text-apple-gray-text-primary dark:text-white mb-6">
            {{ isEditMode ? '编辑分组' : '创建分组' }}
          </h3>
          
          <!-- 错误提示 -->
          <div v-if="formError" class="mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-3 text-sm">
            {{ formError }}
          </div>
          
          <form @submit.prevent="saveGroup">
            <div class="mb-4">
              <label for="name" class="form-label">
                分组名称
              </label>
              <input 
                id="name"
                v-model="groupForm.name"
                type="text"
                required
                class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                placeholder="输入分组名称"
                @focus="formError = ''"
              />
            </div>
            <div class="mb-6">
              <label for="description" class="form-label">
                分组描述
              </label>
              <textarea 
                id="description"
                v-model="groupForm.description"
                class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                rows="3"
                placeholder="输入分组描述（可选）"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="closeGroupModal"
                class="btn-secondary"
              >
                取消
              </button>
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="saveLoading"
              >
                <span v-if="saveLoading">保存中...</span>
                <span v-else>{{ isEditMode ? '更新' : '创建' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 保存失败提示框 -->
      <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white mb-2">保存分组失败</h3>
            <p class="text-apple-gray-text-secondary dark:text-gray-400 mb-6">
              请稍后重试
            </p>
            <button @click="showErrorModal = false" class="btn-primary">
              关闭
            </button>
          </div>
        </div>
      </div>

      <!-- 删除确认对话框 -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white mb-4">确认删除</h3>
          <p class="text-apple-gray-text-secondary dark:text-gray-400 mb-6">
            你确定要删除分组 "{{ groupToDelete?.name }}" 吗？此操作将同时删除分组内的所有笔记，且不可撤销。
          </p>
          <div class="flex justify-end space-x-3">
            <button @click="cancelDelete" class="btn-secondary">
              取消
            </button>
            <button 
              @click="deleteGroup" 
              class="bg-red-600 hover:bg-red-700 text-white font-medium rounded-full px-5 py-2.5 transition-colors"
              :disabled="deleteLoading"
            >
              <span v-if="deleteLoading">删除中...</span>
              <span v-else>删除</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNoteStore } from '@/store/note'

const noteStore = useNoteStore()

const loading = ref(true)
const saveLoading = ref(false)
const deleteLoading = ref(false)
const showGroupModal = ref(false)
const showDeleteConfirm = ref(false)
const showErrorModal = ref(false)
const formError = ref('')
const isEditMode = ref(false)
const groupToDelete = ref(null)
const groupForm = ref({
  id: null,
  name: '',
  description: ''
})

// 分组列表
const groups = ref([])

// 初始化
onMounted(async () => {
  try {
    groups.value = await noteStore.fetchGroups()
  } catch (error) {
    console.error('加载分组失败:', error)
  } finally {
    loading.value = false
  }
})

// 打开创建分组对话框
const openCreateGroupModal = () => {
  isEditMode.value = false
  groupForm.value = {
    id: null,
    name: '',
    description: ''
  }
  formError.value = ''
  showGroupModal.value = true
}

// 打开编辑分组对话框
const openEditGroupModal = (group) => {
  isEditMode.value = true
  groupForm.value = {
    id: group.id,
    name: group.name,
    description: group.description || ''
  }
  formError.value = ''
  showGroupModal.value = true
}

// 关闭分组对话框
const closeGroupModal = () => {
  showGroupModal.value = false
  formError.value = ''
}

// 保存分组
const saveGroup = async () => {
  if (saveLoading.value) return
  
  // 表单验证
  if (!groupForm.value.name.trim()) {
    formError.value = '请输入分组名称'
    return
  }
  
  saveLoading.value = true
  
  try {
    // 保存分组
    const result = await noteStore.saveGroup({
      id: groupForm.value.id,
      name: groupForm.value.name.trim(),
      description: groupForm.value.description.trim()
    })
    
    // 更新列表
    if (!isEditMode.value) {
      // 如果是新建，添加到列表开头
      groups.value = [result, ...groups.value]
    } else {
      // 如果是编辑，更新列表中的项
      const index = groups.value.findIndex(g => g.id === result.id)
      if (index !== -1) {
        groups.value[index] = result
      }
    }
    
    // 关闭对话框
    closeGroupModal()
  } catch (error) {
    console.error('保存分组失败:', error)
    
    // 显示错误信息
    if (error.response?.data?.detail) {
      formError.value = error.response.data.detail
    } else if (error.response?.data?.message) {
      formError.value = error.response.data.message
    } else {
      formError.value = '保存分组失败，请稍后重试'
      showErrorModal.value = true
      closeGroupModal()
    }
  } finally {
    saveLoading.value = false
  }
}

// 确认删除分组
const confirmDeleteGroup = (group) => {
  groupToDelete.value = group
  showDeleteConfirm.value = true
}

// 取消删除
const cancelDelete = () => {
  groupToDelete.value = null
  showDeleteConfirm.value = false
}

// 删除分组
const deleteGroup = async () => {
  if (!groupToDelete.value || deleteLoading.value) return
  deleteLoading.value = true
  
  try {
    await noteStore.removeGroup(groupToDelete.value.id)
    
    // 更新列表
    groups.value = groups.value.filter(g => g.id !== groupToDelete.value.id)
    
    // 关闭对话框
    cancelDelete()
  } catch (error) {
    console.error('删除分组失败:', error)
    alert('删除分组失败，请稍后重试')
  } finally {
    deleteLoading.value = false
  }
}
</script> 
 
 