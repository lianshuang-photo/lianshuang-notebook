import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import './assets/main.css'
// 根据深色模式选择引入样式
import 'highlight.js/styles/github.css' // 默认亮色主题
import hljs from 'highlight.js/lib/core'
// 导入常用语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import plaintext from 'highlight.js/lib/languages/plaintext'

// 注册常用语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', html)
hljs.registerLanguage('xml', html) // xml实际上与html相同
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('text', plaintext)

// 根据系统主题加载对应的代码高亮样式
const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', darkMode);

// 添加主题监听器，动态切换代码高亮样式
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  document.documentElement.classList.toggle('dark', event.matches);
});

// 创建自定义样式
const style = document.createElement('style');
style.textContent = `
  @media (prefers-color-scheme: dark) {
    .hljs {
      color: #abb2bf;
      background: #282c34;
    }
    .hljs-comment, .hljs-quote {
      color: #5c6370;
      font-style: italic;
    }
    .hljs-doctag, .hljs-keyword, .hljs-formula {
      color: #c678dd;
    }
    .hljs-section, .hljs-name, .hljs-selector-tag, .hljs-deletion, .hljs-subst {
      color: #e06c75;
    }
    .hljs-literal {
      color: #56b6c2;
    }
    .hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta-string {
      color: #98c379;
    }
    .hljs-built_in, .hljs-class .hljs-title {
      color: #e6c07b;
    }
    .hljs-variable, .hljs-template-variable, .hljs-type, .hljs-selector-class, .hljs-selector-attr, .hljs-selector-pseudo, .hljs-number {
      color: #d19a66;
    }
    .hljs-symbol, .hljs-bullet, .hljs-link, .hljs-meta, .hljs-selector-id, .hljs-title {
      color: #61aeee;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: bold;
    }
    .hljs-link {
      text-decoration: underline;
    }
  }
`;
document.head.appendChild(style);

// 添加暗色模式下的高亮样式
const darkModeHighlightStyle = document.createElement('style')
darkModeHighlightStyle.textContent = `
/* 暗色模式的语法高亮 */
.dark .hljs {
  background: #1e1e1e;
  color: #dcdcdc;
}

.dark .hljs-keyword,
.dark .hljs-selector-tag,
.dark .hljs-tag,
.dark .hljs-name {
  color: #569cd6;
}

.dark .hljs-attribute,
.dark .hljs-literal,
.dark .hljs-symbol,
.dark .hljs-meta,
.dark .hljs-number,
.dark .hljs-type {
  color: #b5cea8;
}

.dark .hljs-title,
.dark .hljs-section,
.dark .hljs-selector-id {
  color: #dcdcaa;
}

.dark .hljs-string,
.dark .hljs-selector-attr,
.dark .hljs-selector-pseudo,
.dark .hljs-regexp,
.dark .hljs-template-tag {
  color: #ce9178;
}

.dark .hljs-subst,
.dark .hljs-code,
.dark .hljs-formula {
  color: #dcdcdc;
}

.dark .hljs-comment,
.dark .hljs-quote {
  color: #6a9955;
  font-style: italic;
}

.dark .hljs-doctag {
  color: #608b4e;
}

.dark .hljs-meta .hljs-keyword,
.dark .hljs-meta-keyword {
  color: #c586c0;
}

.dark .hljs-variable,
.dark .hljs-template-variable {
  color: #9cdcfe;
}

.dark .hljs-built_in,
.dark .hljs-class .hljs-title {
  color: #4ec9b0;
}

.dark .hljs-attr {
  color: #9cdcfe;
}

.dark .hljs-function .hljs-keyword,
.dark .hljs-function {
  color: #dcdcaa;
}

.dark .hljs-params {
  color: #9cdcfe;
}
`
document.head.appendChild(darkModeHighlightStyle)

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(createPinia())

// 使用Vue Router
app.use(router)

// 使用VueUse Motion动画库
app.use(MotionPlugin)

// 挂载应用
app.mount('#app') 