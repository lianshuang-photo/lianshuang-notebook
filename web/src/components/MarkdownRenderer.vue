<template>
  <div class="markdown-content">
    <div ref="contentRef"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, watch, nextTick } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import CodeBlock from './CodeBlock.vue';
import { createApp, h } from 'vue';

const props = defineProps({
  content: {
    type: String,
    required: true
  }
});

const contentRef = ref(null);
const codeBlocks = ref([]);

// 配置渲染器
const configureRenderer = () => {
  const renderer = new marked.Renderer();
  
  // 捕获代码块
  let codeBlockIndex = 0;
  
  renderer.code = (code, language) => {
    const id = `code-block-${codeBlockIndex++}`;
    
    // 保存代码块信息，稍后渲染
    codeBlocks.value.push({
      id,
      code,
      language: language || 'plaintext'
    });
    
    // 返回一个占位符div，稍后会替换为组件
    return `<div id="${id}" class="code-block-placeholder"></div>`;
  };
  
  // 处理内联代码
  renderer.codespan = (code) => {
    return `<code class="inline-code">${code}</code>`;
  };
  
  // 配置Marked选项
  marked.setOptions({
    renderer,
    headerIds: true,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false
  });
};

// 渲染Markdown内容
const renderMarkdown = () => {
  if (!contentRef.value) return;
  
  // 清空现有内容和记录的代码块
  codeBlocks.value = [];
  
  // 设置渲染器
  configureRenderer();
  
  try {
    let html = '';
    
    if (!props.content) {
      html = '<p class="text-apple-gray-text-secondary dark:text-gray-400">暂无内容</p>';
    } else {
      // 渲染Markdown
      html = marked(props.content);
    }
    
    // 设置HTML内容
    contentRef.value.innerHTML = html;
    
    // 在下一个tick中渲染代码块组件
    nextTick(() => {
      mountCodeBlocks();
    });
  } catch (error) {
    console.error('Markdown渲染失败:', error);
    contentRef.value.innerHTML = '<p class="text-red-500">内容渲染失败</p>';
  }
};

// 挂载代码块组件
const mountCodeBlocks = () => {
  // 遍历所有代码块并插入组件
  codeBlocks.value.forEach(block => {
    const placeholder = document.getElementById(block.id);
    if (!placeholder) return;
    
    // 创建代码块组件的包装元素
    const wrapper = document.createElement('div');
    placeholder.parentNode.replaceChild(wrapper, placeholder);
    
    // 创建并挂载代码块组件
    const blockApp = createApp({
      render() {
        return h(CodeBlock, {
          code: block.code,
          language: block.language
        });
      }
    });
    
    blockApp.mount(wrapper);
  });
};

// 监听内容变化
watch(() => props.content, () => {
  renderMarkdown();
});

// 初始化
onMounted(() => {
  renderMarkdown();
});
</script>

<style scoped>
.markdown-content :deep(.inline-code) {
  @apply bg-gray-100 dark:bg-gray-700 text-apple-gray-900 dark:text-gray-200 px-1.5 py-0.5 rounded-md font-mono text-sm;
}

.markdown-content {
  @apply prose dark:prose-invert max-w-none;
}

/* 基本内容样式 */
.markdown-content :deep(h1) {
  @apply text-2xl font-semibold mb-4 mt-6;
}

.markdown-content :deep(h2) {
  @apply text-xl font-semibold mb-3 mt-5;
}

.markdown-content :deep(h3) {
  @apply text-lg font-medium mb-3 mt-4;
}

.markdown-content :deep(p) {
  @apply my-3 text-apple-gray-text-primary dark:text-gray-300;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
  @apply my-3 pl-6;
}

.markdown-content :deep(li) {
  @apply my-1;
}

.markdown-content :deep(a) {
  @apply text-apple-blue dark:text-blue-400 no-underline hover:underline;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-apple-gray-300 dark:border-gray-600 pl-4 italic my-4 text-apple-gray-text-secondary dark:text-gray-400;
}

.markdown-content :deep(hr) {
  @apply border-t border-apple-gray-border-secondary dark:border-gray-700 my-6;
}

/* 表格样式优化 */
.markdown-content :deep(table) {
  @apply w-full border-collapse my-4;
}

.markdown-content :deep(th) {
  @apply bg-apple-gray-background-light dark:bg-gray-700 text-apple-gray-text-primary dark:text-white p-2 text-left border border-apple-gray-border-secondary dark:border-gray-600 font-medium;
}

.markdown-content :deep(td) {
  @apply p-2 border border-apple-gray-border-secondary dark:border-gray-700;
}
</style> 