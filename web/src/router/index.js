import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/DashboardView.vue'),
      meta: { 
        requiresAuth: true,
        transition: 'fade' 
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { 
        requiresAuth: false,
        transition: 'fade' 
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { 
        requiresAuth: false,
        transition: 'fade' 
      }
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('@/views/NoteListView.vue'),
      meta: { 
        requiresAuth: true,
        transition: 'fade' 
      }
    },
    {
      path: '/notes/new',
      name: 'new-note',
      component: () => import('@/views/NoteEditView.vue'),
      meta: { 
        requiresAuth: true,
        transition: 'slide-left' 
      }
    },
    {
      path: '/notes/:id',
      name: 'note-detail',
      component: () => import('@/views/NoteDetailView.vue'),
      meta: { 
        requiresAuth: true,
        transition: 'slide-left' 
      }
    },
    {
      path: '/notes/:id/edit',
      name: 'edit-note',
      component: () => import('@/views/NoteEditView.vue'),
      meta: { 
        requiresAuth: true,
        transition: 'slide-left' 
      }
    },
    {
      path: '/groups',
      name: 'groups',
      component: () => import('@/views/NoteGroupListView.vue'),
      meta: { 
        requiresAuth: true,
        transition: 'fade' 
      }
    },
    {
      path: '/groups/:id',
      name: 'group-detail',
      component: () => import('@/views/NoteListView.vue'),
      props: true,
      meta: { 
        requiresAuth: true,
        transition: 'slide-left' 
      }
    },
    {
      path: '/ai-assistant',
      name: 'ai-assistant',
      component: () => import('@/views/AIAssistantView.vue'),
      meta: { 
        requiresAuth: true,
        transition: 'fade' 
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/UserSettingsView.vue'),
      meta: { 
        requiresAuth: true,
        transition: 'fade' 
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, transition: 'fade' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { 
        requiresAuth: false,
        transition: 'fade' 
      }
    }
  ],
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果有保存的位置（例如用户使用浏览器的后退按钮），则恢复到该位置
      return savedPosition
    } else {
      // 否则滚动到页面顶部
      return { top: 0 }
    }
  }
})

// 路由守卫，处理身份验证和管理员访问权限控制
router.beforeEach((to, from, next) => {
  console.log(`路由守卫: 从 ${from.path} 到 ${to.path}`)
  
  // 检查用户认证状态
  const accessToken = localStorage.getItem('access_token')
  const isAuthenticated = accessToken !== null
  
  // 更详细的日志，帮助调试
  console.log(`认证状态: ${isAuthenticated ? '已认证' : '未认证'}`, 
    isAuthenticated ? `令牌: ${accessToken.substring(0, 10)}...` : '无令牌')
  
  // 处理管理员权限要求
  if (to.meta.requiresAdmin) {
    const userRole = localStorage.getItem('user_role')
    console.log(`访问需要管理权限，当前角色: ${userRole || '无'}`)
    
    if (!isAuthenticated || (userRole !== 'admin' && userRole !== 'superuser')) {
      // 如果用户不是管理员，重定向到首页
      console.log('拒绝访问：没有管理员权限')
      next({ path: '/' })
      return
    }
  }
  
  // 处理常规身份验证
  if (to.path !== '/login' && to.path !== '/register' && to.meta.requiresAuth !== false && !isAuthenticated) {
    // 如果用户未登录且访问非登录/注册页面，重定向到登录页
    console.log('未认证，重定向到登录页面')
    next({ path: '/login' })
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    // 如果用户已登录，但尝试访问登录/注册页面，重定向到首页
    console.log('已认证，重定向到首页')
    next({ path: '/' })
  } else {
    // 其他情况，继续访问
    console.log('允许访问')
    next()
  }
})

export default router 
 



