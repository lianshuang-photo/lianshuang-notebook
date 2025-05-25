<template>
  <div class="code-block-wrapper">
    <div class="code-block-header">
      <div class="flex items-center space-x-2">
      <button @click="toggleCollapse" class="collapse-button">
        <svg :class="['h-4 w-4 transform transition-transform', collapsed ? '-rotate-90' : '']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <span class="code-language">{{ displayLanguage }}</span>
      </div>
      
      <button @click="copyCode" class="copy-button flex items-center space-x-1">
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-xs">{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    
    <div v-show="!collapsed" class="code-content">
      <table class="code-table">
        <tbody>
          <tr v-for="(line, index) in codeLines" :key="index">
            <td class="line-number">{{ index + 1 }}</td>
            <td class="line-content" v-html="line"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import hljs from 'highlight.js';

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

const collapsed = ref(false);
const copied = ref(false);

// 语言名称映射
const languageNames = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'py': 'Python',
  'python': 'Python',
  'html': 'HTML',
  'css': 'CSS',
  'json': 'JSON',
  'xml': 'XML',
  'java': 'Java',
  'c': 'C',
  'cpp': 'C++',
  'csharp': 'C#',
  'php': 'PHP',
  'ruby': 'Ruby',
  'go': 'Go',
  'rust': 'Rust',
  'swift': 'Swift',
  'bash': 'Bash',
  'shell': 'Shell',
  'sql': 'SQL',
  'markdown': 'Markdown',
  'plaintext': '纯文本'
};

// 格式化显示的语言名称
const displayLanguage = computed(() => {
  const validLang = hljs.getLanguage(props.language) ? props.language : 'plaintext';
  return languageNames[validLang] || validLang.charAt(0).toUpperCase() + validLang.slice(1);
});

// 处理代码行，添加语法高亮
const codeLines = computed(() => {
  try {
    const validLang = hljs.getLanguage(props.language) ? props.language : 'plaintext';
    const highlightedCode = hljs.highlight(props.code, { language: validLang }).value;
    
    // 分割成行并保留HTML标签
    return highlightedCode.split('\n').map(line => 
      line || '&nbsp;' // 确保空行也有高度
    );
  } catch (error) {
    console.error('代码高亮失败:', error);
    return props.code.split('\n');
  }
});

// 复制代码
const copyCode = () => {
  try {
    // 使用异步复制API
  navigator.clipboard.writeText(props.code).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }).catch(err => {
      console.error('复制API失败:', err);
      fallbackCopy();
  });
  } catch (error) {
    console.error('复制失败，尝试备用方法:', error);
    fallbackCopy();
  }
};

// 备用复制方法
const fallbackCopy = () => {
  try {
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = props.code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // 执行复制命令
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } else {
      console.error('备用复制方法失败');
    }
  } catch (err) {
    console.error('所有复制方法都失败了:', err);
  }
};

// 折叠/展开代码块
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style scoped>
.code-block-wrapper {
  @apply relative rounded-xl bg-gray-50 dark:bg-gray-800 border border-apple-gray-border-secondary dark:border-gray-700 my-4 overflow-hidden shadow-sm;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.code-block-header {
  @apply flex items-center justify-between py-2 px-4 bg-gray-100 dark:bg-gray-700 text-apple-gray-text-primary dark:text-gray-300 text-sm border-b border-apple-gray-border-secondary dark:border-gray-600;
}

.code-language {
  @apply font-semibold text-apple-gray-text-secondary dark:text-gray-400 text-xs uppercase;
}

.collapse-button {
  @apply p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-apple-gray-text-secondary dark:text-gray-400;
}

.copy-button {
  @apply px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-apple-gray-text-secondary dark:text-gray-400 transition-colors;
}

.code-content {
  @apply overflow-x-auto;
}

.code-table {
  @apply min-w-full;
}

.line-number {
  @apply pr-4 pl-4 text-right text-xs text-apple-gray-500 dark:text-gray-500 select-none w-10 border-r border-apple-gray-border-secondary dark:border-gray-600 bg-gray-50 dark:bg-gray-800;
}

.line-content {
  @apply pl-4 py-0.5 text-sm text-apple-gray-text-primary dark:text-gray-300 whitespace-pre;
}
</style> 