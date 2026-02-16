/**
 * 工具函数集合
 */

/**
 * 生成随机UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 生成短ID
 */
export function generateShortId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * 格式化时间戳为可读时间
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 计算相对时间（如"3天前"）
 */
export function timeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const year = day * 365
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute)
    return `${minutes}分钟前`
  } else if (diff < day) {
    const hours = Math.floor(diff / hour)
    return `${hours}小时前`
  } else if (diff < month) {
    const days = Math.floor(diff / day)
    return `${days}天前`
  } else if (diff < year) {
    const months = Math.floor(diff / month)
    return `${months}个月前`
  } else {
    const years = Math.floor(diff / year)
    return `${years}年前`
  }
}

/**
 * 截断文本并添加省略号
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式（中国）
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 生成随机颜色
 */
export function getRandomColor(): string {
  const colors = [
    '#D32F2F', // 红
    '#1976D2', // 蓝
    '#388E3C', // 绿
    '#F57C00', // 橙
    '#7B1FA2', // 紫
    '#C2185B', // 粉
    '#0097A7', // 青
    '#5D4037', // 棕
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 获取性别显示文本
 */
export function getGenderDisplay(gender: 'male' | 'female' | 'secret'): {
  text: string
  emoji: string
  color: string
} {
  switch (gender) {
    case 'male':
      return { text: '男', emoji: '👨', color: 'text-blue-500' }
    case 'female':
      return { text: '女', emoji: '👩', color: 'text-pink-500' }
    default:
      return { text: '保密', emoji: '🙈', color: 'text-gray-500' }
  }
}

/**
 * 计算剩余天数
 */
export function getDaysRemaining(targetDate: string): number {
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const diff = target - now
  
  if (diff <= 0) return 0
  
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 安全获取localStorage
 */
export function getLocalStorage(key: string, defaultValue: any = null): any {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

/**
 * 安全设置localStorage
 */
export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

/**
 * 生成随机祝福语
 */
export function getRandomBlessing(): string {
  const blessings = [
    '愿所有美好如期而至',
    '新年快乐，万事如意',
    '心想事成，梦想成真',
    '身体健康，平安喜乐',
    '财源广进，事业有成',
    '家庭幸福，和睦美满',
    '学业进步，金榜题名',
    '爱情甜蜜，白头偕老',
  ]
  return blessings[Math.floor(Math.random() * blessings.length)]
}