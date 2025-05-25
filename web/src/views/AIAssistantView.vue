<template>
  <div class="flex flex-col h-screen bg-apple-gray-100 dark:bg-gray-900">
    <!-- 导航栏和顶部区域 -->
    <div class="flex-shrink-0 px-4 py-4 sm:px-6 lg:px-8">
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-apple-gray-text-primary dark:text-white">
            AI助手
          </h1>
          <p class="mt-1 text-apple-gray-text-secondary dark:text-gray-400">
            你的智能写作伙伴，可以回答问题、提供建议或帮助写作
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button 
            @click="startNewConversation" 
            class="btn-primary flex items-center"
            :disabled="aiLoading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            新对话
          </button>
          </div>
        </div>
        </div>
      </div>

    <!-- 主内容区域 - 占据所有剩余空间 -->
    <div class="flex-grow px-4 pb-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col">
      <div class="container mx-auto max-w-6xl h-full flex flex-col">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow overflow-hidden">
          <!-- 对话列表 -->
          <div class="lg:col-span-1 flex flex-col overflow-hidden content-block p-0">
            <div class="flex-shrink-0 px-4 py-3 border-b border-apple-gray-border-secondary dark:border-gray-700">
              <h2 class="text-lg font-medium text-apple-gray-text-primary dark:text-white">对话历史</h2>
            </div>
            
            <div v-if="loading" class="p-4 text-center text-apple-gray-text-secondary dark:text-gray-400">
              加载中...
            </div>
            
            <div v-else-if="conversations.length === 0" class="p-4 text-center text-apple-gray-text-secondary dark:text-gray-400">
              暂无对话历史
            </div>
            
            <div v-else class="flex-grow overflow-y-auto">
              <ul class="divide-y divide-apple-gray-border-secondary dark:divide-gray-700">
                <li 
                  v-for="conversation in conversations" 
                  :key="conversation.id" 
                  class="hover:bg-apple-gray-background-light dark:hover:bg-gray-700 cursor-pointer relative group"
                  :class="{ 'bg-apple-gray-background-light dark:bg-gray-700': currentConversation?.id === conversation.id }"
                >
                  <div class="p-4" @click="selectConversation(conversation)">
                    <div class="flex items-center justify-between mb-1">
                      <h3 class="text-sm font-medium text-apple-gray-text-primary dark:text-white truncate pr-2">
                      {{ conversation.title || '新对话' }}
                    </h3>
                      
                      <!-- 对话类型标签 -->
                      <span 
                        class="text-xs px-1.5 py-0.5 rounded-full"
                        :class="getConversationTypeClass(conversation.conversation_type)"
                      >
                        {{ conversation.conversation_type_display || getConversationTypeText(conversation.conversation_type) }}
                      </span>
                    </div>
                    
                    <p class="text-xs text-apple-gray-text-secondary dark:text-gray-400 mt-1">
                      {{ formatDate(conversation.created_at) }}
                    </p>
                  </div>
                  
                  <!-- 操作菜单 -->
                  <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="relative">
                      <button 
                        @click.stop="toggleMenu(conversation.id)"
                        class="p-1.5 text-apple-gray-text-secondary dark:text-gray-400 hover:bg-apple-gray-background-secondary dark:hover:bg-gray-600 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      <!-- 下拉菜单 -->
                      <div 
                        v-if="activeMenu === conversation.id"
                        class="absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
                      >
                        <div class="py-1" role="menu" aria-orientation="vertical">
                          <button 
                            @click.stop="clearMessages(conversation.id)"
                            class="w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-gray-300 hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
                            role="menuitem"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            清空消息
                          </button>
                          <button 
                            @click.stop="deleteConversation(conversation.id)"
                            class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
                            role="menuitem"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            删除对话
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
          </div>
        </div>

        <!-- 对话区域 -->
          <div class="lg:col-span-3 flex flex-col overflow-hidden content-block p-0">
            <!-- 对话标题 -->
            <div class="flex-shrink-0 px-6 py-3 border-b border-apple-gray-border-secondary dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <!-- 对话类型图标 -->
                  <div v-if="currentConversation" class="mr-2">
                    <span v-if="currentConversation.conversation_type === 'chat'" class="h-6 w-6 flex items-center justify-center text-blue-500 dark:text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </span>
                    <span v-else-if="currentConversation.conversation_type === 'qa'" class="h-6 w-6 flex items-center justify-center text-green-500 dark:text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span v-else-if="currentConversation.conversation_type === 'summary'" class="h-6 w-6 flex items-center justify-center text-purple-500 dark:text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span v-else-if="currentConversation.conversation_type === 'analysis'" class="h-6 w-6 flex items-center justify-center text-amber-500 dark:text-amber-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span v-else class="h-6 w-6 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                      </svg>
                    </span>
                  </div>
                  
              <h2 class="text-lg font-medium text-apple-gray-text-primary dark:text-white">
                {{ currentConversation?.title || '新对话' }}
              </h2>
                </div>
                
                <!-- 对话类型标签 -->
                <span 
                  v-if="currentConversation"
                  class="text-xs px-2 py-1 rounded-full"
                  :class="getConversationTypeClass(currentConversation.conversation_type)"
                >
                  {{ currentConversation.conversation_type_display || getConversationTypeText(currentConversation.conversation_type) }}
                </span>
              </div>
            </div>
            
            <!-- 消息区域 -->
            <div class="flex-grow overflow-y-auto p-4 md:p-6" ref="messageContainer">
              <div v-if="!currentConversation && !aiLoading" class="h-full flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-apple-blue/30 dark:text-apple-blue/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white">开始新对话</h3>
                <p class="text-apple-gray-text-secondary dark:text-gray-400 mt-2 max-w-md">
                  AI助手可以帮助你回答问题、提供写作建议或讨论任何话题。
                </p>
              </div>
              
              <div v-else class="space-y-6">
                <!-- 对话消息 -->
                <div v-for="(message, index) in messages" :key="index" class="group relative">
                  <!-- 用户消息 -->
                  <div v-if="message.type === 'user'" class="flex items-start justify-end">
                    <div class="bg-apple-blue/10 dark:bg-apple-blue/20 rounded-xl px-4 py-2 max-w-md relative">
                    <!-- 用户消息删除按钮 -->
                    <button 
                      v-if="message.id && !aiLoading"
                      @click="deleteMessage(message.id)"
                        class="absolute left-2 top-2 p-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                      
                      <p class="text-apple-gray-text-primary dark:text-gray-200 break-words">{{ message.content }}</p>
                    </div>
                    <div class="ml-2 rounded-full bg-apple-blue/20 dark:bg-apple-blue/30 h-8 w-8 flex items-center justify-center">
                      <span class="text-apple-blue dark:text-blue-400 text-sm">你</span>
                    </div>
                  </div>
                  
                  <!-- AI消息 -->
                  <div v-else class="flex items-start">
                    <div class="mr-2 rounded-full bg-apple-gray-background-light dark:bg-gray-700 h-8 w-8 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="bg-apple-gray-background-light dark:bg-gray-700 rounded-xl px-4 py-2 max-w-md overflow-x-auto relative">
                    <!-- AI消息删除按钮 -->
                    <button 
                      v-if="message.id && !aiLoading"
                      @click="deleteMessage(message.id)"
                        class="absolute right-2 top-2 p-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                      
                      <div class="text-apple-gray-text-primary dark:text-gray-300 markdown-body" v-html="renderMarkdown(message.content)"></div>
                    </div>
                  </div>
                </div>
                
                <!-- 流式加载状态 -->
                <div v-if="aiLoading" class="flex items-start">
                  <div class="mr-2 rounded-full bg-apple-gray-background-light dark:bg-gray-700 h-8 w-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="bg-apple-gray-background-light dark:bg-gray-700 rounded-xl px-4 py-2 max-w-md overflow-x-auto">
                    <div v-if="streamContent">
                      <div class="text-apple-gray-text-primary dark:text-gray-300 markdown-body" v-html="renderMarkdown(streamContent)"></div>
                    </div>
                    <div v-else class="flex items-center space-x-1.5">
                      <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce"></div>
                      <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.2s"></div>
                      <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.4s"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 输入区域 -->
            <div class="flex-shrink-0 p-3 border-t border-apple-gray-border-secondary dark:border-gray-700">
              <form @submit.prevent="sendMessage" class="flex flex-col space-y-2">
                <div class="relative">
                <textarea 
                  v-model="newMessage" 
                  rows="1"
                  placeholder="输入消息..." 
                    class="input w-full py-2 min-h-[44px] max-h-32 resize-none bg-apple-gray-background-light dark:bg-gray-700"
                  :disabled="aiLoading || !currentConversation"
                  @keydown.enter.exact.prevent="sendMessage"
                  ref="messageInput"
                ></textarea>
                  
                  <!-- 引用笔记按钮 -->
                  <button 
                    type="button"
                    id="reference-note-button"
                    @click.stop="showNoteSelector = !showNoteSelector"
                    class="absolute bottom-2 right-2 text-apple-gray-text-secondary dark:text-gray-400 hover:text-apple-gray-text-primary dark:hover:text-gray-300 p-1 rounded-md"
                    :disabled="aiLoading || !currentConversation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
                
                <div class="flex justify-end">
                <button 
                  type="submit" 
                    class="btn-primary flex items-center"
                  :disabled="aiLoading || !newMessage.trim() || !currentConversation"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                    发送
                </button>
                </div>
              </form>
              
              <!-- 笔记选择器弹窗 -->
              <div 
                v-if="showNoteSelector" 
                id="note-selector"
                class="absolute bottom-16 right-4 w-72 max-h-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-apple-gray-border-primary dark:border-gray-600 overflow-hidden z-10"
              >
                <div class="p-2 border-b border-apple-gray-border-secondary dark:border-gray-700">
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="text-sm font-medium text-apple-gray-text-primary dark:text-white">选择要引用的笔记</h3>
                    <button 
                      @click.stop="closeNoteSelector"
                      class="text-apple-gray-text-secondary dark:text-gray-400 hover:text-apple-gray-text-primary dark:hover:text-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
            </div>
                  
                  <input 
                    v-model="searchNoteQuery"
                    type="text"
                    placeholder="搜索笔记..."
                    class="input w-full py-1 px-2 text-sm bg-apple-gray-background-light dark:bg-gray-700"
                  />
          </div>
                
                <div class="overflow-y-auto max-h-60">
                  <div v-if="filteredNotes.length === 0" class="p-4 text-center text-apple-gray-text-secondary dark:text-gray-400 text-sm">
                    未找到笔记
                  </div>
                  
                  <ul v-else class="divide-y divide-apple-gray-border-secondary dark:divide-gray-700">
                    <li 
                      v-for="note in filteredNotes" 
                      :key="note.id" 
                      @click.stop="referenceNote(note)"
                      class="p-2 hover:bg-apple-gray-background-light dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <h4 class="text-sm font-medium text-apple-gray-text-primary dark:text-white truncate">
                        {{ note.title }}
                      </h4>
                      <p class="text-xs text-apple-gray-text-secondary dark:text-gray-400 truncate">
                        {{ note.content ? (note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '')) : '无内容' }}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useAIStore } from '@/store/ai'
import { useNoteStore } from '@/store/note'
import { useUserPreferenceStore } from '@/store/userPreference'
import { useToast } from '@/composables/useToast'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // 引入代码高亮样式

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs relative group"><div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">' +
          '<button class="code-copy-btn bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded" ' +
          'onclick="navigator.clipboard.writeText(this.parentNode.parentNode.querySelector(\'code\').textContent).then(() => { ' +
          'this.textContent=\'已复制\'; setTimeout(() => {this.textContent=\'复制\'}, 1500); })">' +
          '复制</button></div><code class="language-' + lang + '">' + 
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + 
          '</code></pre>';
      } catch (error) {
        console.log(error)
      }
    }
    return '<pre class="hljs relative group"><div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">' +
      '<button class="code-copy-btn bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded" ' +
      'onclick="navigator.clipboard.writeText(this.parentNode.parentNode.querySelector(\'code\').textContent).then(() => { ' +
      'this.textContent=\'已复制\'; setTimeout(() => {this.textContent=\'复制\'}, 1500); })">' +
      '复制</button></div><code>' + 
      md.utils.escapeHtml(str) + 
      '</code></pre>';
  }
})

// 增强Markdown渲染能力
md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
  const token = tokens[idx];
  const level = token.markup.length; // # 的数量决定标题等级
  return `<h${level} class="markdown-heading markdown-h${level}">`;
};

md.renderer.rules.heading_close = function(tokens, idx, options, env, self) {
  const token = tokens[idx];
  const level = tokens[idx-2].markup.length; // 获取对应的开始标签中的标题等级
  return `</h${level}>`;
};

// 确保列表正确渲染
md.renderer.rules.bullet_list_open = function() {
  return '<ul class="markdown-list markdown-ul">';
};

md.renderer.rules.ordered_list_open = function() {
  return '<ol class="markdown-list markdown-ol">';
};

const aiStore = useAIStore()
const noteStore = useNoteStore()
const preferenceStore = useUserPreferenceStore()
const { showToast } = useToast()

const loading = ref(true)
const aiLoading = ref(false)
const conversations = ref([])
const currentConversation = ref(null)
const messages = ref([])
const newMessage = ref('')
const messageContainer = ref(null)
const messageInput = ref(null)
const activeMenu = ref(null)
const showNoteSelector = ref(false)
const availableNotes = ref([])
const searchNoteQuery = ref('')
const filteredNotes = ref([])

// 流式响应内容
const streamContent = ref('')
const streamController = ref(null)

// 渲染Markdown
const renderMarkdown = (text) => {
  if (!text) return ''
  return md.render(text)
}

// 获取对话历史
onMounted(async () => {
  try {
    // 检查AI功能是否启用
    await preferenceStore.getUserPreference()
    if (!preferenceStore.enableAI) {
      showToast('AI功能已被禁用，请在设置中启用', 'error')
      return
    }
    
    // 获取对话列表
    conversations.value = await aiStore.fetchConversations()
    
    // 获取可用笔记列表
    try {
      availableNotes.value = await noteStore.fetchNotes()
      filteredNotes.value = [...availableNotes.value]
    } catch (error) {
      console.error('加载笔记列表失败:', error)
    }
    
    // 如果有对话，默认选择最新的一个
    if (conversations.value.length > 0) {
      selectConversation(conversations.value[0])
    } else {
      // 否则创建新对话
      startNewConversation()
    }
  } catch (error) {
    console.error('加载AI对话失败:', error)
    showToast('加载AI对话失败', 'error')
  } finally {
    loading.value = false
  }
  
  // 添加点击外部关闭菜单的事件监听
  document.addEventListener('click', closeMenuOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenuOnClickOutside)
  // 如果存在流式响应控制器，中止它
  if (streamController.value) {
    streamController.value.abort()
  }
})

// 关闭点击外部的菜单
const closeMenuOnClickOutside = (event) => {
  // 判断点击事件是否在笔记选择器外部
  const noteSelector = document.getElementById('note-selector')
  const noteButton = document.getElementById('reference-note-button')
  
  if (noteSelector && !noteSelector.contains(event.target) && 
      noteButton && !noteButton.contains(event.target)) {
    showNoteSelector.value = false
  }
  
  activeMenu.value = null
}

// 监听消息变化，自动滚动到底部
watch(messages, async () => {
  await nextTick()
  scrollToBottom()
})

// 监听流式内容变化，自动滚动到底部
watch(streamContent, async () => {
  await nextTick()
  scrollToBottom()
})

// 滚动到底部
const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// 选择对话
const selectConversation = async (conversation) => {
  if (aiLoading.value || (currentConversation.value?.id === conversation.id)) return
  
  currentConversation.value = conversation
  messages.value = []
  
  try {
    const fullConversation = await aiStore.fetchConversation(conversation.id)
    
    if (fullConversation.messages) {
      messages.value = fullConversation.messages.map(m => ({
        id: m.id,
        type: m.message_type === 'user' ? 'user' : 'ai',
        content: m.content
      }))
    }
    
    // 聚焦输入框
    await nextTick()
    if (messageInput.value) {
      messageInput.value.focus()
    }
  } catch (error) {
    console.error('加载对话详情失败:', error)
    showToast('加载对话详情失败', 'error')
  }
}

// 开始新对话
const startNewConversation = async () => {
  if (aiLoading.value) return
  
  aiLoading.value = true
  
  try {
    const newConv = await aiStore.createConversation({
      title: '新对话',
    })
    
    // 添加到列表
    conversations.value.unshift(newConv)
    
    // 选择新对话
    currentConversation.value = newConv
    messages.value = []
    
    // 发送欢迎消息 - 仅在前端显示，不保存到数据库
    messages.value.push({
      type: 'ai',
      content: '你好！我是LS笔记的AI助手，有什么我可以帮你的吗？'
    })
    
    // 聚焦输入框
    await nextTick()
    if (messageInput.value) {
      messageInput.value.focus()
    }
  } catch (error) {
    console.error('创建新对话失败:', error)
    showToast('创建新对话失败', 'error')
  } finally {
    aiLoading.value = false
  }
}

// 发送消息
const sendMessage = async () => {
  if (aiLoading.value || !newMessage.value.trim() || !currentConversation.value) return
  
  const userMessage = newMessage.value.trim()
  newMessage.value = ''
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: userMessage
  })
  
  aiLoading.value = true
  streamContent.value = ''
  
  // 如果有正在进行的流式请求，中止它
  if (streamController.value) {
    streamController.value.abort()
  }
  
  try {
    // 创建新的AbortController
    streamController.value = new AbortController()
    
    // 发送消息并使用流式获取回复
    await chatWithAIStream(userMessage, currentConversation.value.id, streamController.value.signal)
    
    // 更新对话列表
    const updatedConv = await aiStore.fetchConversation(currentConversation.value.id)
    currentConversation.value = updatedConv
    
    // 更新消息列表，添加ID
    messages.value = updatedConv.messages.map(m => ({
      id: m.id,
      type: m.message_type === 'user' ? 'user' : 'ai',
      content: m.content
    }))
    
    // 更新列表中的对话
    const index = conversations.value.findIndex(c => c.id === updatedConv.id)
    if (index !== -1) {
      conversations.value[index] = updatedConv
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
    console.error('发送消息失败:', error)
    
    // 显示错误消息
    messages.value.push({
      type: 'ai',
      content: '抱歉，我遇到了一些问题，无法回应你的消息。请稍后再试。'
    })
      
      showToast('发送消息失败', 'error')
    }
  } finally {
    // 清理流式响应内容和控制器
    streamContent.value = ''
    streamController.value = null
    aiLoading.value = false
    
    // 聚焦输入框
    await nextTick()
    if (messageInput.value) {
      messageInput.value.focus()
    }
  }
}

// 流式获取AI响应
const chatWithAIStream = async (message, conversationId, signal) => {
  try {
    // 从localStorage获取访问令牌
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('未找到访问令牌，请重新登录');
    }
    
    const response = await fetch(`/api/notes/ai/chat/stream/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId
      }),
      signal // 传递AbortSignal以支持中止请求
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    let done = false
    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      
      if (value) {
        const text = decoder.decode(value, { stream: !done })
        streamContent.value += text
      }
    }
    
    // 完成后将流式内容添加到消息中
    if (streamContent.value) {
      messages.value.push({
        type: 'ai',
        content: streamContent.value
      })
    }
    
    return streamContent.value
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('流式请求已中止')
    } else {
      console.error('流式API请求失败:', error.message);
    }
    throw error
  }
}

// 删除对话
const deleteConversation = async (id) => {
  if (aiLoading.value) return
  
  try {
    await aiStore.deleteConversation(id)
    conversations.value = conversations.value.filter(c => c.id !== id)
    
    if (currentConversation.value && currentConversation.value.id === id) {
      currentConversation.value = null
      messages.value = []
      
      // 如果还有其他对话，选择第一个
      if (conversations.value.length > 0) {
        selectConversation(conversations.value[0])
      }
    }
    
    showToast('对话已删除', 'success')
  } catch (error) {
    console.error('删除对话失败:', error)
    showToast('删除对话失败', 'error')
  }
}

// 删除消息
const deleteMessage = async (messageId) => {
  if (aiLoading.value || !currentConversation.value) return
  
  try {
    await aiStore.deleteMessage(currentConversation.value.id, messageId)
    
    // 更新当前对话
    const updatedConv = await aiStore.fetchConversation(currentConversation.value.id)
    currentConversation.value = updatedConv
    
    // 更新消息列表
    messages.value = updatedConv.messages.map(m => ({
      id: m.id,
      type: m.message_type === 'user' ? 'user' : 'ai',
      content: m.content
    }))
    
    showToast('消息已删除', 'success')
  } catch (error) {
    console.error('删除消息失败:', error)
    showToast('删除消息失败', 'error')
  }
}

// 清空对话消息
const clearMessages = async (conversationId) => {
  if (aiLoading.value) return
  
  try {
    await aiStore.clearConversation(conversationId)
    
    if (currentConversation.value && currentConversation.value.id === conversationId) {
      // 更新当前对话
      const updatedConv = await aiStore.fetchConversation(conversationId)
      currentConversation.value = updatedConv
      messages.value = []
    }
    
    showToast('对话已清空', 'success')
  } catch (error) {
    console.error('清空对话失败:', error)
    showToast('清空对话失败', 'error')
  }
}

// 切换菜单显示状态
const toggleMenu = (conversationId) => {
  if (activeMenu.value === conversationId) {
    activeMenu.value = null
  } else {
    activeMenu.value = conversationId
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取对话类型类名
const getConversationTypeClass = (conversationType) => {
  switch(conversationType) {
    case 'chat':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'qa':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'summary':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    case 'analysis':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    case 'other':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
}

// 获取对话类型文本
const getConversationTypeText = (conversationType) => {
  switch(conversationType) {
    case 'chat':
      return '聊天';
    case 'qa':
      return '问答';
    case 'summary':
      return '摘要';
    case 'analysis':
      return '分析';
    case 'other':
      return '其他';
    default:
      return '聊天';
  }
}

// 筛选笔记
watch(searchNoteQuery, (newQuery) => {
  if (!newQuery.trim()) {
    filteredNotes.value = [...availableNotes.value]
    return
  }
  
  const query = newQuery.toLowerCase().trim()
  filteredNotes.value = availableNotes.value.filter(note => 
    note.title.toLowerCase().includes(query) || 
    (note.content && note.content.toLowerCase().includes(query))
  )
})

// 引用笔记内容
const referenceNote = (note) => {
  // 准备引用格式
  const reference = `> 引用自《${note.title}》\n\n${note.content.substring(0, 300)}${note.content.length > 300 ? '...' : ''}\n\n`
  
  // 将引用添加到当前消息中
  newMessage.value += reference
  
  // 关闭笔记选择器
  showNoteSelector.value = false
  
  // 聚焦输入框
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

// 关闭笔记选择器
const closeNoteSelector = () => {
  showNoteSelector.value = false
  searchNoteQuery.value = ''
}
</script> 

<style>
/* Markdown 样式 */
.markdown-body {
  @apply text-apple-gray-text-primary dark:text-gray-300;
}

.markdown-heading {
  @apply font-bold mb-3 mt-4;
}

.markdown-h1 {
  @apply text-2xl;
}

.markdown-h2 {
  @apply text-xl;
}

.markdown-h3 {
  @apply text-lg;
}

.markdown-h4 {
  @apply text-base;
}

.markdown-h5, .markdown-h6 {
  @apply text-sm;
}

.markdown-body p {
  @apply mb-3;
}

.markdown-list {
  @apply pl-5 mb-3;
}

.markdown-ul {
  @apply list-disc;
}

.markdown-ol {
  @apply list-decimal;
}

.markdown-body ul li, 
.markdown-body ol li {
  @apply mb-1;
}

.markdown-body code {
  @apply px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono;
}

.markdown-body pre {
  @apply p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto mb-3 shadow-sm;
}

.markdown-body pre code {
  @apply bg-transparent p-0 block whitespace-pre text-sm;
}

.markdown-body blockquote {
  @apply pl-3 border-l-4 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 italic mb-3;
}

.markdown-body a {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}

.markdown-body table {
  @apply w-full border-collapse mb-3;
}

.markdown-body table th,
.markdown-body table td {
  @apply border border-gray-300 dark:border-gray-700 px-2 py-1;
}

.markdown-body table th {
  @apply bg-gray-100 dark:bg-gray-800;
}

/* 代码块复制按钮样式 */
.code-copy-btn {
  @apply transition-colors duration-200;
}

/* 高亮显示标题字号 */
.markdown-body h1, 
.markdown-body h2, 
.markdown-body h3 {
  @apply text-apple-gray-text-primary dark:text-white;
}

/* 提高代码块的视觉对比度 */
.hljs {
  @apply bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
}
</style>
 
 