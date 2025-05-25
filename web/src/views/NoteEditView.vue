<template>
  <div class="bg-apple-gray-100 dark:bg-gray-900 min-h-screen pt-8 pb-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      <!-- 加载状态 -->
      <div v-if="loading && !isNewNote" class="text-center py-12">
        <svg class="animate-spin h-10 w-10 text-apple-blue mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-apple-gray-text-secondary dark:text-gray-400">加载笔记中...</p>
      </div>

      <!-- 笔记不存在 -->
      <div v-else-if="!isNewNote && !noteData" class="text-center py-12 content-block">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-apple-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-apple-gray-text-primary dark:text-white">笔记不存在</h3>
        <p class="mt-1 text-apple-gray-text-secondary dark:text-gray-400">
          没有找到该笔记，可能已被删除或您没有权限访问。
        </p>
        <div class="mt-6">
          <router-link to="/notes" class="btn-primary">
            返回笔记列表
          </router-link>
        </div>
      </div>

      <!-- 编辑器 -->
      <div v-else>
        <form @submit.prevent="saveNote" class="content-block">
          <!-- 标题栏 -->
          <div class="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div class="flex-1">
              <input 
                type="text" 
                v-model="noteData.title" 
                placeholder="笔记标题" 
                class="input w-full text-xl font-bold bg-apple-gray-background-light dark:bg-gray-700"
              >
            </div>
            <div class="flex space-x-3">
              <button 
                type="button"
                @click="cancelEdit" 
                class="btn-secondary"
              >
                取消
              </button>
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="saving"
              >
                <span v-if="saving">保存中...</span>
                <span v-else>保存</span>
              </button>
            </div>
          </div>

          <!-- 分组选择 -->
          <div class="mb-6">
            <label class="form-label">
              选择分组
            </label>
            <select 
              v-model="noteData.group" 
              class="input w-full sm:w-64 bg-apple-gray-background-light dark:bg-gray-700"
            >
              <option 
                v-for="group in groups" 
                :key="group.id" 
                :value="group.id"
              >
                {{ group.name }}
              </option>
            </select>
          </div>

          <!-- 编辑器工具栏 -->
          <div class="bg-white dark:bg-gray-800 border border-apple-gray-border-secondary dark:border-gray-700 rounded-t-xl p-2 flex flex-wrap gap-2">
            <button 
              type="button"
              @click="insertMarkdown('bold')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="加粗"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.28 11.83c.48-.15.87-.46 1.12-.95.3-.54.36-1.18.19-1.95-.21-.9-.71-1.45-1.5-1.68-.35-.1-.78-.14-1.28-.14h-2.5V2.7c0-.4-.33-.7-.7-.7h-.87c-.4 0-.7.3-.7.7v12.56c0 .4.3.74.7.74h4.34c.44 0 .89-.05 1.35-.16.85-.22 1.46-.67 1.83-1.36.36-.68.44-1.47.24-2.37-.2-.9-.7-1.48-1.22-1.74v-.03c-.1-.04-.2-.08-.3-.1zm-2.5-2.8h1.57c.38 0 .66.08.85.23.2.15.3.4.32.72 0 .37-.1.67-.3.87-.2.22-.53.3-.97.26h-1.47V9.02zm2.2 5.5c-.22.22-.57.34-1.05.34h-1.15v-2.97h1.23c.55 0 .93.1 1.14.3.2.2.29.55.25 1.04-.05.75-.3 1.08-.42 1.3z" />
              </svg>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('italic')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="斜体"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.43 8l-.88-3.3c-.1-.33-.36-.5-.7-.5h-1.8c-.32 0-.6.27-.6.65 0 .33.27.65.6.65h1.12l-.87 3.3-1.38 5c-.1.33-.36.5-.7.5H5.83c-.33 0-.6.27-.6.65 0 .32.27.65.6.65h5.9c.32 0 .6-.33.6-.65 0-.38-.28-.65-.6-.65h-1.14l.88-3.3 1.37-5c.1-.33.36-.5.7-.5h1.43c.33 0 .6-.32.6-.65 0-.38-.27-.65-.6-.65h-1.85c-.32 0-.6.27-.6.65l.02.3z" />
              </svg>
            </button>
            
            <div class="w-px h-6 bg-apple-gray-border-secondary mx-1"></div>
            
            <button 
              type="button"
              @click="insertMarkdown('h1')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="一级标题"
            >
              <span class="text-apple-gray-text-secondary font-bold">H1</span>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('h2')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="二级标题"
            >
              <span class="text-apple-gray-text-secondary font-bold">H2</span>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('h3')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="三级标题"
            >
              <span class="text-apple-gray-text-secondary font-bold">H3</span>
            </button>
            
            <div class="w-px h-6 bg-apple-gray-border-secondary mx-1"></div>
            
            <button 
              type="button"
              @click="insertMarkdown('link')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="链接"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('image')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="图片"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('code')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="代码"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div class="w-px h-6 bg-apple-gray-border-secondary mx-1"></div>
            
            <button 
              type="button"
              @click="insertMarkdown('ul')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="无序列表"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('ol')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="有序列表"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0015.5 2h-11zM7 5a1 1 0 011 1v1a1 1 0 11-2 0V6a1 1 0 011-1zm3 1a1 1 0 10-2 0v1a1 1 0 102 0V6zm2-1a1 1 0 011 1v1a1 1 0 11-2 0V6a1 1 0 011-1zm3 1a1 1 0 10-2 0v1a1 1 0 102 0V6zM7 9a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm3 1a1 1 0 10-2 0v1a1 1 0 102 0v-1zm2-1a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm3 1a1 1 0 10-2 0v1a1 1 0 102 0v-1zM7 13a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm3 1a1 1 0 10-2 0v1a1 1 0 102 0v-1zm2-1a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm3 1a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('task')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="任务列表"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div class="w-px h-6 bg-apple-gray-border-secondary mx-1"></div>
            
            <button 
              type="button"
              @click="insertMarkdown('table')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="表格"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('blockquote')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="引用"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button 
              type="button"
              @click="insertMarkdown('hr')" 
              class="p-1.5 rounded hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
              title="分割线"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <!-- 内容编辑区 -->
          <div class="bg-apple-gray-background-light dark:bg-gray-700 border border-t-0 border-apple-gray-border-secondary dark:border-gray-700 rounded-b-xl p-2">
            <textarea 
              v-model="noteData.content"
              ref="markdownEditor"
              class="w-full min-h-[300px] p-4 bg-transparent text-apple-gray-text-primary dark:text-white resize-y focus:outline-none font-mono"
              placeholder="在这里输入内容，支持Markdown格式..."
            ></textarea>
          </div>
        </form>

        <!-- 预览区 -->
        <div class="content-block mt-6">
          <h2 class="mb-4">预览</h2>
          <div class="markdown-content bg-white dark:bg-gray-800 p-6 rounded-xl border border-apple-gray-border-secondary dark:border-gray-700">
            <MarkdownRenderer :content="noteData.content" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoteStore } from '@/store/note'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import hljs from 'highlight.js'

const route = useRoute()
const router = useRouter()
const noteStore = useNoteStore()

const loading = ref(true)
const saving = ref(false)
const markdownEditor = ref(null)
const noteData = ref({
  id: null,
  title: '',
  content: '',
  group: null
})

// 判断是新建笔记还是编辑现有笔记
const isNewNote = computed(() => !route.params.id)

// 获取所有分组
const groups = computed(() => noteStore.groups)

// 初始化
onMounted(async () => {
  try {
    // 加载分组列表
    await noteStore.fetchGroups()
    
    if (!isNewNote.value) {
      // 编辑现有笔记
      const noteId = route.params.id
      const note = await noteStore.fetchNote(noteId)
      
      if (note) {
        noteData.value = {
          id: note.id,
          title: note.title || '',
          content: note.content || '',
          group: note.group?.id || null
        }
      }
    } else {
      // 新建笔记，设置默认分组
      if (noteStore.groups.length > 0) {
        noteData.value.group = noteStore.groups[0].id
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})

// 保存笔记
const saveNote = async () => {
  if (saving.value) return
  
  saving.value = true
  
  try {
    // 验证表单
    if (!noteData.value.title.trim()) {
      noteData.value.title = '无标题笔记'
    }
    
    if (!noteData.value.group) {
      alert('请选择笔记分组')
      saving.value = false
      return
    }
    
    console.log('准备保存笔记:', JSON.stringify(noteData.value))
    
    // 保存笔记
    const savedNote = await noteStore.saveNote({
      id: noteData.value.id,
      title: noteData.value.title, 
      content: noteData.value.content,
      group: noteData.value.group
    })
    
    // 跳转到笔记详情页
    router.push(`/notes/${savedNote.id}`)
  } catch (error) {
    console.error('保存笔记失败:', error.response?.data || error)
    let errorMsg = '保存笔记失败，请稍后重试'
    
    if (error.response && error.response.data) {
      const errData = error.response.data
      if (typeof errData === 'object') {
        errorMsg = Object.entries(errData)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
      } else if (typeof errData === 'string') {
        errorMsg = errData
      }
    }
    
    alert('保存笔记失败: ' + errorMsg)
  } finally {
    saving.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  if (isNewNote.value) {
    router.push('/notes')
  } else {
    router.push(`/notes/${noteData.value.id}`)
  }
}

// 在编辑器中插入Markdown语法
const insertMarkdown = (type) => {
  if (!markdownEditor.value) return
  
  const editor = markdownEditor.value
  const { selectionStart, selectionEnd } = editor
  const selectedText = noteData.value.content.substring(selectionStart, selectionEnd)
  
  let markdown = ''
  let cursorPos = 0
  
  switch (type) {
    case 'bold':
      markdown = `**${selectedText || '加粗文本'}**`
      cursorPos = selectionStart + 2
      break
    case 'italic':
      markdown = `*${selectedText || '斜体文本'}*`
      cursorPos = selectionStart + 1
      break
    case 'h1':
      markdown = `# ${selectedText || '一级标题'}`
      cursorPos = selectionStart + 2
      break
    case 'h2':
      markdown = `## ${selectedText || '二级标题'}`
      cursorPos = selectionStart + 3
      break
    case 'h3':
      markdown = `### ${selectedText || '三级标题'}`
      cursorPos = selectionStart + 4
      break
    case 'link':
      markdown = `[${selectedText || '链接文本'}](https://example.com)`
      cursorPos = selectionStart + 1
      break
    case 'image':
      markdown = `![${selectedText || '图片描述'}](https://example.com/image.jpg)`
      cursorPos = selectionStart + 2
      break
    case 'code':
      markdown = "```\n" + (selectedText || '代码块') + "\n```"
      cursorPos = selectionStart + 4
      break
    case 'ul':
      markdown = `- ${selectedText || '列表项'}`
      cursorPos = selectionStart + 2
      break
    case 'ol':
      markdown = `1. ${selectedText || '列表项'}`
      cursorPos = selectionStart + 3
      break
    case 'task':
      markdown = `- [ ] ${selectedText || '任务'}`
      cursorPos = selectionStart + 6
      break
    case 'blockquote':
      markdown = `> ${selectedText || '引用内容'}`
      cursorPos = selectionStart + 2
      break
    case 'hr':
      markdown = `\n---\n`
      cursorPos = selectionStart + 5
      break
    case 'table':
      markdown = `| 标题1 | 标题2 | 标题3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |`
      cursorPos = selectionStart + 2
      break
  }
  
  // 更新内容
  noteData.value.content = 
    noteData.value.content.substring(0, selectionStart) + 
    markdown + 
    noteData.value.content.substring(selectionEnd)
  
  // 设置光标位置
  nextTick(() => {
    if (!markdownEditor.value) return
    
    editor.focus()
    
    if (selectedText) {
      editor.setSelectionRange(selectionStart, selectionStart + markdown.length)
    } else {
      const newCursorPos = type === 'code' || type === 'hr' || type === 'table' ? 
        selectionStart + markdown.length : 
        cursorPos
      editor.setSelectionRange(newCursorPos, newCursorPos + (selectedText.length || 
        (type === 'bold' ? 6 : 
         type === 'italic' ? 5 : 
         type === 'h1' ? 5 :
         type === 'h2' ? 6 :
         type === 'h3' ? 7 :
         type === 'link' ? 8 :
         type === 'image' ? 10 :
         type === 'code' ? 4 :
         type === 'ul' ? 5 :
         type === 'ol' ? 5 :
         type === 'task' ? 3 :
         type === 'blockquote' ? 7 : 0)))
    }
  })
}
</script> 