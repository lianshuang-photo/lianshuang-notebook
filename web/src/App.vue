<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader v-if="isAuthenticated" />
    
    <main class="flex-1">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </main>
    
    <AppFooter />
    
    <!-- 全局Toast通知 -->
    <ToastNotification 
      :message="toastMessage" 
      :type="toastType" 
      :visible="toastVisible" 
      @close="closeToast" 
    />
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUserPreferenceStore } from '@/store/userPreference'
import { useToast } from '@/composables/useToast'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastNotification from '@/components/ToastNotification.vue'

const authStore = useAuthStore()
const preferenceStore = useUserPreferenceStore()
const router = useRouter()
const route = useRoute()
const { toastVisible, toastMessage, toastType, closeToast } = useToast()

const isAuthenticated = computed(() => authStore.isAuthenticated)

// 页面过渡动画相关 - 现在通过CSS类和路由钩子处理
router.afterEach((to, from) => {
  // 重置滚动位置
  window.scrollTo(0, 0)
})

// 监听路由变化，检查身份验证状态
watch(
  () => route.path,
  async () => {
    // 如果用户未登录且当前路径不是登录/注册页面，则重定向到登录页面
    if (!authStore.isAuthenticated && 
      !route.path.includes('login') && 
      !route.path.includes('register')) {
      router.push('/login')
    }
  }
)

onMounted(async () => {
  try {
    console.log('App初始化，正在恢复会话...')
    
    // 尝试恢复会话（如果有存储的令牌）
    if (localStorage.getItem('access_token')) {
      console.log('找到访问令牌，尝试恢复会话')
      const user = await authStore.restoreSession()
      console.log('恢复会话结果:', user ? '成功' : '失败')
      
      // 如果用户已登录，获取用户偏好设置
      if (authStore.isAuthenticated) {
        console.log('用户已认证，获取偏好设置')
        await preferenceStore.getUserPreference()
        
        // 应用主题
        document.documentElement.classList.toggle('dark', 
          preferenceStore.theme === 'dark' || 
          (preferenceStore.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        )
        
        // 确保页面状态正确
        if (route.path === '/login' || route.path === '/register') {
          console.log('用户已登录但在登录页面，重定向到首页')
          router.push('/')
        }
      } else {
        console.log('恢复会话失败，用户未认证')
        if (route.path !== '/login' && route.path !== '/register') {
          console.log('用户未认证，重定向到登录页面')
          router.push('/login')
        }
      }
    } else {
      console.log('未找到访问令牌，用户未登录')
      if (route.path !== '/login' && route.path !== '/register') {
        console.log('用户未认证，重定向到登录页面')
        router.push('/login')
      }
    }
  } catch (error) {
    console.error('App初始化错误:', error)
    router.push('/login')
  }
})
</script>

<style>
/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 动画辅助类 */
.animate-fadeIn {
  animation: fadeIn 0.3s ease forwards;
}

.animate-scaleUp {
  animation: scaleUp 0.2s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
 

