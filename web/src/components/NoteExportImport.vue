<template>
  <div class="flex space-x-2">
    <!-- 导出按钮 -->
    <div class="relative" ref="exportContainer" v-if="note">
      <button
        @click="toggleExportMenu"
        class="btn-secondary flex items-center"
        aria-haspopup="true"
        :aria-expanded="showExportMenu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        导出
      </button>
      
      <!-- 导出菜单 -->
      <div
        v-if="showExportMenu"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-apple-lg border border-apple-gray-border-secondary dark:border-gray-700 z-10 animate-scaleUp"
      >
        <div class="py-1">
          <button
            @click="exportMarkdown"
            class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-bg-secondary dark:hover:bg-gray-700"
          >
            导出为Markdown (.md)
          </button>
          <button
            @click="exportHTML"
            class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-bg-secondary dark:hover:bg-gray-700"
          >
            导出为HTML (.html)
          </button>
          <button
            @click="exportPDF"
            class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-bg-secondary dark:hover:bg-gray-700"
          >
            导出为PDF (.pdf)
          </button>
          <button
            @click="exportAPI('json')"
            class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-bg-secondary dark:hover:bg-gray-700"
          >
            导出为JSON (.json)
          </button>
          <button
            @click="exportAPI('txt')"
            class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-bg-secondary dark:hover:bg-gray-700"
          >
            导出为纯文本 (.txt)
          </button>
        </div>
      </div>
    </div>
    
    <!-- 批量导出按钮 -->
    <div class="relative" ref="bulkExportContainer" v-if="selectedNotes && selectedNotes.length > 0">
      <button
        @click="toggleBulkExportMenu"
        class="btn-secondary flex items-center"
        aria-haspopup="true"
        :aria-expanded="showBulkExportMenu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        批量导出 ({{ selectedNotes.length }})
      </button>
      
      <!-- 批量导出菜单 -->
      <div
        v-if="showBulkExportMenu"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-apple-lg border border-apple-gray-border-secondary dark:border-gray-700 z-10 animate-scaleUp"
      >
        <div class="py-1">
          <button
            @click="bulkExport('json')"
            class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-bg-secondary dark:hover:bg-gray-700"
          >
            导出为JSON (.json)
          </button>
          <button
            @click="bulkExport('csv')"
            class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-bg-secondary dark:hover:bg-gray-700"
          >
            导出为CSV (.csv)
          </button>
          <button
            @click="bulkExport('zip')"
            class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-bg-secondary dark:hover:bg-gray-700"
          >
            导出为ZIP包 (.zip)
          </button>
        </div>
      </div>
    </div>
    
    <!-- 导入按钮 -->
    <button
      @click="openImportDialog"
      class="btn-secondary flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      导入
    </button>
    
    <!-- 文件输入（隐藏） -->
    <input
      ref="fileInput"
      type="file"
      @change="handleFileImport"
      accept=".md,.txt,.json,.html,.htm,.csv"
      multiple
      class="hidden"
    />
    
    <!-- 导入对话框 -->
    <div
      v-if="showImportDialog"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 fade-in"
      @click.self="showImportDialog = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-apple-xl max-w-2xl w-full p-6 scale-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white">
            导入笔记
          </h3>
          <button @click="showImportDialog = false" class="text-apple-gray-text-secondary dark:text-gray-400 hover:text-apple-gray-text-primary dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-apple-gray-text-secondary dark:text-gray-400 mb-2">
            支持导入以下格式的文件：
          </p>
          <ul class="list-disc list-inside text-sm text-apple-gray-text-secondary dark:text-gray-400">
            <li>Markdown (.md)</li>
            <li>文本文件 (.txt)</li>
            <li>HTML (.html, .htm)</li>
            <li>JSON (.json) - 支持标准格式、Jupyter Notebook和印象笔记格式</li>
          </ul>
        </div>
        
        <div class="border-2 border-dashed border-apple-gray-border-secondary dark:border-gray-700 rounded-xl p-6 text-center mb-6">
          <div class="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-apple-gray-text-secondary dark:text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="text-apple-gray-text-primary dark:text-white font-medium mb-1">
              拖放文件到此处或点击选择文件
            </p>
            <p class="text-sm text-apple-gray-text-secondary dark:text-gray-400">
              支持多个文件同时导入
            </p>
          </div>
          <button @click="$refs.fileInput.click()" class="btn-primary mt-4">
            选择文件
          </button>
        </div>
        
        <!-- 已选文件列表 -->
        <div v-if="importFiles.length > 0" class="mb-6">
          <h4 class="text-sm font-medium text-apple-gray-text-primary dark:text-white mb-2">
            已选择 {{ importFiles.length }} 个文件
          </h4>
          <div class="max-h-40 overflow-y-auto border border-apple-gray-border-secondary dark:border-gray-700 rounded-xl">
            <div
              v-for="(file, index) in importFiles"
              :key="index"
              class="flex items-center justify-between px-3 py-2 border-b last:border-b-0 border-apple-gray-border-secondary dark:border-gray-700"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-apple-gray-text-primary dark:text-white truncate max-w-xs">
                  {{ file.name }}
                </span>
              </div>
              <button @click="removeFile(index)" class="text-apple-gray-text-secondary dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button @click="showImportDialog = false" class="btn-secondary">
            取消
          </button>
          <button
            @click="processImport"
            class="btn-primary"
            :disabled="importFiles.length === 0 || importLoading"
          >
            <span v-if="importLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              导入中...
            </span>
            <span v-else>导入 {{ importFiles.length }} 个笔记</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 导入结果对话框 -->
    <div
      v-if="showImportResult"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 fade-in"
      @click.self="showImportResult = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-apple-xl max-w-2xl w-full p-6 scale-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white">
            导入结果
          </h3>
          <button @click="showImportResult = false" class="text-apple-gray-text-secondary dark:text-gray-400 hover:text-apple-gray-text-primary dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 成功导入 -->
        <div v-if="importResults.success && importResults.success.length > 0" class="mb-4">
          <h4 class="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            成功导入 {{ importResults.success.length }} 个笔记
          </h4>
          <div class="max-h-40 overflow-y-auto border border-apple-gray-border-secondary dark:border-gray-700 rounded-xl">
            <div
              v-for="(note, index) in importResults.success"
              :key="'success-' + index"
              class="px-3 py-2 border-b last:border-b-0 border-apple-gray-border-secondary dark:border-gray-700"
            >
              <div class="text-sm text-apple-gray-text-primary dark:text-white font-medium">
                {{ note.title }}
              </div>
              <div class="text-xs text-apple-gray-text-secondary dark:text-gray-400 mt-1 truncate">
                {{ note.content.substring(0, 100) }}...
              </div>
            </div>
          </div>
        </div>
        
        <!-- 导入失败 -->
        <div v-if="importResults.errors && importResults.errors.length > 0" class="mb-4">
          <h4 class="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ importResults.errors.length }} 个文件导入失败
          </h4>
          <div class="max-h-40 overflow-y-auto border border-apple-gray-border-secondary dark:border-gray-700 rounded-xl">
            <div
              v-for="(error, index) in importResults.errors"
              :key="'error-' + index"
              class="px-3 py-2 border-b last:border-b-0 border-apple-gray-border-secondary dark:border-gray-700"
            >
              <div class="text-sm text-apple-gray-text-primary dark:text-white font-medium">
                {{ error.fileName }}
              </div>
              <div class="text-xs text-red-500 dark:text-red-400 mt-1">
                {{ error.error }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button @click="showImportResult = false" class="btn-primary">
            完成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { useNoteStore } from '@/store/note'
import { 
  exportAsMarkdown, 
  exportAsHTML, 
  exportAsPDF,
  batchImportNotes
} from '@/utils/exportImport'
import { exportNote } from '@/api/note'

const props = defineProps({
  note: {
    type: Object,
    required: false,
    default: null
  },
  contentElement: {
    type: Object,
    default: null
  },
  selectedNotes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['import-success'])

const { showToast } = useToast()
const noteStore = useNoteStore()

// 导出相关
const showExportMenu = ref(false)
const exportContainer = ref(null)
const showBulkExportMenu = ref(false)
const bulkExportContainer = ref(null)

// 导入相关
const fileInput = ref(null)
const showImportDialog = ref(false)
const importFiles = ref([])
const importLoading = ref(false)
const showImportResult = ref(false)
const importResults = ref({ success: [], errors: [] })

// 监听点击事件，关闭导出菜单
const handleClickOutside = (event) => {
  if (exportContainer.value && !exportContainer.value.contains(event.target)) {
    showExportMenu.value = false
  }
  if (bulkExportContainer.value && !bulkExportContainer.value.contains(event.target)) {
    showBulkExportMenu.value = false
  }
}

// 切换导出菜单显示状态
const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value
  if (showExportMenu.value) {
    showBulkExportMenu.value = false
  }
}

// 切换批量导出菜单显示状态
const toggleBulkExportMenu = () => {
  showBulkExportMenu.value = !showBulkExportMenu.value
  if (showBulkExportMenu.value) {
    showExportMenu.value = false
  }
}

// 使用API导出单个笔记
const exportAPI = async (format) => {
  try {
    if (!props.note) return
    
    const response = await exportNote(props.note.id, format)
    const blob = new Blob([response.data], { 
      type: getContentType(format)
    })
    const url = window.URL.createObjectURL(blob)
    
    // 生成文件名
    const fileName = `${props.note.title.replace(/\s+/g, '_')}.${format}`
    
    // 触发下载
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast(`笔记已导出为${format.toUpperCase()}文件`, 'success')
  } catch (error) {
    console.error(`导出${format}失败:`, error)
    showToast('导出失败，请稍后重试', 'error')
  } finally {
    showExportMenu.value = false
  }
}

// 批量导出笔记
const bulkExport = async (format) => {
  try {
    if (!props.selectedNotes || props.selectedNotes.length === 0) return
    
    const noteIds = props.selectedNotes.map(note => note.id).join(',')
    
    await noteStore.exportNotesBulkAction({
      ids: noteIds,
      format: format
    })
    
    showToast(`已成功导出 ${props.selectedNotes.length} 个笔记`, 'success')
  } catch (error) {
    console.error('批量导出失败:', error)
    showToast('批量导出失败，请稍后重试', 'error')
  } finally {
    showBulkExportMenu.value = false
  }
}

// 获取内容类型
const getContentType = (format) => {
  switch (format) {
    case 'json': return 'application/json'
    case 'md': return 'text/markdown'
    case 'txt': return 'text/plain'
    case 'csv': return 'text/csv'
    case 'zip': return 'application/zip'
    default: return 'application/octet-stream'
  }
}

// 导出为Markdown
const exportMarkdown = () => {
  try {
    if (!props.note) return
    exportAsMarkdown(props.note)
    showToast('笔记已导出为Markdown文件', 'success')
  } catch (error) {
    console.error('导出Markdown失败:', error)
    showToast('导出失败，请稍后重试', 'error')
  } finally {
    showExportMenu.value = false
  }
}

// 导出为HTML
const exportHTML = () => {
  try {
    if (!props.note) return
    exportAsHTML(props.note)
    showToast('笔记已导出为HTML文件', 'success')
  } catch (error) {
    console.error('导出HTML失败:', error)
    showToast('导出失败，请稍后重试', 'error')
  } finally {
    showExportMenu.value = false
  }
}

// 导出为PDF
const exportPDF = async () => {
  try {
    if (!props.note || !props.contentElement) {
      throw new Error('找不到笔记内容元素')
    }
    
    await exportAsPDF(props.note, props.contentElement)
    showToast('笔记已导出为PDF文件', 'success')
  } catch (error) {
    console.error('导出PDF失败:', error)
    showToast('导出PDF失败，请稍后重试', 'error')
  } finally {
    showExportMenu.value = false
  }
}

// 打开导入对话框
const openImportDialog = () => {
  importFiles.value = []
  showImportDialog.value = true
}

// 处理文件导入
const handleFileImport = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  
  // 将FileList转换为数组并添加到importFiles
  importFiles.value = [...importFiles.value, ...Array.from(files)]
  
  // 重置文件输入，以便能够重新选择相同的文件
  event.target.value = null
}

// 移除文件
const removeFile = (index) => {
  importFiles.value.splice(index, 1)
}

// 处理导入
const processImport = async () => {
  if (importFiles.value.length === 0) return
  
  importLoading.value = true
  
  try {
    // 解析导入的文件
    const results = await batchImportNotes(importFiles.value)
    importResults.value = results
    
    // 不再自动保存笔记，只处理解析结果
    // 显示导入结果
    showImportDialog.value = false
    showImportResult.value = true
    
    // 触发导入成功事件，将解析后的笔记数据传递给父组件
    if (results.success.length > 0) {
      // 确保content字段是字符串类型
      const processedNotes = results.success.map(noteData => {
        let content = ''
        if (Array.isArray(noteData.content)) {
          content = noteData.content.join('\n')
        } else {
          content = noteData.content || ''
        }
        
        return {
          title: noteData.title || '导入的笔记',
          content: content
        }
      })
      
      // 发送处理后的笔记数据
      emit('import-success', processedNotes)
    }
  } catch (error) {
    console.error('导入处理失败:', error)
    showToast('导入处理失败，请稍后重试', 'error')
  } finally {
    importLoading.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 添加拖放事件监听
  const dropArea = document.querySelector('.border-dashed')
  if (dropArea) {
    const preventDefaults = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const highlight = () => {
      dropArea.classList.add('border-apple-blue', 'dark:border-blue-500')
      dropArea.classList.remove('border-apple-gray-border-secondary', 'dark:border-gray-700')
    }
    
    const unhighlight = () => {
      dropArea.classList.remove('border-apple-blue', 'dark:border-blue-500')
      dropArea.classList.add('border-apple-gray-border-secondary', 'dark:border-gray-700')
    }
    
    const handleDrop = (e) => {
      preventDefaults(e)
      unhighlight()
      
      const dt = e.dataTransfer
      const files = dt.files
      
      if (files && files.length > 0) {
        importFiles.value = [...importFiles.value, ...Array.from(files)]
      }
    }
    
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false)
    })
    
    ;['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })
    
    dropArea.addEventListener('drop', handleDrop, false)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 监听导入对话框状态，重置文件列表
watch(showImportDialog, (newVal) => {
  if (!newVal) {
    importFiles.value = []
  }
})
</script> 