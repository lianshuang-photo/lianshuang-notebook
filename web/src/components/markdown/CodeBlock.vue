<template>
  <div class="code-block relative my-4 rounded-lg overflow-hidden">
    <!-- 代码块头部 -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <!-- 左侧：折叠按钮和语言标签 -->
      <div class="flex items-center space-x-2">
        <button 
          @click="toggleCollapse" 
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          :aria-label="collapsed ? '展开代码' : '折叠代码'"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 transform transition-transform" 
            :class="collapsed ? '' : 'rotate-90'"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
          {{ language }}
        </span>
      </div>
      
      <!-- 右侧：复制按钮 -->
      <button 
        @click="copyCode" 
        class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        aria-label="复制代码"
      >
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
    
    <!-- 代码内容 -->
    <div 
      v-show="!collapsed" 
      class="bg-gray-50 dark:bg-gray-900 overflow-x-auto"
    >
      <table class="w-full border-collapse">
        <tbody>
          <tr v-for="(line, index) in codeLines" :key="index">
            <!-- 行号 -->
            <td class="text-xs font-mono text-gray-400 text-right pr-4 py-1 select-none border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 w-10">
              {{ index + 1 }}
            </td>
            <!-- 代码内容 -->
            <td class="pl-4 py-1 font-mono text-sm whitespace-pre">
              <span v-html="highlightedCode[index]"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from '@/composables/useToast';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'plaintext'
  }
});

const { showToast } = useToast();
const collapsed = ref(false);
const copied = ref(false);

// 将代码分割为行
const codeLines = computed(() => {
  return props.code.split('\n');
});

// 高亮处理后的代码
const highlightedCode = computed(() => {
  try {
    const highlighted = hljs.highlight(props.code, { language: props.language }).value;
    return highlighted.split('\n');
  } catch (error) {
    console.error('代码高亮失败:', error);
    return props.code.split('\n');
  }
});

// 折叠/展开代码块
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

// 复制代码
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    showToast('代码已复制到剪贴板', 'success');
    
    // 3秒后重置复制状态
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } catch (error) {
    console.error('复制失败:', error);
    showToast('复制失败，请手动复制', 'error');
  }
};

// 组件加载时应用语法高亮
onMounted(() => {
  // 如果需要额外的初始化逻辑，可以在这里添加
});
</script>

<style scoped>
.code-block {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 可以在这里添加额外的样式 */
</style> 