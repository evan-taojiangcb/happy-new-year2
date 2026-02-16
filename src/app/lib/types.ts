// 愿望数据类型
export interface Wish {
  wishId: string
  userId: string
  nickname: string
  content: string
  gender: 'male' | 'female' | 'secret'
  contact?: string
  createdAt: number
  status: 'active' | 'released'
}

// 创建愿望的请求数据
export interface CreateWishRequest {
  userId: string
  nickname: string
  content: string
  gender: 'male' | 'female' | 'secret'
  contact?: string
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 愿望列表响应
export interface WishesResponse {
  wishes: Wish[]
  nextToken?: string
  total?: number
}

// 用户状态
export interface UserState {
  userId: string
  wishCount: number
  remainingWishes: number
}

// 倒计时状态
export interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  isCompleted: boolean
}

// 表单验证错误
export interface FormErrors {
  nickname?: string
  content?: string
  contact?: string
  gender?: string
}

// 春节主题颜色
export const ThemeColors = {
  primary: '#D32F2F', // 中国红
  secondary: '#FFD700', // 金色
  background: '#FFF8E1', // 淡黄色背景
  card: '#FFFFFF', // 卡片白色
  text: '#333333', // 主要文字
  textSecondary: '#666666', // 次要文字
}

// 性别选项
export const GenderOptions = [
  { value: 'male', label: '男', emoji: '👨' },
  { value: 'female', label: '女', emoji: '👩' },
  { value: 'secret', label: '保密', emoji: '🙈' },
] as const

// 表单配置
export const FormConfig = {
  nickname: {
    maxLength: 20,
    placeholder: '请输入昵称（最多20字）',
  },
  content: {
    maxLength: 200,
    placeholder: '写下你的新年愿望（最多200字）',
    rows: 4,
  },
  contact: {
    maxLength: 100,
    placeholder: '可选：微信号/手机号/邮箱（仅作展示）',
  },
} as const