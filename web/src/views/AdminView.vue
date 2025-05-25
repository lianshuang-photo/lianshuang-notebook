<template>
  <div class="bg-apple-gray-100 dark:bg-gray-900 min-h-screen pt-8 pb-12">
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-apple-gray-text-primary dark:text-white">
            管理控制台
          </h1>
          <p class="mt-1 text-apple-gray-text-secondary dark:text-gray-400">
            管理用户和分组权限
          </p>
        </div>
        <router-link to="/settings" class="btn-secondary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          返回设置
        </router-link>
      </div>
      
      <!-- 管理员警告 -->
      <div v-if="!isAdminUser" class="content-block p-6 text-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-xl font-medium text-apple-gray-text-primary dark:text-white mb-2">管理权限受限</h3>
        <p class="text-apple-gray-text-secondary dark:text-gray-400">
          你需要管理员权限才能访问此页面。
        </p>
      </div>
      
      <div v-else>
        <!-- 标签页切换 -->
        <div class="mb-6 border-b border-apple-gray-border-secondary dark:border-gray-700">
          <div class="flex space-x-6">
            <button 
              @click="activeTab = 'users'"
              class="py-2 px-1 border-b-2 transition-colors"
              :class="[
                activeTab === 'users' 
                  ? 'border-apple-blue text-apple-gray-text-primary dark:text-white font-medium'
                  : 'border-transparent text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-400 dark:hover:text-white'
              ]"
            >
              用户管理
            </button>
            <button 
              @click="activeTab = 'groups'"
              class="py-2 px-1 border-b-2 transition-colors"
              :class="[
                activeTab === 'groups' 
                  ? 'border-apple-blue text-apple-gray-text-primary dark:text-white font-medium'
                  : 'border-transparent text-apple-gray-text-secondary hover:text-apple-gray-text-primary dark:text-gray-400 dark:hover:text-white'
              ]"
            >
              分组权限
            </button>
          </div>
        </div>
        
        <!-- 用户管理 -->
        <div v-if="activeTab === 'users'" class="content-block p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium text-apple-gray-text-primary dark:text-white">用户列表</h2>
            <button @click="showAddUserDialog = true" class="btn-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              添加用户
            </button>
          </div>
          
          <!-- 用户列表表格 -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-apple-gray-border-secondary dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">用户名</th>
                  <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">邮箱</th>
                  <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">角色</th>
                  <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">状态</th>
                  <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-apple-gray-border-secondary dark:divide-gray-700">
                <tr v-if="loading" class="text-center">
                  <td colspan="5" class="px-6 py-8 text-apple-gray-text-secondary dark:text-gray-400">加载中...</td>
                </tr>
                
                <tr v-else-if="users.length === 0" class="text-center">
                  <td colspan="5" class="px-6 py-8 text-apple-gray-text-secondary dark:text-gray-400">暂无用户</td>
                </tr>
                
                <tr v-for="user in users" :key="user.id" class="hover:bg-apple-gray-background-light dark:hover:bg-gray-700/50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full bg-apple-gray-200 dark:bg-gray-700 flex items-center justify-center text-apple-gray-text-primary dark:text-white font-medium text-sm">
                        {{ getUserInitials(user) }}
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-apple-gray-text-primary dark:text-white">{{ user.username }}</div>
                        <div class="text-xs text-apple-gray-text-secondary dark:text-gray-400">{{ user.first_name }} {{ user.last_name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-text-secondary dark:text-gray-400">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="user.is_superuser" class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">超级管理员</span>
                    <span v-else-if="user.is_staff" class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">管理员</span>
                    <span v-else class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">用户</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="user.is_active" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">活跃</span>
                    <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">停用</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-text-secondary dark:text-gray-400">
                    <div class="flex space-x-2">
                      <button 
                        @click="editUser(user)" 
                        class="text-apple-blue hover:text-apple-blue-dark transition-colors"
                        :disabled="user.is_superuser && !authStore.isSuperuser"
                      >
                        编辑
                      </button>
                      <button 
                        @click="toggleUserStatus(user)" 
                        class="text-red-600 hover:text-red-700 transition-colors"
                        :disabled="user.is_superuser || user.id === authStore.user?.id || user.updating"
                      >
                        <span v-if="user.updating">处理中...</span>
                        <span v-else>{{ user.is_active ? '停用' : '启用' }}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 添加/编辑用户对话框 -->
          <div v-if="showAddUserDialog || showEditUserDialog" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4">
              <div class="p-6 border-b border-apple-gray-border-secondary dark:border-gray-700">
                <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white">
                  {{ showEditUserDialog ? '编辑用户' : '添加用户' }}
                </h3>
              </div>
              
              <div class="p-6">
                <form @submit.prevent="handleUserFormSubmit">
                  <div class="space-y-4">
                    <div>
                      <label for="username" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">用户名</label>
                      <input 
                        id="username" 
                        v-model="userForm.username" 
                        type="text" 
                        class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                        :disabled="showEditUserDialog"
                        required
                      >
                    </div>
                    
                    <div>
                      <label for="email" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">邮箱</label>
                      <input 
                        id="email" 
                        v-model="userForm.email" 
                        type="email" 
                        class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                        required
                      >
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label for="first_name" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">名</label>
                        <input 
                          id="first_name" 
                          v-model="userForm.first_name" 
                          type="text" 
                          class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                        >
                      </div>
                      
                      <div>
                        <label for="last_name" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">姓</label>
                        <input 
                          id="last_name" 
                          v-model="userForm.last_name" 
                          type="text" 
                          class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                        >
                      </div>
                    </div>
                    
                    <div v-if="!showEditUserDialog">
                      <label for="password" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">密码</label>
                      <input 
                        id="password" 
                        v-model="userForm.password" 
                        type="password" 
                        class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                        required
                      >
                    </div>
                    
                    <div v-if="!showEditUserDialog">
                      <label for="password2" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">确认密码</label>
                      <input 
                        id="password2" 
                        v-model="userForm.password2" 
                        type="password" 
                        class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                        required
                      >
                    </div>
                    
                    <div v-if="passwordError" class="text-red-600 text-sm">
                      {{ passwordError }}
                    </div>
                    
                    <div class="flex items-center">
                      <input 
                        id="is_staff" 
                        v-model="userForm.is_staff" 
                        type="checkbox" 
                        class="h-4 w-4 rounded border-apple-gray-border-secondary dark:border-gray-700 text-apple-blue focus:ring-apple-blue dark:bg-gray-700"
                      >
                      <label for="is_staff" class="ml-2 block text-sm text-apple-gray-text-primary dark:text-white">管理员权限</label>
                    </div>
                  </div>
                  
                  <div class="mt-6 flex justify-end space-x-3">
                    <button 
                      type="button" 
                      @click="closeUserDialog" 
                      class="btn-secondary"
                    >
                      取消
                    </button>
                    
                    <button 
                      type="submit" 
                      class="btn-primary"
                      :disabled="formSubmitting"
                    >
                      <span v-if="formSubmitting">提交中...</span>
                      <span v-else>{{ showEditUserDialog ? '保存' : '添加' }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分组权限管理 -->
        <div v-else-if="activeTab === 'groups'" class="content-block p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium text-apple-gray-text-primary dark:text-white">分组权限管理</h2>
            <div class="flex space-x-2">
              <select 
                v-model="selectedGroup" 
                class="input bg-apple-gray-background-light dark:bg-gray-700 pr-8"
              >
                <option value="">-- 选择分组 --</option>
                <option v-for="group in groups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
              
              <button 
                @click="loadGroupUsers" 
                class="btn-primary"
                :disabled="!selectedGroup || loadingGroupUsers"
              >
                <span v-if="loadingGroupUsers">加载中...</span>
                <span v-else>查看</span>
              </button>
            </div>
          </div>
          
          <!-- 最近访问的分组 -->
          <div v-if="!selectedGroup" class="mb-6">
            <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white mb-3">最近访问的分组</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                v-for="item in recentGroups" 
                :key="item.id" 
                class="p-4 border border-apple-gray-border-secondary dark:border-gray-700 rounded-lg hover:bg-apple-gray-background-light dark:hover:bg-gray-700/50 cursor-pointer"
                @click="selectRecentGroup(item.group.id)"
              >
                <div class="font-medium text-apple-gray-text-primary dark:text-white">{{ item.group.name }}</div>
                <div class="text-sm text-apple-gray-text-secondary dark:text-gray-400">最后访问: {{ formatDate(item.last_accessed) }}</div>
                <div class="text-sm text-apple-gray-text-secondary dark:text-gray-400 mt-1">{{ item.group.note_count || 0 }}个笔记</div>
              </div>
              
              <div v-if="recentGroups.length === 0" class="col-span-full text-center p-4 text-apple-gray-text-secondary dark:text-gray-400">
                尚无访问记录
              </div>
            </div>
          </div>
          
          <div v-if="!selectedGroup" class="text-center py-10 text-apple-gray-text-secondary dark:text-gray-400">
            请选择一个分组查看权限设置
          </div>
          
          <div v-else>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white">
              分组成员: {{ selectedGroupName }}
            </h3>
              
              <div class="flex items-center space-x-2">
                <!-- 创建权限模板按钮 -->
                <button 
                  @click="openPermissionTemplateDialog"
                  class="btn-secondary text-sm"
                >
                  保存为模板
                </button>
                
                <!-- 应用模板按钮 -->
                <div class="relative" ref="templateDropdownRef">
                  <button 
                    @click="toggleTemplateDropdown"
                    class="btn-secondary text-sm"
                  >
                    应用模板
                  </button>
                  
                  <!-- 模板下拉菜单 -->
                  <div 
                    v-if="showTemplateDropdown" 
                    class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
                  >
                    <div class="py-1" role="menu" aria-orientation="vertical">
                      <div v-if="loadingTemplates" class="px-4 py-2 text-sm text-apple-gray-text-secondary dark:text-gray-400">
                        加载中...
                      </div>
                      
                      <div v-else-if="permissionTemplates.length === 0" class="px-4 py-2 text-sm text-apple-gray-text-secondary dark:text-gray-400">
                        暂无模板
                      </div>
                      
                      <button
                        v-for="template in permissionTemplates"
                        :key="template.id"
                        @click="applyTemplate(template.id)"
                        class="block w-full text-left px-4 py-2 text-sm text-apple-gray-text-primary dark:text-white hover:bg-apple-gray-background-light dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        {{ template.name }} ({{ getPermissionText(template.permission) }})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 搜索和筛选区域 -->
            <div class="mb-4 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div class="flex-1">
                <input 
                  v-model="userSearchQuery" 
                  type="text" 
                  placeholder="搜索用户..." 
                  class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                  @input="filterGroupUsers"
                />
              </div>
              
              <div class="flex items-center space-x-2">
                <span class="text-sm text-apple-gray-text-secondary dark:text-gray-400">权限:</span>
                <select 
                  v-model="permissionFilter" 
                  class="input bg-apple-gray-background-light dark:bg-gray-700 text-sm"
                  @change="filterGroupUsers"
                >
                  <option value="all">全部</option>
                  <option value="read">只读</option>
                  <option value="write">读写</option>
                  <option value="admin">管理</option>
                </select>
              </div>
            </div>
            
            <!-- 添加成员表单 -->
            <div class="mb-6 border border-apple-gray-border-secondary dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-medium text-apple-gray-text-primary dark:text-white mb-3">添加成员</h4>
              
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div class="flex-1">
              <select 
                v-model="userToAdd" 
                    class="input bg-apple-gray-background-light dark:bg-gray-700 w-full"
              >
                <option value="">-- 选择用户 --</option>
                <option v-for="user in usersNotInGroup" :key="user.id" :value="user.id">
                  {{ user.username }} ({{ user.email }})
                </option>
              </select>
                </div>
              
                <div class="w-32">
              <select 
                v-model="permissionToAdd" 
                    class="input bg-apple-gray-background-light dark:bg-gray-700 w-full"
              >
                <option value="read">只读</option>
                <option value="write">读写</option>
                <option value="admin">管理</option>
              </select>
                </div>
              
                <div>
              <button 
                @click="handleAddUserToGroup" 
                    class="btn-primary w-full sm:w-auto"
                :disabled="!userToAdd || addingUser"
              >
                <span v-if="addingUser">添加中...</span>
                <span v-else>添加</span>
              </button>
                </div>
              </div>
              
              <!-- 批量添加模式切换 -->
              <div class="mt-3 flex items-center">
                <button 
                  @click="batchMode = !batchMode" 
                  class="text-sm text-apple-blue dark:text-blue-400 hover:underline"
                >
                  {{ batchMode ? '取消批量添加' : '批量添加用户' }}
                </button>
              </div>
              
              <!-- 批量添加面板 -->
              <div v-if="batchMode" class="mt-3 border-t border-apple-gray-border-secondary dark:border-gray-700 pt-3">
                <h5 class="text-sm font-medium text-apple-gray-text-primary dark:text-white mb-2">批量选择用户</h5>
                
                <div class="mb-3">
                  <input 
                    v-model="batchSearchQuery" 
                    type="text" 
                    placeholder="搜索用户..." 
                    class="input w-full bg-apple-gray-background-light dark:bg-gray-700 text-sm"
                  />
                </div>
                
                <div class="max-h-64 overflow-y-auto border border-apple-gray-border-secondary dark:border-gray-700 rounded-lg p-2">
                  <div 
                    v-for="user in filteredBatchUsers" 
                    :key="user.id"
                    class="flex items-center py-1 px-2 hover:bg-apple-gray-background-light dark:hover:bg-gray-700/50 rounded"
                  >
                    <input 
                      type="checkbox" 
                      :id="`batch-user-${user.id}`" 
                      v-model="selectedBatchUsers" 
                      :value="user.id"
                      class="h-4 w-4 rounded border-apple-gray-border-secondary dark:border-gray-700 text-apple-blue focus:ring-apple-blue"
                    />
                    <label :for="`batch-user-${user.id}`" class="ml-2 text-sm text-apple-gray-text-primary dark:text-white cursor-pointer">
                      {{ user.username }} ({{ user.email }})
                    </label>
                  </div>
                  
                  <div v-if="filteredBatchUsers.length === 0" class="py-2 text-center text-sm text-apple-gray-text-secondary dark:text-gray-400">
                    没有匹配的用户
                  </div>
                </div>
                
                <div class="mt-3 flex justify-between items-center">
                  <div class="text-sm text-apple-gray-text-secondary dark:text-gray-400">
                    已选择 {{ selectedBatchUsers.length }} 个用户
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <select 
                      v-model="batchPermission" 
                      class="input bg-apple-gray-background-light dark:bg-gray-700 text-sm"
                    >
                      <option value="read">只读</option>
                      <option value="write">读写</option>
                      <option value="admin">管理</option>
                    </select>
                    
                    <button 
                      @click="handleBatchAddUsers" 
                      class="btn-primary text-sm"
                      :disabled="selectedBatchUsers.length === 0 || batchAdding"
                    >
                      <span v-if="batchAdding">添加中...</span>
                      <span v-else>批量添加</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 分组成员列表 -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-apple-gray-border-secondary dark:divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">用户</th>
                    <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">邮箱</th>
                    <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">权限</th>
                    <th class="px-6 py-3 bg-apple-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-apple-gray-text-secondary uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-apple-gray-border-secondary dark:divide-gray-700">
                  <tr v-if="loadingGroupUsers" class="text-center">
                    <td colspan="4" class="px-6 py-8 text-apple-gray-text-secondary dark:text-gray-400">加载中...</td>
                  </tr>
                  
                  <tr v-else-if="filteredGroupUsers.length === 0" class="text-center">
                    <td colspan="4" class="px-6 py-8 text-apple-gray-text-secondary dark:text-gray-400">
                      {{ groupUsers.length === 0 ? '该分组暂无成员' : '没有匹配的成员' }}
                    </td>
                  </tr>
                  
                  <tr v-for="member in filteredGroupUsers" :key="`${member.user_id}_${selectedGroup}`" class="hover:bg-apple-gray-background-light dark:hover:bg-gray-700/50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-apple-gray-200 dark:bg-gray-700 flex items-center justify-center text-apple-gray-text-primary dark:text-white font-medium text-sm">
                          {{ getUserInitials(member.user) }}
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-apple-gray-text-primary dark:text-white">{{ member.user.username }}</div>
                          <div class="text-xs text-apple-gray-text-secondary dark:text-gray-400">{{ member.user.first_name }} {{ member.user.last_name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-text-secondary dark:text-gray-400">
                      {{ member.user.email }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <select 
                        v-model="member.permission" 
                        class="text-sm bg-transparent border-apple-gray-border-secondary dark:border-gray-700 rounded py-1 px-2"
                        @change="updatePermission(member)"
                      >
                        <option value="read">只读</option>
                        <option value="write">读写</option>
                        <option value="admin">管理</option>
                      </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button 
                        @click="handleRemoveUserFromGroup(member.user_id)" 
                        class="text-red-600 hover:text-red-700 transition-colors text-sm"
                        :disabled="member.removing"
                      >
                        <span v-if="member.removing">移除中...</span>
                        <span v-else>移除</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 权限模板对话框 -->
  <div v-if="showTemplateDialog" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <h3 class="text-lg font-medium text-apple-gray-text-primary dark:text-white mb-4">
          {{ editingTemplate ? '编辑权限模板' : '创建权限模板' }}
        </h3>
        
        <form @submit.prevent="savePermissionTemplate">
          <div class="space-y-4">
            <div>
              <label for="templateName" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">
                模板名称
              </label>
              <input 
                id="templateName" 
                v-model="templateForm.name" 
                type="text" 
                class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                required
              />
            </div>
            
            <div>
              <label for="templateDescription" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">
                描述
              </label>
              <textarea 
                id="templateDescription" 
                v-model="templateForm.description" 
                class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
                rows="2"
              ></textarea>
            </div>
            
            <div>
              <label for="templatePermission" class="block text-sm font-medium text-apple-gray-text-secondary dark:text-gray-400 mb-1">
                默认权限
              </label>
              <select 
                id="templatePermission" 
                v-model="templateForm.permission"
                class="input w-full bg-apple-gray-background-light dark:bg-gray-700"
              >
                <option value="read">只读</option>
                <option value="write">读写</option>
                <option value="admin">管理</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeTemplateDialog" 
              class="btn-secondary"
            >
              取消
            </button>
            
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="templateSubmitting"
            >
              <span v-if="templateSubmitting">保存中...</span>
              <span v-else>保存</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useNoteStore } from '@/store/note'
import { useToast } from '@/composables/useToast'
import { 
  addUserToGroup as apiAddUserToGroup, 
  removeUserFromGroup as apiRemoveUserFromGroup,
  getRecentGroups,
  recordGroupAccess,
  getPermissionTemplates,
  createPermissionTemplate,
  updatePermissionTemplate,
  deletePermissionTemplate,
  applyPermissionTemplate,
  addUsersToGroup
} from '@/api/note'
import { getUsers, createUser, updateUser, updateUserStatus } from '@/api/auth'

const authStore = useAuthStore()
const noteStore = useNoteStore()
const { showToast } = useToast()

const activeTab = ref('users')
const loading = ref(false)
const users = ref([])
const groups = ref([])
const selectedGroup = ref('')
const groupUsers = ref([])
const loadingGroupUsers = ref(false)
const userToAdd = ref('')
const permissionToAdd = ref('read')
const addingUser = ref(false)

// 用户表单相关
const showAddUserDialog = ref(false)
const showEditUserDialog = ref(false)
const userForm = ref({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  password2: '',
  is_staff: false,
})
const passwordError = ref('')
const formSubmitting = ref(false)
const editUserId = ref(null)

// 检查是否是管理员
const isAdminUser = computed(() => {
  return authStore.isAdmin || authStore.isSuperuser
})

// 获取选中的分组名称
const selectedGroupName = computed(() => {
  const group = groups.value.find(g => g.id === selectedGroup.value)
  return group ? group.name : ''
})

// 获取不在当前分组的用户
const usersNotInGroup = computed(() => {
  const currentUserIds = groupUsers.value.map(m => m.user_id)
  return users.value.filter(user => !currentUserIds.includes(user.id))
})

// 获取用户名缩写
const getUserInitials = (user) => {
  if (!user) return '?'
  
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
  }
  
  return user.username[0].toUpperCase()
}

// 分组历史记录相关
const recentGroups = ref([])
const loadingRecentGroups = ref(false)

// 权限筛选相关
const userSearchQuery = ref('')
const permissionFilter = ref('all')
const filteredGroupUsers = computed(() => {
  if (!groupUsers.value.length) return []
  
  return groupUsers.value.filter(member => {
    // 搜索过滤
    const searchMatch = !userSearchQuery.value || 
      member.user.username.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
      member.user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
      `${member.user.first_name} ${member.user.last_name}`.toLowerCase().includes(userSearchQuery.value.toLowerCase())
    
    // 权限过滤
    const permissionMatch = permissionFilter.value === 'all' || member.permission === permissionFilter.value
    
    return searchMatch && permissionMatch
  })
})

// 权限模板相关
const permissionTemplates = ref([])
const loadingTemplates = ref(false)
const showTemplateDialog = ref(false)
const showTemplateDropdown = ref(false)
const templateDropdownRef = ref(null)
const editingTemplate = ref(false)
const templateSubmitting = ref(false)
const templateForm = ref({
  id: null,
  name: '',
  description: '',
  permission: 'read'
})

// 批量添加相关
const batchMode = ref(false)
const batchSearchQuery = ref('')
const selectedBatchUsers = ref([])
const batchPermission = ref('read')
const batchAdding = ref(false)
const filteredBatchUsers = computed(() => {
  if (!usersNotInGroup.value.length) return []
  
  if (!batchSearchQuery.value) return usersNotInGroup.value
  
  return usersNotInGroup.value.filter(user => 
    user.username.toLowerCase().includes(batchSearchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(batchSearchQuery.value.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(batchSearchQuery.value.toLowerCase())
  )
})

// 获取权限文本
const getPermissionText = (permission) => {
  switch (permission) {
    case 'read': return '只读'
    case 'write': return '读写'
    case 'admin': return '管理'
    default: return permission
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (templateDropdownRef.value && !templateDropdownRef.value.contains(event.target)) {
    showTemplateDropdown.value = false
  }
}

// 添加全局事件监听
onMounted(async () => {
  if (isAdminUser.value) {
    await Promise.all([
      loadUsers(),
      loadGroups(),
      loadRecentGroups(),
      loadPermissionTemplates()
    ])
  }
  
  document.addEventListener('click', handleClickOutside)
})

// 移除全局事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 监听选择的分组变化
watch(selectedGroup, (newValue) => {
  if (newValue) {
    // 记录分组访问 - 暂时注释掉以避免405错误
    // recordGroupAccess(newValue).catch(error => {
    //   console.error('记录分组访问失败:', error)
    // })
    console.log('选择了分组，ID:', newValue)
  }
})

// 加载最近访问的分组
const loadRecentGroups = async () => {
  loadingRecentGroups.value = true
  
  try {
    const response = await getRecentGroups()
    recentGroups.value = response.data
  } catch (error) {
    console.error('加载最近分组失败:', error)
    showToast('加载最近分组失败', 'error')
    recentGroups.value = []
  } finally {
    loadingRecentGroups.value = false
  }
}

// 选择最近访问的分组
const selectRecentGroup = (groupId) => {
  selectedGroup.value = groupId
  loadGroupUsers()
}

// 加载权限模板列表
const loadPermissionTemplates = async () => {
  loadingTemplates.value = true
  
  try {
    const response = await getPermissionTemplates()
    permissionTemplates.value = response.data
  } catch (error) {
    console.error('加载权限模板失败:', error)
    showToast('加载权限模板失败', 'error')
    permissionTemplates.value = []
  } finally {
    loadingTemplates.value = false
  }
}

// 打开权限模板对话框
const openPermissionTemplateDialog = (template = null) => {
  if (template) {
    // 编辑现有模板
    editingTemplate.value = true
    templateForm.value = {
      id: template.id,
      name: template.name,
      description: template.description || '',
      permission: template.permission
    }
  } else {
    // 创建新模板，使用当前分组权限作为默认值
    editingTemplate.value = false
    templateForm.value = {
      id: null,
      name: `${selectedGroupName.value}模板`,
      description: `分组 ${selectedGroupName.value} 的权限模板`,
      permission: permissionToAdd.value
    }
  }
  
  showTemplateDialog.value = true
}

// 关闭权限模板对话框
const closeTemplateDialog = () => {
  showTemplateDialog.value = false
  templateForm.value = {
    id: null,
    name: '',
    description: '',
    permission: 'read'
  }
}

// 保存权限模板
const savePermissionTemplate = async () => {
  if (!templateForm.value.name) {
    showToast('请输入模板名称', 'error')
    return
  }
  
  templateSubmitting.value = true
  
  try {
    if (editingTemplate.value) {
      // 更新现有模板
      await updatePermissionTemplate(templateForm.value.id, {
        name: templateForm.value.name,
        description: templateForm.value.description,
        permission: templateForm.value.permission
      })
      
      showToast('模板更新成功', 'success')
    } else {
      // 创建新模板
      await createPermissionTemplate({
        name: templateForm.value.name,
        description: templateForm.value.description,
        permission: templateForm.value.permission
      })
      
      showToast('模板创建成功', 'success')
    }
    
    // 重新加载模板列表
    await loadPermissionTemplates()
    
    // 关闭对话框
    closeTemplateDialog()
  } catch (error) {
    console.error('保存模板失败:', error)
    showToast('保存模板失败', 'error')
  } finally {
    templateSubmitting.value = false
  }
}

// 切换模板下拉菜单
const toggleTemplateDropdown = () => {
  showTemplateDropdown.value = !showTemplateDropdown.value
}

// 应用权限模板
const applyTemplate = async (templateId) => {
  if (!selectedGroup.value || !templateId) {
    showToast('请选择分组和模板', 'error')
    return
  }
  
  // 获取选中的模板
  const template = permissionTemplates.value.find(t => t.id === templateId)
  if (!template) {
    showToast('模板不存在', 'error')
    return
  }
  
  // 确认对话框
  if (!confirm(`确定要将模板 "${template.name}" 应用到当前选中的用户？`)) {
    return
  }
  
  try {
    // 如果有批量选择的用户，则应用到这些用户
    let userIds = []
    if (selectedBatchUsers.value.length > 0) {
      userIds = [...selectedBatchUsers.value]
    }
    
    // 应用模板
    const response = await applyPermissionTemplate(templateId, selectedGroup.value, userIds)
    
    showToast(`已成功应用模板: ${response.data.results.length}个用户`, 'success')
    
    // 重新加载分组用户
    await loadGroupUsers()
    
    // 关闭下拉菜单
    showTemplateDropdown.value = false
  } catch (error) {
    console.error('应用模板失败:', error)
    showToast('应用模板失败', 'error')
  }
}

// 筛选分组用户
const filterGroupUsers = () => {
  // 过滤逻辑由计算属性实现
  // 这里可以添加其他处理，例如本地存储筛选条件
  localStorage.setItem('group_user_search', userSearchQuery.value)
  localStorage.setItem('group_permission_filter', permissionFilter.value)
}

// 批量添加用户
const handleBatchAddUsers = async () => {
  if (!selectedGroup.value || selectedBatchUsers.value.length === 0) {
    showToast('请选择分组和至少一个用户', 'error')
    return
  }
  
  batchAdding.value = true
  
  try {
    // 准备用户数据
    const users = selectedBatchUsers.value.map(userId => ({
      user_id: userId,
      permission: batchPermission.value
    }))
    
    // 批量添加
    await addUsersToGroup(selectedGroup.value, users)
    
    showToast(`已成功添加${users.length}个用户`, 'success')
    
    // 重新加载分组用户
    await loadGroupUsers()
    
    // 清空选择
    selectedBatchUsers.value = []
    batchMode.value = false
  } catch (error) {
    console.error('批量添加用户失败:', error)
    showToast('批量添加用户失败', 'error')
  } finally {
    batchAdding.value = false
  }
}

// 初始化
onMounted(async () => {
  if (isAdminUser.value) {
    await Promise.all([
      loadUsers(),
      loadGroups()
    ])
  }
})

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  
  try {
    const response = await getUsers()
    console.log('加载用户列表响应:', response.data)
    
    // 判断返回数据的格式并处理
    if (response.data && response.data.results) {
      // 分页格式
      users.value = response.data.results
    } else if (Array.isArray(response.data)) {
      // 直接返回数组
      users.value = response.data
    } else {
      // 未知格式，尝试转换
      console.warn('未知的用户列表数据格式:', response.data)
      users.value = []
    }
    
    console.log('处理后的用户列表:', users.value)
    
    // 确保用户数据是数组
    if (!Array.isArray(users.value)) {
      console.error('用户数据不是数组:', users.value)
      users.value = []
    }
    
    // 显示提示，以便在UI上区分是真实数据还是模拟数据
    showToast(`已加载${users.value.length}名用户(真实API数据)`, 'success')
  } catch (error) {
    console.error('加载用户列表失败:', error)
    showToast('加载用户列表失败', 'error')
    users.value = []
  } finally {
    loading.value = false
  }
}

// 加载分组列表
const loadGroups = async () => {
  try {
    groups.value = await noteStore.fetchGroups()
    
    if (groups.value && groups.value.length > 0) {
      showToast(`已加载${groups.value.length}个分组`, 'success')
    }
  } catch (error) {
    console.error('加载分组列表失败:', error)
    showToast('加载分组列表失败', 'error')
    groups.value = []
  }
}

// 加载分组用户列表
const loadGroupUsers = async () => {
  if (!selectedGroup.value) return
  
  loadingGroupUsers.value = true
  
  try {
    // 获取分组详情
    const groupDetail = await noteStore.fetchGroup(selectedGroup.value)
    
    // 检查API返回的用户数组
    if (groupDetail.users && Array.isArray(groupDetail.users)) {
      groupUsers.value = groupDetail.users
      
      // 恢复本地存储的筛选条件
      userSearchQuery.value = localStorage.getItem('group_user_search') || ''
      permissionFilter.value = localStorage.getItem('group_permission_filter') || 'all'
      
      if (groupUsers.value.length === 0) {
        showToast('该分组暂无成员', 'info')
      } else {
        showToast(`已加载${groupUsers.value.length}名分组成员`, 'success')
      }
      
      // 记录分组访问 - 暂时注释掉以避免405错误
      // recordGroupAccess(selectedGroup.value).catch(error => {
      //   console.error('记录分组访问失败:', error)
      // })
    } else {
      console.error('API返回的用户数据结构不正确:', groupDetail)
      showToast('加载分组用户列表失败: 数据格式错误', 'error')
      groupUsers.value = []
    }
  } catch (error) {
    console.error('加载分组用户列表失败:', error)
    showToast('加载分组用户列表失败', 'error')
    groupUsers.value = []
  } finally {
    loadingGroupUsers.value = false
  }
}

// 添加用户到分组
const handleAddUserToGroup = async () => {
  if (!selectedGroup.value || !userToAdd.value) {
    showToast('请选择分组和用户', 'error')
    return
  }
  
  addingUser.value = true
  
  try {
    await apiAddUserToGroup(selectedGroup.value, userToAdd.value, permissionToAdd.value)
    
    // 添加本地记录以避免重新获取
    const user = users.value.find(u => u.id === userToAdd.value)
    if (user) {
      groupUsers.value.push({
        user_id: user.id,
        user: user,
        permission: permissionToAdd.value
      })
    }
    
    showToast('添加用户成功', 'success')
    
    // 清空选择
    userToAdd.value = ''
    
    // 重新加载分组用户以确保数据同步
    await loadGroupUsers()
  } catch (error) {
    console.error('添加用户到分组失败:', error)
    showToast('添加用户到分组失败', 'error')
  } finally {
    addingUser.value = false
  }
}

// 更新用户权限
const updatePermission = async (member) => {
  if (!selectedGroup.value) return
  
  try {
    // 添加更新中状态标记
    member.updating = true
    
    await apiAddUserToGroup(selectedGroup.value, member.user_id, member.permission)
    
    showToast('权限更新成功', 'success')
    
    // 将权限更改保存到localStorage
    localStorage.setItem(`group_${selectedGroup.value}_user_${member.user_id}_permission`, member.permission)
  } catch (error) {
    console.error('更新权限失败:', error)
    showToast('更新权限失败', 'error')
    
    // 恢复原始权限
    const originalPermission = localStorage.getItem(`group_${selectedGroup.value}_user_${member.user_id}_permission`)
    if (originalPermission) {
      member.permission = originalPermission
    }
  } finally {
    member.updating = false
  }
}

// 从分组移除用户
const handleRemoveUserFromGroup = async (userId) => {
  if (!selectedGroup.value) return
  
  // 标记正在移除的用户
  const memberIndex = groupUsers.value.findIndex(m => m.user_id === userId)
  if (memberIndex !== -1) {
    groupUsers.value[memberIndex].removing = true
  }
  
  try {
    await apiRemoveUserFromGroup(selectedGroup.value, userId)
    showToast('用户已从分组移除', 'success')
    
    // 从本地列表中移除用户
    groupUsers.value = groupUsers.value.filter(m => m.user_id !== userId)
  } catch (error) {
    console.error('从分组移除用户失败:', error)
    showToast('从分组移除用户失败', 'error')
    
    // 移除标记
    if (memberIndex !== -1) {
      groupUsers.value[memberIndex].removing = false
    }
  }
}

// 显示添加用户对话框
const showAddUser = () => {
  // 重置表单
  userForm.value = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    is_staff: false,
  }
  passwordError.value = ''
  showAddUserDialog.value = true
}

// 显示编辑用户对话框
const editUser = (user) => {
  // 不允许非超级用户编辑超级用户
  if (user.is_superuser && !authStore.isSuperuser) {
    showToast('您没有权限编辑超级管理员', 'error')
    return
  }
  
  // 设置表单数据
  userForm.value = {
    username: user.username,
    email: user.email,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    is_staff: user.is_staff,
  }
  
  editUserId.value = user.id
  showEditUserDialog.value = true
}

// 关闭用户对话框
const closeUserDialog = () => {
  showAddUserDialog.value = false
  showEditUserDialog.value = false
  editUserId.value = null
}

// 处理用户表单提交
const handleUserFormSubmit = async () => {
  // 重置错误信息
  passwordError.value = ''
  
  // 前端验证
  if (!showEditUserDialog.value) {
    // 验证用户名
    if (!userForm.value.username || userForm.value.username.trim() === '') {
      showToast('请输入用户名', 'error')
      return
    }
    
    // 验证邮箱
    if (!userForm.value.email || userForm.value.email.trim() === '') {
      showToast('请输入邮箱', 'error')
      return
    }
  
  // 验证密码
    if (!userForm.value.password) {
      showToast('请输入密码', 'error')
      return
    }
    
    // 验证确认密码
    if (!userForm.value.password2) {
      showToast('请输入确认密码', 'error')
      return
    }
    
    // 验证两次密码是否一致
    if (userForm.value.password !== userForm.value.password2) {
    passwordError.value = '两次输入的密码不一致'
    return
    }
  }
  
  formSubmitting.value = true
  
  try {
    let success = false
    
    if (showEditUserDialog.value) {
      // 更新用户
      await updateUser(editUserId.value, {
        email: userForm.value.email,
        first_name: userForm.value.first_name || '',
        last_name: userForm.value.last_name || '',
        is_staff: userForm.value.is_staff,
      })
      
      showToast('用户已更新', 'success')
      success = true
    } else {
      // 创建用户
      const userData = {
        username: userForm.value.username,
        email: userForm.value.email || '',
        first_name: userForm.value.first_name || '',
        last_name: userForm.value.last_name || '',
        password: userForm.value.password,
        password2: userForm.value.password2,
        is_staff: userForm.value.is_staff,
      }
      
      console.log('提交用户数据:', userData)
      const response = await createUser(userData)
      console.log('创建用户响应:', response.data)
      
      showToast('用户已创建', 'success')
      success = true
    }
    
    // 关闭对话框
    closeUserDialog()
    
    // 只有成功才刷新
    if (success) {
      // 强制延迟一下再刷新列表，确保后端数据已更新
      setTimeout(async () => {
        try {
          await loadUsers()
          console.log('刷新后的用户列表:', users.value)
        } catch (refreshError) {
          console.error('刷新用户列表失败:', refreshError)
        }
      }, 500)
    }
  } catch (error) {
    console.error('提交用户表单失败:', error)
    
    // 尝试获取详细错误信息
    let errorMessage = '操作失败，请稍后重试'
    
    if (error.response && error.response.data) {
      const responseData = error.response.data
      
      // 处理各种字段错误
      if (typeof responseData === 'object') {
        // 尝试提取第一个错误信息
        for (const field in responseData) {
          if (Array.isArray(responseData[field]) && responseData[field].length > 0) {
            errorMessage = `${field}: ${responseData[field][0]}`
            break
          } else if (typeof responseData[field] === 'string') {
            errorMessage = `${field}: ${responseData[field]}`
            break
          }
        }
        
        // 如果存在detail字段，使用它
        if (responseData.detail) {
          errorMessage = responseData.detail
        }
      } else if (typeof responseData === 'string') {
        errorMessage = responseData
      }
    }
    
    showToast(errorMessage, 'error')
  } finally {
    formSubmitting.value = false
  }
}

// 切换用户状态(启用/停用)
const toggleUserStatus = async (user) => {
  // 不能修改超级用户或自己
  if (user.is_superuser || user.id === authStore.user?.id) {
    showToast('无法修改此用户的状态', 'error')
    return
  }
  
  // 设置标记，防止重复点击
  const userIndex = users.value.findIndex(u => u.id === user.id)
  if (userIndex !== -1) {
    users.value[userIndex].updating = true
  }
  
  try {
    await updateUserStatus(user.id, !user.is_active)
    
    // 更新本地用户状态
    if (userIndex !== -1) {
      users.value[userIndex].is_active = !user.is_active
      showToast(`用户已${user.is_active ? '停用' : '启用'}`, 'success')
    }
  } catch (error) {
    console.error('更新用户状态失败:', error)
    showToast('更新用户状态失败', 'error')
  } finally {
    if (userIndex !== -1) {
      users.value[userIndex].updating = false
    }
  }
}
</script>

<style scoped>
.content-block {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-apple-sm;
}
</style> 