import { defineStore } from 'pinia'
import { 
  getNotes, getNote, createNote, updateNote, deleteNote, getRecentNotes,
  getNoteGroups, getNoteGroup, createNoteGroup, updateNoteGroup, deleteNoteGroup,
  getNotesByGroup, searchNotes
} from '@/api/note'

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [],
    currentNote: null,
    recentNotes: [],
    groups: [],
    currentGroup: null,
    searchResults: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getNoteById: (state) => (id) => {
      return state.notes.find(note => note.id === id) || null
    },
    
    getGroupById: (state) => (id) => {
      return state.groups.find(group => group.id === id) || null
    }
  },
  
  actions: {
    async fetchNotes(params) {
      this.loading = true
      this.error = null
      
      try {
        const response = await getNotes(params)
        this.notes = response.data.results || response.data
        
        // 缓存笔记数据到localStorage，供搜索API使用
        try {
          localStorage.setItem('cached_notes', JSON.stringify(this.notes))
          console.log('笔记数据已缓存到localStorage')
        } catch (cacheError) {
          console.warn('缓存笔记数据失败:', cacheError)
        }
        
        return this.notes
      } catch (error) {
        this.error = error.response?.data || { message: '获取笔记列表失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchNote(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await getNote(id)
        this.currentNote = response.data
        return this.currentNote
      } catch (error) {
        this.error = error.response?.data || { message: '获取笔记详情失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async saveNote(noteData) {
      this.loading = true
      this.error = null
      
      try {
        let response
        
        // 准备API需要的数据格式
        const apiNoteData = {
          title: noteData.title,
          content: noteData.content,
          group_id: noteData.group // 确保使用group_id字段
        }
        
        console.log('保存笔记数据:', apiNoteData)
        
        if (noteData.id) {
          // 更新现有笔记
          response = await updateNote(noteData.id, apiNoteData)
          
          // 更新状态
          const index = this.notes.findIndex(note => note.id === noteData.id)
          if (index !== -1) {
            this.notes[index] = response.data
          }
          
          this.currentNote = response.data
        } else {
          // 创建新笔记
          response = await createNote(apiNoteData)
          
          // 更新状态
          this.notes.unshift(response.data)
          this.currentNote = response.data
        }
        
        return response.data
      } catch (error) {
        console.error('保存笔记失败:', error.response?.data || error)
        this.error = error.response?.data || { message: '保存笔记失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async removeNote(id) {
      this.loading = true
      this.error = null
      
      try {
        await deleteNote(id)
        
        // 更新状态
        this.notes = this.notes.filter(note => note.id !== id)
        
        if (this.currentNote && this.currentNote.id === id) {
          this.currentNote = null
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data || { message: '删除笔记失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchRecentNotes() {
      this.loading = true
      this.error = null
      
      try {
        const response = await getRecentNotes()
        this.recentNotes = response.data
        return this.recentNotes
      } catch (error) {
        this.error = error.response?.data || { message: '获取最近笔记失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchNotesByGroup(groupId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await getNotesByGroup(groupId)
        this.notes = response.data
        return this.notes
      } catch (error) {
        this.error = error.response?.data || { message: '获取分组笔记失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchGroups(params) {
      this.loading = true
      this.error = null
      
      try {
        const response = await getNoteGroups(params)
        this.groups = response.data.results || response.data
        return this.groups
      } catch (error) {
        this.error = error.response?.data || { message: '获取笔记分组失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchGroup(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await getNoteGroup(id)
        this.currentGroup = response.data
        return this.currentGroup
      } catch (error) {
        this.error = error.response?.data || { message: '获取分组详情失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async saveGroup(groupData) {
      this.loading = true
      this.error = null
      
      try {
        let response
        
        if (groupData.id) {
          console.log('更新分组', groupData)
          // 更新现有分组
          response = await updateNoteGroup(groupData.id, groupData)
          
          // 更新状态
          const index = this.groups.findIndex(group => group.id === groupData.id)
          if (index !== -1) {
            this.groups[index] = response.data
          }
          
          this.currentGroup = response.data
        } else {
          console.log('创建分组', groupData)
          // 创建新分组
          response = await createNoteGroup(groupData)
          
          // 更新状态
          this.groups.unshift(response.data)
          this.currentGroup = response.data
        }
        
        console.log('分组保存成功', response.data)
        return response.data
      } catch (error) {
        console.error('保存分组失败:', error)
        this.error = error.response?.data || { message: '保存分组失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async removeGroup(id) {
      this.loading = true
      this.error = null
      
      try {
        await deleteNoteGroup(id)
        
        // 更新状态
        this.groups = this.groups.filter(group => group.id !== id)
        
        if (this.currentGroup && this.currentGroup.id === id) {
          this.currentGroup = null
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data || { message: '删除分组失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async searchNotesAction(query) {
      if (!query.trim()) {
        this.searchResults = []
        return []
      }
      
      this.loading = true
      this.error = null
      
      try {
        // searchNotes方法现在直接使用本地搜索，不会出现404错误
        console.log('开始搜索笔记, 关键词:', query)
        
        try {
          const response = await searchNotes(query)
          const results = response.data.results || response.data
          
          // 将结果转换为数组
          this.searchResults = Array.isArray(results) ? results : []
          
          console.log('笔记搜索完成, 找到:', this.searchResults.length, '条结果')
          return this.searchResults
        } catch (error) {
          console.warn('API搜索失败，尝试其他方案:', error)
          throw error // 让外层捕获并执行备用搜索
        }
      } catch (error) {
        console.error('搜索操作失败，使用备用方案:', error)
        
        // 备用方案: 使用内存中已有的笔记数据
        if (this.notes.length > 0) {
          console.log('使用已加载的笔记数据进行搜索')
          
          const queryLower = query.toLowerCase()
          this.searchResults = this.notes.filter(note => 
            note.title.toLowerCase().includes(queryLower) || 
            (note.content && note.content.toLowerCase().includes(queryLower))
          )
          
          console.log('备用方案搜索结果:', this.searchResults.length, '条记录')
          return this.searchResults
        } else {
          console.log('尝试从localStorage加载笔记数据')
          
          try {
            const cachedNotes = localStorage.getItem('cached_notes')
            if (cachedNotes) {
              const notes = JSON.parse(cachedNotes)
              const queryLower = query.toLowerCase()
              
              this.searchResults = notes.filter(note => 
                note.title.toLowerCase().includes(queryLower) || 
                (note.content && note.content.toLowerCase().includes(queryLower))
              )
              
              console.log('从缓存搜索结果:', this.searchResults.length, '条记录')
              return this.searchResults
            }
          } catch (localError) {
            console.error('本地缓存搜索失败:', localError)
          }
          
          // 所有方案都失败，返回空数组
          this.searchResults = []
          return []
        }
      } finally {
        this.loading = false
      }
    }
  }
}) 
 