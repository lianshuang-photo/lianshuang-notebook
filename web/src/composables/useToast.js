import { ref, readonly } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref('info'); // success, error, warning, info
const duration = ref(3000);

// 处理同时展示多个Toast的队列
const toastQueue = [];
let isProcessing = false;

const processQueue = () => {
  if (toastQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const nextToast = toastQueue.shift();
  
  message.value = nextToast.message;
  type.value = nextToast.type;
  duration.value = nextToast.duration;
  visible.value = true;

  // 当前Toast结束后，处理队列中的下一个
  setTimeout(() => {
    visible.value = false;
    
    // 延迟处理下一个，给当前Toast一点消失的时间
    setTimeout(() => {
      processQueue();
    }, 300);
  }, duration.value);
};

export function useToast() {
  /**
   * 显示一个Toast通知
   * @param {string} text - 显示的消息
   * @param {string} toastType - 通知类型 (success, error, warning, info)
   * @param {number} toastDuration - 持续时间(毫秒)
   */
  const showToast = (text, toastType = 'info', toastDuration = 3000) => {
    // 将Toast添加到队列
    toastQueue.push({
      message: text,
      type: toastType,
      duration: toastDuration
    });

    // 如果没有正在处理的Toast，开始处理队列
    if (!isProcessing) {
      processQueue();
    }
  };

  /**
   * 关闭当前Toast
   */
  const closeToast = () => {
    visible.value = false;
    
    // 延迟处理下一个
    setTimeout(() => {
      if (toastQueue.length > 0) {
        processQueue();
      } else {
        isProcessing = false;
      }
    }, 300);
  };

  return {
    showToast,
    closeToast,
    toastVisible: readonly(visible),
    toastMessage: readonly(message),
    toastType: readonly(type)
  };
} 