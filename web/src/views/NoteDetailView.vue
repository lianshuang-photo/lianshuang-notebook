<template>
  <div class="bg-apple-gray-100 dark:bg-gray-900 min-h-screen pt-8 pb-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-10 w-10 text-apple-blue mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-apple-gray-text-secondary dark:text-gray-400">加载笔记中...</p>
      </div>

      <!-- 笔记不存在 -->
      <div v-else-if="!note" class="text-center py-12 content-block">
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

      <!-- 笔记详情 -->
      <div v-else>
        <!-- 笔记头部信息 -->
        <div class="content-block mb-6">
          <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <div class="flex items-center space-x-2">
                <span class="bg-apple-blue/10 dark:bg-apple-blue/20 px-2 py-0.5 rounded-full text-xs text-apple-blue dark:text-blue-400">
                  {{ note.group?.name || '未分组' }}
                </span>
                <span class="text-sm text-apple-gray-text-secondary dark:text-gray-400">
                  {{ formatDate(note.updated_at) }} 更新
                </span>
              </div>
              <h1 class="text-2xl font-bold text-apple-gray-text-primary dark:text-white mt-2">
                {{ note.title || '无标题' }}
              </h1>
            </div>
            <div class="flex space-x-3">
              <button 
                @click="getSummary" 
                class="btn-secondary flex items-center"
                :disabled="aiLoading"
              >
                <span v-if="aiLoading">摘要生成中...</span>
                <span v-else>AI摘要</span>
              </button>
              <router-link :to="`/notes/${note.id}/edit`" class="btn-primary flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                编辑
              </router-link>
            </div>
          </div>

          <!-- AI摘要 -->
          <div v-if="noteSummary" class="mt-6 bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20 dark:border-apple-blue/30 rounded-xl p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 pt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-apple-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-apple-blue dark:text-blue-400">AI摘要</h3>
                <div class="mt-1 text-sm text-apple-gray-text-primary dark:text-gray-300">
                  <MarkdownRenderer :content="noteSummary" />
                </div>
              </div>
              <button @click="noteSummary = null" class="flex-shrink-0 text-apple-blue hover:text-apple-blue/80">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 笔记内容 -->
        <div class="content-block mb-6">
          <div class="markdown-content px-6 py-4">
            <MarkdownRenderer :content="note.content" />
          </div>
        </div>

        <!-- AI问答 -->
        <div class="content-block">
          <div class="px-6 py-4 border-b border-apple-gray-border-secondary dark:border-gray-700">
            <h2 class="text-lg font-medium text-apple-gray-text-primary dark:text-white">向AI提问</h2>
            <p class="mt-1 text-sm text-apple-gray-text-secondary dark:text-gray-400">
              根据笔记内容提问，AI将为您解答
            </p>
          </div>
          
          <div class="p-6">
            <!-- 问答历史 -->
            <div v-if="aiQuestions.length > 0" class="mb-6">
              <div v-for="(qa, index) in aiQuestions" :key="index" class="mb-4">
                <div class="flex items-start mb-2">
                  <div class="flex-shrink-0 bg-apple-gray-background-light dark:bg-gray-700 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="ml-3 bg-apple-gray-background-light dark:bg-gray-700 rounded-xl px-4 py-2 text-apple-gray-text-primary dark:text-gray-300">
                    {{ qa.question }}
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-blue dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div class="ml-3 bg-apple-blue/5 dark:bg-apple-blue/10 rounded-xl px-4 py-2 text-apple-gray-text-primary dark:text-gray-300">
                    <MarkdownRenderer :content="qa.answer" />
                  </div>
                </div>
              </div>
              
              <div class="border-t border-apple-gray-border-secondary dark:border-gray-800 pt-4 mt-4"></div>
            </div>
            
            <!-- 提问表单 -->
            <div class="flex items-start space-x-3">
              <div class="flex-grow">
                <textarea 
                  v-model="question" 
                  placeholder="输入你的问题..." 
                  rows="2" 
                  class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                  :disabled="aiLoading"
                ></textarea>
              </div>
              <button 
                @click="askQuestion" 
                class="btn-primary"
                :disabled="aiLoading || !question.trim()"
              >
                <span v-if="aiLoading">处理中...</span>
                <span v-else>提问</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoteStore } from '@/store/note'
import { useAIStore } from '@/store/ai'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import hljs from 'highlight.js'

const route = useRoute()
const router = useRouter()
const noteStore = useNoteStore()
const aiStore = useAIStore()

const loading = ref(true)
const aiLoading = ref(false)
const note = ref(null)
const noteSummary = ref(null)
const question = ref('')
const aiQuestions = ref([])
const conversation = ref(null)

// 初始化
onMounted(async () => {
  loading.value = true
  try {
    const noteId = route.params.id
    note.value = await noteStore.fetchNote(noteId)
  } catch (error) {
    console.error('加载笔记失败:', error)
    note.value = null
  } finally {
    loading.value = false
  }
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取AI摘要
const getSummary = async () => {
  if (!note.value || aiLoading.value) return
  
  aiLoading.value = true
  
  try {
    const summary = await aiStore.getSummary(note.value.id)
    noteSummary.value = summary
    
    // 保存会话ID，用于后续问答
    if (aiStore.currentConversation) {
      conversation.value = aiStore.currentConversation.id
    }
  } catch (error) {
    console.error('获取摘要失败:', error)
    alert('获取摘要失败，请稍后重试')
  } finally {
    aiLoading.value = false
  }
}

// 向AI提问
const askQuestion = async () => {
  if (!note.value || aiLoading.value || !question.value.trim()) return
  
  aiLoading.value = true
  const currentQuestion = question.value
  
  try {
    const answer = await aiStore.askQuestion(note.value.id, currentQuestion, conversation.value)
    
    // 添加到问答历史
    aiQuestions.value.push({
      question: currentQuestion,
      answer
    })
    
    // 更新会话ID
    if (aiStore.currentConversation) {
      conversation.value = aiStore.currentConversation.id
    }
    
    // 清空问题
    question.value = ''
  } catch (error) {
    console.error('提问失败:', error)
    alert('提问失败，请稍后重试')
  } finally {
    aiLoading.value = false
  }
}
</script> 