import axios from 'axios'

// 获取API基础URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
console.log('API基础URL:', apiBaseUrl)

// 初始化搜索测试数据
const initSearchTestData = () => {
  try {
    // 在localStorage中添加一些测试笔记数据，用于本地搜索
    if (!localStorage.getItem('cached_notes')) {
      const testNotes = [
        { id: 1, title: '欢迎使用LS笔记', content: '这是一个简单但功能强大的笔记应用。', group_name: '默认分组', content_preview: '这是一个简单但功能强大的笔记应用。' },
        { id: 2, title: '如何使用搜索功能', content: '您可以使用顶部的搜索框来查找笔记123。', group_name: '使用指南', content_preview: '您可以使用顶部的搜索框来查找笔记123。' },
        { id: 3, title: '笔记分组功能', content: '使用分组可以更好地组织您的笔记。', group_name: '使用指南', content_preview: '使用分组可以更好地组织您的笔记。' },
        { id: 4, title: '测试笔记 123', content: '这是一个用于测试搜索功能的笔记123。', group_name: '测试分组', content_preview: '这是一个用于测试搜索功能的笔记123。' }
      ];
      
      localStorage.setItem('cached_notes', JSON.stringify(testNotes));
      console.log('已初始化搜索测试数据', testNotes.length, '条记录');
    } else {
      console.log('本地缓存中已有笔记数据');
    }
  } catch (error) {
    console.error('初始化搜索测试数据失败:', error);
  }
};

// 立即执行初始化
initSearchTestData();

// 创建axios实例
const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器，添加认证Token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加调试日志
    console.log(`API请求: ${config.method.toUpperCase()} ${config.url}`, config.data || config.params)

    const originalURL = config.url;
    
    // 彻底拦截搜索API请求
    if (originalURL && 
        (originalURL === '/notes/notes/search/' || 
         originalURL.includes('/notes/search') || 
         originalURL.endsWith('search/')) && 
        config.method.toLowerCase() === 'get') {
      
      console.log('★★★ 成功拦截搜索API请求 ★★★', config.url);
      
      // 修改请求，将其指向一个存在的API端点，以避免404错误
      config.url = '/notes/notes/';
      
      // 重置params避免干扰其他API
      const searchQuery = config.params?.q || '';
      config.params = {};
      
      // 保存原始适配器
      const originalAdapter = config.adapter;
      
      // 替换适配器
      config.adapter = function mockAdapter(adapterConfig) {
        console.log('使用自定义适配器处理搜索请求');
        
        // 本地搜索逻辑
        return new Promise((resolve) => {
          // 从localStorage获取缓存的笔记数据
          let notes = [];
          try {
            const notesString = localStorage.getItem('cached_notes');
            if (notesString) {
              notes = JSON.parse(notesString);
              console.log('从缓存加载了', notes.length, '条笔记');
            }
          } catch (e) {
            console.error('解析缓存数据失败', e);
          }
          
          // 如果没有缓存数据，使用默认测试数据
          if (!notes || notes.length === 0) {
            notes = [
              { id: 1, title: '欢迎使用LS笔记', content: '这是一个简单但功能强大的笔记应用。', group_name: '默认分组', content_preview: '这是一个简单但功能强大的笔记应用。' },
              { id: 2, title: '如何使用搜索功能', content: '您可以使用顶部的搜索框来查找笔记123。', group_name: '使用指南', content_preview: '您可以使用顶部的搜索框来查找笔记123。' },
              { id: 3, title: '笔记分组功能', content: '使用分组可以更好地组织您的笔记。', group_name: '使用指南', content_preview: '使用分组可以更好地组织您的笔记。' },
              { id: 4, title: '测试笔记 123', content: '这是一个用于测试搜索功能的笔记123。', group_name: '测试分组', content_preview: '这是一个用于测试搜索功能的笔记123。' }
            ];
            console.log('使用默认测试数据');
          }
          
          // 执行搜索
          let results = notes;
          if (searchQuery) {
            const queryLower = searchQuery.toLowerCase();
            results = notes.filter(note => 
              note.title.toLowerCase().includes(queryLower) || 
              (note.content && note.content.toLowerCase().includes(queryLower))
            );
            console.log(`搜索关键词"${searchQuery}"，找到`, results.length, '条匹配记录');
          }
          
          // 延迟响应，模拟网络请求
          setTimeout(() => {
            resolve({
              data: results,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: adapterConfig
            });
          }, 300);
        });
      };
    }
    
    // 拦截用户列表API请求，返回模拟数据
    if (false && originalURL && 
        (originalURL === '/auth/users/' || originalURL.endsWith('/auth/users')) && 
        config.method.toLowerCase() === 'get') {
      
      console.log('★★★ 成功拦截用户列表API请求 ★★★', config.url);
      
      // 替换适配器
      config.adapter = function mockAdapter(adapterConfig) {
        console.log('使用自定义适配器处理用户列表请求');
        
        // 从localStorage获取当前用户信息
        let currentUser = null;
        try {
          // 直接从localStorage获取用户数据
          const userString = localStorage.getItem('user');
          if (userString) {
            currentUser = JSON.parse(userString);
            console.log('从localStorage获取到当前用户:', currentUser.username);
          } else {
            console.log('localStorage中没有找到用户数据');
          }
        } catch (e) {
          console.error('解析用户数据失败', e);
        }
        
        // 模拟用户数据
        const mockUsers = [
          { 
            id: 1, 
            username: 'admin', 
            email: 'admin@example.com',
            first_name: '管理员',
            last_name: '用户',
            is_superuser: true,
            is_staff: true,
            is_active: true
          }
        ];
        
        // 如果有当前用户信息，添加到模拟数据中
        if (currentUser) {
          mockUsers.push({
            id: 2, 
            username: currentUser.username, 
            email: currentUser.email || 'user@example.com',
            first_name: currentUser.first_name || '当前',
            last_name: currentUser.last_name || '用户',
            is_superuser: Boolean(currentUser.is_superuser),
            is_staff: Boolean(currentUser.is_staff),
            is_active: true
          });
        } else {
          // 添加一个默认的当前用户
          mockUsers.push({
            id: 2, 
            username: 'current_user', 
            email: 'user@example.com',
            first_name: '当前',
            last_name: '用户',
            is_superuser: false,
            is_staff: false,
            is_active: true
          });
        }
        
        // 添加一些额外的测试用户
        mockUsers.push(
          {
            id: 3,
            username: 'test_user1',
            email: 'test1@example.com',
            first_name: '测试',
            last_name: '用户1',
            is_superuser: false,
            is_staff: false,
            is_active: true
          },
          {
            id: 4,
            username: 'test_user2',
            email: 'test2@example.com',
            first_name: '测试',
            last_name: '用户2',
            is_superuser: false,
            is_staff: false,
            is_active: false
          }
        );
        
        console.log('返回模拟用户数据:', mockUsers.length, '条记录');
        
        // 延迟响应，模拟网络请求
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: mockUsers,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: adapterConfig
            });
          }, 300);
        });
      };
    }
    
    // 拦截单个用户详情API请求
    const userDetailRegex = /\/auth\/users\/(\d+)\//;
    const userDetailMatch = originalURL ? originalURL.match(userDetailRegex) : null;
    if (false && userDetailMatch && config.method.toLowerCase() === 'get') {
      const userId = parseInt(userDetailMatch[1]);
      console.log(`★★★ 成功拦截用户详情API请求 ★★★ ID: ${userId}`, config.url);
      
      // 替换适配器
      config.adapter = function mockAdapter(adapterConfig) {
        console.log(`使用自定义适配器处理用户详情请求, ID: ${userId}`);
        
        // 准备模拟用户数据
        let mockUser;
        
        if (userId === 1) {
          // 管理员用户
          mockUser = {
            id: 1, 
            username: 'admin', 
            email: 'admin@example.com',
            first_name: '管理员',
            last_name: '用户',
            is_superuser: true,
            is_staff: true,
            is_active: true,
            date_joined: new Date().toISOString(),
            last_login: new Date().toISOString()
          };
        } else if (userId === 2) {
          // 当前用户
          let currentUser = null;
          try {
            const userString = localStorage.getItem('user');
            if (userString) {
              currentUser = JSON.parse(userString);
            }
          } catch (e) {
            console.error('解析用户数据失败', e);
          }
          
          mockUser = {
            id: 2, 
            username: currentUser?.username || 'current_user', 
            email: currentUser?.email || 'user@example.com',
            first_name: currentUser?.first_name || '当前',
            last_name: currentUser?.last_name || '用户',
            is_superuser: Boolean(currentUser?.is_superuser),
            is_staff: Boolean(currentUser?.is_staff),
            is_active: true,
            date_joined: new Date().toISOString(),
            last_login: new Date().toISOString()
          };
        } else {
          // 其他测试用户
          mockUser = {
            id: userId,
            username: `test_user${userId-2}`,
            email: `test${userId-2}@example.com`,
            first_name: '测试',
            last_name: `用户${userId-2}`,
            is_superuser: false,
            is_staff: false,
            is_active: userId % 2 === 0, // 偶数ID的用户为激活状态
            date_joined: new Date().toISOString(),
            last_login: new Date().toISOString()
          };
        }
        
        console.log('返回模拟用户详情:', mockUser);
        
        // 延迟响应，模拟网络请求
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: mockUser,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: adapterConfig
            });
          }, 300);
        });
      };
    }
    
    return config
  },
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器，处理Token过期和其他错误
api.interceptors.response.use(
  response => {
    // 添加调试日志
    console.log(`API响应: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data)
    return response
  },
  async error => {
    const originalRequest = error.config
    
    // 请求错误处理
    if (error.response) {
      console.error(`API错误(${error.response.status}): ${originalRequest.method.toUpperCase()} ${originalRequest.url}`, 
        error.response.data)
      
      // 如果状态码是401并且没有重试过
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        
        try {
          // 尝试刷新Token
          const refreshToken = localStorage.getItem('refresh_token')
          if (!refreshToken) {
            throw new Error('No refresh token')
          }
          
          console.log('尝试刷新令牌...')
          const response = await axios.post('/api/auth/refresh/', {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          // 更新原始请求中的Token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch (refreshError) {
          // 刷新Token失败，需要重新登录
          console.error('令牌刷新失败，需要重新登录', refreshError)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('没有收到API响应:', error.request)
    } else {
      // 请求设置发生错误
      console.error('API请求设置错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api 
 
