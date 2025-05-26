/**
 * 笔记导入导出工具
 * 支持导出为Markdown、HTML、PDF格式
 * 支持从其他笔记应用导入数据
 */

import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import showdown from 'showdown'

/**
 * 导出笔记为Markdown文件
 * @param {Object} note 笔记对象
 */
export const exportAsMarkdown = (note) => {
  if (!note || !note.content) return
  
  const filename = `${note.title || 'untitled'}.md`
  const content = note.content
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  
  saveAs(blob, filename)
}

/**
 * 导出笔记为HTML文件
 * @param {Object} note 笔记对象
 */
export const exportAsHTML = (note) => {
  if (!note || !note.content) return
  
  const filename = `${note.title || 'untitled'}.html`
  const converter = new showdown.Converter({
    tables: true,
    tasklists: true,
    strikethrough: true
  })
  
  // 转换Markdown为HTML
  const htmlContent = converter.makeHtml(note.content)
  
  // 创建完整的HTML文档
  const fullHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title || 'LS笔记导出'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
      background-color: rgba(27,31,35,0.05);
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      margin: 0;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    table th, table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    table tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    img {
      max-width: 100%;
    }
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
    .metadata {
      color: #6a737d;
      font-size: 0.9em;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eaecef;
    }
  </style>
</head>
<body>
  <h1>${note.title || 'LS笔记导出'}</h1>
  <div class="metadata">
    <div>创建时间: ${new Date(note.created_at).toLocaleString()}</div>
    <div>更新时间: ${new Date(note.updated_at).toLocaleString()}</div>
    ${note.group ? `<div>分组: ${note.group.name}</div>` : ''}
    <div>由 LS笔记 导出</div>
  </div>
  ${htmlContent}
</body>
</html>
  `.trim()
  
  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' })
  saveAs(blob, filename)
}

/**
 * 导出笔记为PDF文件
 * @param {Object} note 笔记对象
 * @param {HTMLElement} contentElement 包含渲染后笔记内容的DOM元素
 */
export const exportAsPDF = async (note, contentElement) => {
  if (!note || !contentElement) return
  
  try {
    const filename = `${note.title || 'untitled'}.pdf`
    
    // 创建一个临时容器来渲染笔记内容
    const container = document.createElement('div')
    container.style.width = '800px'
    container.style.padding = '20px'
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.background = 'white'
    
    // 添加标题和元数据
    const titleElement = document.createElement('h1')
    titleElement.textContent = note.title || 'LS笔记导出'
    container.appendChild(titleElement)
    
    const metadataElement = document.createElement('div')
    metadataElement.style.color = '#6a737d'
    metadataElement.style.fontSize = '0.9em'
    metadataElement.style.marginBottom = '20px'
    metadataElement.style.paddingBottom = '10px'
    metadataElement.style.borderBottom = '1px solid #eaecef'
    
    metadataElement.innerHTML = `
      <div>创建时间: ${new Date(note.created_at).toLocaleString()}</div>
      <div>更新时间: ${new Date(note.updated_at).toLocaleString()}</div>
      ${note.group ? `<div>分组: ${note.group.name}</div>` : ''}
      <div>由 LS笔记 导出</div>
    `
    container.appendChild(metadataElement)
    
    // 克隆笔记内容
    const contentClone = contentElement.cloneNode(true)
    container.appendChild(contentClone)
    
    // 将容器添加到文档中以便渲染
    document.body.appendChild(container)
    
    // 使用html2canvas将内容转换为图像
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    // 创建PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // 计算PDF页面尺寸
    const imgWidth = 210 // A4宽度，单位mm
    const imgHeight = canvas.height * imgWidth / canvas.width
    
    // 添加图像到PDF
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    
    // 如果内容太长，需要分页
    let heightLeft = imgHeight
    let position = 0
    
    while (heightLeft > 297) { // A4高度为297mm
      position = heightLeft - 297
      
      // 添加新页
      pdf.addPage()
      
      // 在新页上继续添加图像
      pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight)
      
      heightLeft -= 297
    }
    
    // 保存PDF
    pdf.save(filename)
    
    // 清理临时DOM元素
    document.body.removeChild(container)
  } catch (error) {
    console.error('导出PDF失败:', error)
    throw new Error('导出PDF失败')
  }
}

/**
 * 解析导入的文件内容
 * @param {File} file 导入的文件
 * @returns {Promise<Object>} 解析后的笔记数据
 */
export const parseImportFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const content = event.target.result
        
        // 根据文件类型解析内容
        if (file.name.endsWith('.md')) {
          // 直接作为Markdown内容导入
          resolve({
            title: file.name.replace('.md', ''),
            content
          })
        } else if (file.name.endsWith('.json')) {
          // 尝试解析为JSON格式
          const data = JSON.parse(content)
          
          // 处理不同笔记应用的导出格式
          if (data.title && data.content) {
            // 标准格式
            resolve({
              title: data.title,
              content: data.content
            })
          } else if (data.cells) {
            // Jupyter Notebook格式
            const markdownContent = data.cells
              .filter(cell => cell.cell_type === 'markdown')
              .map(cell => cell.source.join(''))
              .join('\n\n')
            
            const codeContent = data.cells
              .filter(cell => cell.cell_type === 'code')
              .map(cell => '```\n' + cell.source.join('') + '\n```')
              .join('\n\n')
            
            resolve({
              title: file.name.replace('.json', ''),
              content: markdownContent + '\n\n' + codeContent
            })
          } else if (data.notes) {
            // 印象笔记格式
            const note = data.notes[0] || {}
            resolve({
              title: note.title || file.name.replace('.json', ''),
              content: note.content || ''
            })
          } else {
            reject(new Error('不支持的JSON格式'))
          }
        } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          // 尝试从HTML中提取内容
          const parser = new DOMParser()
          const doc = parser.parseFromString(content, 'text/html')
          
          // 获取标题
          const title = doc.querySelector('title')?.textContent || file.name.replace(/\.(html|htm)$/, '')
          
          // 获取正文内容
          const body = doc.querySelector('body')
          
          // 使用showdown将HTML转换回Markdown
          const converter = new showdown.Converter({
            tables: true,
            tasklists: true,
            strikethrough: true
          })
          
          const markdown = converter.makeMarkdown(body.innerHTML)
          
          resolve({
            title,
            content: markdown
          })
        } else {
          // 其他格式作为纯文本导入
          resolve({
            title: file.name.split('.')[0],
            content
          })
        }
      } catch (error) {
        reject(new Error(`解析文件失败: ${error.message}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'))
    }
    
    // 根据文件类型选择读取方式
    if (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      reader.readAsText(file)
    } else {
      reject(new Error('不支持的文件格式'))
    }
  })
}

/**
 * 批量导入笔记
 * @param {FileList} files 导入的文件列表
 * @returns {Promise<Array>} 解析后的笔记数据数组
 */
export const batchImportNotes = async (files) => {
  const results = []
  const errors = []
  
  for (let i = 0; i < files.length; i++) {
    try {
      const noteData = await parseImportFile(files[i])
      results.push(noteData)
    } catch (error) {
      errors.push({
        fileName: files[i].name,
        error: error.message
      })
    }
  }
  
  return {
    success: results,
    errors
  }
} 