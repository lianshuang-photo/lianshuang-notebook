import { defineStore } from 'pinia'
import { 
  getNotes, getNote, createNote, updateNote, deleteNote, getRecentNotes,
  getNoteGroups, getNoteGroup, createNoteGroup, updateNoteGroup, deleteNoteGroup,
  getNotesByGroup, searchNotes, exportNote, exportNotesBulk, importNote
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
      this.loading = true
      this.error = null
      
      try {
        const response = await searchNotes(query)
        this.searchResults = response.data
        return this.searchResults
      } catch (error) {
        this.error = error.response?.data || { message: '搜索笔记失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 导出单个笔记
    async exportNoteAction(id, format = 'json') {
      this.loading = true
      this.error = null
      
      try {
        const response = await exportNote(id, format)
        
        // 创建下载链接
        const blob = new Blob([response.data], { 
          type: this.getContentType(format)
        })
        const url = window.URL.createObjectURL(blob)
        
        // 获取笔记标题用于文件名
        let fileName = 'note'
        const note = this.getNoteById(id)
        if (note) {
          fileName = note.title.replace(/\s+/g, '_')
        }
        
        // 触发下载
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${fileName}.${format}`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        return true
      } catch (error) {
        this.error = error.response?.data || { message: '导出笔记失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 批量导出笔记
    async exportNotesBulkAction(params) {
      this.loading = true
      this.error = null
      
      try {
        const response = await exportNotesBulk(params)
        
        // 确定文件扩展名
        const format = params.format || 'json'
        
        // 创建下载链接
        const blob = new Blob([response.data], { 
          type: this.getContentType(format)
        })
        const url = window.URL.createObjectURL(blob)
        
        // 生成文件名
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const fileName = `notes_export_${date}.${format}`
        
        // 触发下载
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        return true
      } catch (error) {
        this.error = error.response?.data || { message: '批量导出笔记失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 导入笔记
    async importNoteAction(importData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await importNote(importData)
        
        // 如果导入成功，刷新笔记列表
        if (response.data.success) {
          if (importData.group_id) {
            await this.fetchNotesByGroup(importData.group_id)
          } else {
            await this.fetchNotes()
          }
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data || { message: '导入笔记失败' }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取内容类型
    getContentType(format) {
      switch (format.toLowerCase()) {
        case 'json':
          return 'application/json'
        case 'md':
          return 'text/markdown'
        case 'txt':
          return 'text/plain'
        case 'csv':
          return 'text/csv'
        case 'zip':
          return 'application/zip'
        default:
          return 'application/octet-stream'
      }
    }
  }
}) 
 