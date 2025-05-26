import { ref } from 'vue'

// 创建共享状态
const visible = ref(false)
const message = ref('')
const type = ref('info') // 'info', 'success', 'warning', 'error'
const duration = ref(3000)
let timeoutId = null

/**
 * 使用Toast通知
 * @returns {Object} Toast对象
 */
export function useToast() {
  /**
   * 显示Toast通知
   * @param {string} msg 通知消息
   * @param {string} toastType 通知类型
   * @param {number} toastDuration 显示时长（毫秒）
   */
  const showToast = (msg, toastType = 'info', toastDuration = 3000) => {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 设置新的通知
    message.value = msg
    type.value = toastType
    duration.value = toastDuration
    visible.value = true

    // 设置自动关闭
    timeoutId = setTimeout(() => {
      closeToast()
    }, toastDuration)
  }

  /**
   * 关闭Toast通知
   */
  const closeToast = () => {
    visible.value = false
  }

  return {
    showToast,
    toastVisible: visible,
    toastMessage: message,
    toastType: type,
    closeToast
  }
}

// 默认导出
export default useToast 