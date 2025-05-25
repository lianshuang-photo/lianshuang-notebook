<template>
  <div class="bg-apple-gray-100 dark:bg-gray-900 min-h-screen pt-8 pb-12">
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-apple-gray-text-primary dark:text-white">
          设置
        </h1>
        <p class="mt-1 text-apple-gray-text-secondary dark:text-gray-400">
          自定义你的LS笔记偏好设置
        </p>
      </div>
      
      <div v-if="loading" class="content-block p-6 text-center">
        <div class="flex justify-center items-center space-x-1">
          <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce"></div>
          <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 rounded-full bg-apple-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
        <p class="mt-2">加载设置中...</p>
      </div>
      
      <form v-else @submit.prevent="saveSettings" class="space-y-6">
        <!-- 外观设置 -->
        <div class="content-block">
          <h2 class="text-xl font-medium text-apple-gray-text-primary dark:text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            外观
          </h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-apple-gray-text-primary dark:text-white mb-2">
                主题模式
              </label>
              <div class="grid grid-cols-3 gap-4">
                <button 
                  type="button"
                  class="theme-option p-4 rounded-xl border transition-all duration-200 relative overflow-hidden"
                  :class="[
                    preferences.theme === 'light' 
                      ? 'border-apple-blue bg-apple-blue/10' 
                      : 'border-apple-gray-border-secondary dark:border-gray-700 hover:border-apple-blue dark:hover:border-blue-500'
                  ]"
                  @click="setTheme('light')"
                >
                  <div class="flex justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div class="text-center text-apple-gray-text-primary dark:text-white font-medium">
                    浅色
                  </div>
                  <div v-if="preferences.theme === 'light'" class="absolute bottom-1 right-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-blue" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </button>
                
                <button 
                  type="button"
                  class="theme-option p-4 rounded-xl border transition-all duration-200 relative overflow-hidden"
                  :class="[
                    preferences.theme === 'dark' 
                      ? 'border-apple-blue bg-apple-blue/10' 
                      : 'border-apple-gray-border-secondary dark:border-gray-700 hover:border-apple-blue dark:hover:border-blue-500'
                  ]"
                  @click="setTheme('dark')"
                >
                  <div class="flex justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div class="text-center text-apple-gray-text-primary dark:text-white font-medium">
                    深色
                  </div>
                  <div v-if="preferences.theme === 'dark'" class="absolute bottom-1 right-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-blue" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </button>
                
                <button 
                  type="button"
                  class="theme-option p-4 rounded-xl border transition-all duration-200 relative overflow-hidden"
                  :class="[
                    preferences.theme === 'system' 
                      ? 'border-apple-blue bg-apple-blue/10' 
                      : 'border-apple-gray-border-secondary dark:border-gray-700 hover:border-apple-blue dark:hover:border-blue-500'
                  ]"
                  @click="setTheme('system')"
                >
                  <div class="flex justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-apple-gray-text-secondary dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="text-center text-apple-gray-text-primary dark:text-white font-medium">
                    系统
                  </div>
                  <div v-if="preferences.theme === 'system'" class="absolute bottom-1 right-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-blue" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI功能设置 -->
        <div class="content-block">
          <h2 class="text-xl font-medium text-apple-gray-text-primary dark:text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI功能
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-sm font-medium text-apple-gray-text-primary dark:text-white mb-1">
                  启用AI助手
                </label>
                <p class="text-sm text-apple-gray-text-secondary dark:text-gray-400">
                  允许AI生成笔记摘要、回答问题和提供写作建议
                </p>
              </div>
              <div class="ml-4">
                <button 
                  type="button"
                  role="switch"
                  :aria-checked="preferences.enableAI"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-blue"
                  :class="preferences.enableAI ? 'bg-apple-blue' : 'bg-apple-gray-300 dark:bg-gray-700'"
                  @click="preferences.enableAI = !preferences.enableAI"
                >
                  <span
                    class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                    :class="preferences.enableAI ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
            </div>

            <!-- AI API设置 (当AI功能启用时显示) -->
            <div v-if="preferences.enableAI" class="mt-4 space-y-4 border-t border-apple-gray-border dark:border-gray-700 pt-4">
              <div class="flex items-center justify-between">
              <h3 class="text-md font-medium text-apple-gray-text-primary dark:text-white">
                API设置
              </h3>
                
                <!-- API状态指示器 -->
                <div class="flex items-center text-sm">
                  <span class="inline-block w-2 h-2 rounded-full mr-2" 
                        :class="preferences.apiKey ? 'bg-green-500' : 'bg-red-500'"></span>
                  <span :class="preferences.apiKey ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ preferences.apiKey ? 'API密钥已设置' : 'API密钥未设置' }}
                  </span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="api-key" class="block text-sm font-medium text-apple-gray-text-primary dark:text-white mb-1">
                  DeepSeek API密钥
                </label>
                <div class="relative">
                <input 
                    :type="showApiKey ? 'text' : 'password'"
                  id="api-key"
                  v-model="preferences.apiKey"
                  @input="handleApiKeyInput"
                    class="form-input pr-20 w-full rounded-lg border-apple-gray-border dark:border-gray-700 bg-white dark:bg-gray-800 text-apple-gray-text-primary dark:text-white focus:border-apple-blue dark:focus:border-blue-500 focus:ring-1 focus:ring-apple-blue dark:focus:ring-blue-500 transition-colors"
                  placeholder="输入您的DeepSeek API密钥"
                />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button 
                      type="button" 
                      @click="clearApiKey"
                      v-if="preferences.apiKey"
                      class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 focus:outline-none mr-3"
                      title="清除API密钥"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      @click="toggleApiKeyVisibility"
                      class="text-apple-gray-text-secondary dark:text-gray-400 hover:text-apple-gray-text-primary dark:hover:text-white focus:outline-none"
                    >
                      <svg v-if="showApiKey" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-xs text-apple-gray-text-secondary dark:text-gray-400 mt-1">
                  API密钥将安全地存储在服务器端
                </p>
              </div>
              
              <div class="form-group">
                <label for="base-url" class="block text-sm font-medium text-apple-gray-text-primary dark:text-white mb-1">
                  API基础URL
                </label>
                <div class="relative">
                <input 
                  type="text"
                  id="base-url"
                  v-model="preferences.baseUrl"
                    class="form-input pr-10 w-full rounded-lg border-apple-gray-border dark:border-gray-700 bg-white dark:bg-gray-800 text-apple-gray-text-primary dark:text-white focus:border-apple-blue dark:focus:border-blue-500 focus:ring-1 focus:ring-apple-blue dark:focus:ring-blue-500 transition-colors"
                  placeholder="https://api.deepseek.com"
                />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span class="text-apple-gray-400 dark:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <div class="flex items-center justify-between mb-1">
                  <label for="model-name" class="block text-sm font-medium text-apple-gray-text-primary dark:text-white">
                  模型名称
                </label>
                  
                  <!-- 模型状态指示器 -->
                  <div class="flex items-center text-sm" v-if="preferences.modelName">
                    <span class="inline-block w-2 h-2 rounded-full mr-2 bg-green-500"></span>
                    <span class="text-green-600 dark:text-green-400">当前模型: {{ preferences.modelName }}</span>
                  </div>
                </div>
                
                <div class="relative">
                  <select
                    id="model-name"
                    v-model="preferences.modelName"
                    class="form-input appearance-none pr-10 w-full rounded-lg border-apple-gray-border dark:border-gray-700 bg-white dark:bg-gray-800 text-apple-gray-text-primary dark:text-white focus:border-apple-blue dark:focus:border-blue-500 focus:ring-1 focus:ring-apple-blue dark:focus:ring-blue-500 transition-colors"
                    :disabled="loadingModels"
                  >
                    <option v-if="loadingModels" value="">加载模型列表中...</option>
                    <option v-else-if="availableModels.length === 0" value="">请输入API密钥后点击刷新</option>
                    <option v-for="model in availableModels" :key="model.id" :value="model.id">
                      {{ model.id }} ({{ model.owned_by }})
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-apple-gray-text-secondary dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="mt-2 flex">
                  <button 
                    type="button" 
                    class="text-xs text-apple-blue dark:text-blue-400 hover:underline flex items-center"
                    :disabled="!preferences.apiKey || loadingModels"
                    @click="fetchModels"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ loadingModels ? '加载中...' : '刷新模型列表' }}
                  </button>
                </div>
              </div>
              
              <div class="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  API使用说明
                </h4>
                <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  需要DeepSeek API密钥才能使用AI功能。您可以从DeepSeek官网获取API密钥。API密钥将安全地存储在服务器端，只在请求时使用。
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-xs text-blue-600 dark:text-blue-400">API状态: 
                    <span class="font-medium" :class="apiStatusClass">{{ apiStatusText }}</span>
                  </span>
                  <a href="https://deepseek.com" target="_blank" class="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                    获取API密钥
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <!-- 测试连接按钮 -->
              <div class="flex justify-end mt-4">
                <button 
                  type="button" 
                  class="px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                  :class="[
                    !preferences.apiKey || testingConnection 
                      ? 'bg-apple-gray-300 dark:bg-gray-700 text-apple-gray-500 dark:text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm'
                  ]"
                  :disabled="!preferences.apiKey || testingConnection"
                  @click="testConnection"
                >
                  <svg v-if="testingConnection" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ testingConnection ? '测试中...' : '测试连接' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 管理设置 (仅管理员可见) -->
        <div v-if="isAdmin" class="content-block">
          <h2 class="text-xl font-medium text-apple-gray-text-primary dark:text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            管理功能
          </h2>
          
          <div class="space-y-4 mt-6">
            <div class="flex flex-col space-y-2">
              <router-link to="/admin" class="btn-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                访问管理控制台
              </router-link>
              <p class="text-sm text-apple-gray-text-secondary dark:text-gray-400 mt-2">
                管理控制台可用于管理用户账户、分配分组权限和监控系统
              </p>
            </div>
            
            <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300">管理功能说明</h4>
                  <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                    管理员账户可以创建和管理其他用户，分配分组权限，以及执行系统维护任务。请谨慎使用这些功能。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 保存按钮 -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="btn-primary"
            :disabled="saving"
          >
            <span v-if="saving">保存中...</span>
            <span v-else>保存设置</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserPreferenceStore } from '@/store/userPreference'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/composables/useToast'
import { getAvailableModels } from '@/api/userPreference'
import api from '@/api'

const preferenceStore = useUserPreferenceStore()
const authStore = useAuthStore()
const { showToast } = useToast()

// 检查是否是管理员
const isAdmin = computed(() => {
  return authStore.isAdmin || authStore.isSuperuser
})

const loading = ref(true)
const saving = ref(false)
const loadingModels = ref(false)
const availableModels = ref([])
const preferences = reactive({
  theme: 'system',
  enableAI: true,
  apiKey: '',
  baseUrl: 'https://api.deepseek.com',
  modelName: 'deepseek-chat'
})

// 显示/隐藏API密钥的状态
const showApiKey = ref(false)
const toggleApiKeyVisibility = () => {
  showApiKey.value = !showApiKey.value
}

// 初始化
onMounted(async () => {
  try {
    await loadPreferences();
    
    // 确保应用当前主题
    applyTheme(preferences.theme);
    
    // 监听系统主题变化，仅当设置为"system"时才响应
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      if (preferences.theme === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };
    
    // 添加监听器
    darkModeMediaQuery.addEventListener('change', handleThemeChange);
    
    // 组件卸载时移除监听器
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleThemeChange);
    };
  } catch (error) {
    console.error('加载用户设置失败:', error);
    showToast('加载设置失败，请稍后重试', 'error');
  } finally {
    loading.value = false;
  }
});

// 加载偏好设置
const loadPreferences = async () => {
  const userPreference = await preferenceStore.getUserPreference()
  
  if (userPreference) {
    preferences.theme = userPreference.theme
    preferences.enableAI = userPreference.enable_ai
    
    // 加载API密钥 - 确保正确显示星号
    if (userPreference.ai_api_key) {
      // 只需要判断是否有设置密钥，不显示实际值，用星号代替
      if (userPreference.ai_api_key === '******') {
        // 服务器返回的是星号占位符，表示密钥已设置但不显示内容
        preferences.apiKey = '********'
      } else {
        // 服务器返回了实际密钥（比如刚设置后的响应）
        preferences.apiKey = userPreference.ai_api_key
      }
    } else {
      preferences.apiKey = ''
    }
    
    preferences.baseUrl = userPreference.ai_base_url || 'https://api.deepseek.com'
    preferences.modelName = userPreference.ai_model || 'deepseek-chat'
    
    // 如果已设置API密钥，自动获取模型列表
    if (preferences.apiKey) {
      fetchModels()
    }
  }
}

// 保存设置
const saveSettings = async () => {
  saving.value = true;
  
  try {
    // 判断密钥是否是占位符，如果是则不更新密钥
    let apiKeyToSave = preferences.apiKey;
    if (apiKeyToSave === '********') {
      // 不发送密钥，服务器将保留原有值
      apiKeyToSave = undefined;
    }
    
    // 应用主题设置
    applyTheme(preferences.theme);
    
    await preferenceStore.updatePreference({
      theme: preferences.theme,
      enableAI: preferences.enableAI,
      ai_api_key: apiKeyToSave,
      ai_base_url: preferences.baseUrl,
      ai_model: preferences.modelName
    });
    
    showToast('设置保存成功', 'success');
    
    // 重新加载设置以确保显示正确的数据
    await loadPreferences();
  } catch (error) {
    console.error('保存设置失败:', error);
    showToast('保存设置失败，请稍后重试', 'error');
  } finally {
    saving.value = false;
  }
};

// 获取可用模型列表
const fetchModels = async () => {
  if (!preferences.apiKey || preferences.apiKey.trim().length < 5) {
    availableModels.value = []
    return
  }
  
  loadingModels.value = true
  
  try {
    const response = await getAvailableModels()
    availableModels.value = response.data.models || []
    
    // 如果返回了消息但没有错误，显示为提示信息
    if (response.data.message && !response.data.error) {
      showToast(response.data.message, 'info')
    }
  } catch (error) {
    console.error('获取模型列表失败:', error)
    availableModels.value = [] // 确保在错误时重置模型列表
    
    // 显示服务器返回的具体错误信息
    const errorMessage = error.response?.data?.error || '获取模型列表失败，请稍后重试'
    showToast(errorMessage, 'error')
  } finally {
    loadingModels.value = false
  }
}

// 监听API密钥输入
const handleApiKeyInput = () => {
  // 如果用户更改了密钥，就认为这是一个新密钥，而不是占位符
  if (preferences.apiKey && preferences.apiKey !== '********') {
  // 清除上一个计时器
  if (window.apiKeyTimer) clearTimeout(window.apiKeyTimer)
  
  // 如果API密钥为空或太短，则不发送请求
    if (preferences.apiKey.length < 10) {
    return
  }
  
  // 防抖：只有当用户停止输入500毫秒后才发送请求
  window.apiKeyTimer = setTimeout(async () => {
    try {
      // 先保存API密钥到服务器
      await preferenceStore.updatePreference({
          ai_api_key: preferences.apiKey,
          ai_base_url: preferences.baseUrl
      })
      
      // 保存成功后再获取模型列表
      await fetchModels()
    } catch (error) {
      console.error('API密钥保存失败:', error)
      
      // 提取具体的错误信息
      let errorMsg = 'API密钥保存失败'
      if (error.response?.data?.ai_api_key) {
        errorMsg = `API密钥错误: ${error.response.data.ai_api_key}`
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      }
      
      showToast(errorMsg, 'error')
    }
  }, 500)
}
}

// 测试连接
const testingConnection = ref(false)
const apiStatusClass = ref('')
const apiStatusText = ref('未测试')

const testConnection = async () => {
  testingConnection.value = true
  apiStatusClass.value = 'animate-pulse'
  apiStatusText.value = '测试中...'
  
  try {
    const response = await api.post('/notes/ai/test-connection/')
    
    if (response.data.status === 'success') {
      apiStatusClass.value = 'text-green-600 dark:text-green-400'
      apiStatusText.value = '连接成功'
      showToast('连接测试成功', 'success')
    } else {
      apiStatusClass.value = 'text-red-600 dark:text-red-400'
      apiStatusText.value = '连接失败'
      showToast(response.data.message || '连接测试失败，请检查API密钥和API基础URL', 'error')
    }
  } catch (error) {
    console.error('测试连接失败:', error)
    apiStatusClass.value = 'text-red-600 dark:text-red-400'
    apiStatusText.value = '连接失败'
    
    // 提取具体的错误信息
    let errorMessage = '测试连接失败'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    
    showToast(errorMessage, 'error')
  } finally {
    testingConnection.value = false
  }
}

// 清除API密钥
const clearApiKey = async () => {
  if (!preferences.apiKey) return;
  
  try {
    // 设置为空字符串
    preferences.apiKey = '';
    
    // 立即保存到服务器
    await preferenceStore.updatePreference({
      ai_api_key: '',  // 明确设置为空字符串
      ai_base_url: preferences.baseUrl,
      ai_model: preferences.modelName
    });
    
    showToast('API密钥已成功删除', 'success');
    
    // 清空模型列表
    availableModels.value = [];
  } catch (error) {
    console.error('清除API密钥失败:', error);
    showToast('清除API密钥失败，请稍后重试', 'error');
    
    // 恢复原状态
    await loadPreferences();
  }
};

// 应用主题
const applyTheme = (theme) => {
  console.log('设置界面应用主题:', theme);
  
  // 移除已有的主题类
  document.documentElement.classList.remove('dark', 'light');
  
  // 立即应用主题
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    console.log('已应用深色主题');
  } else if (theme === 'light') {
    // 对于浅色主题，确保dark类被移除
    console.log('已应用浅色主题');
  } else if (theme === 'system') {
    // 系统主题
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark');
      console.log('已应用系统主题(深色)');
    } else {
      console.log('已应用系统主题(浅色)');
    }
  }
  
  // 强制重新渲染一些元素以确保主题生效
  setTimeout(() => {
    const event = new Event('themechange');
    window.dispatchEvent(event);
  }, 50);
};

// 设置主题并立即应用
const setTheme = (theme) => {
  console.log('切换主题:', theme, '当前:', preferences.theme);
  preferences.theme = theme;
  applyTheme(theme);
};
</script>

<style scoped>
.theme-option {
  @apply cursor-pointer focus:outline-none;
}
</style> 