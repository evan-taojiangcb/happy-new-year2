'use client'

import { motion } from 'framer-motion'
import { Wish, GenderOptions, ThemeColors } from '@/app/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface WishCardProps {
  wish: Wish
}

export default function WishCard({ wish }: WishCardProps) {
  // 获取性别显示信息
  const genderInfo = GenderOptions.find(g => g.value === wish.gender) || GenderOptions[2]
  
  // 格式化时间
  const timeAgo = formatDistanceToNow(new Date(wish.createdAt), {
    addSuffix: true,
    locale: zhCN
  })

  // 卡片颜色根据性别变化
  const getCardColor = () => {
    switch (wish.gender) {
      case 'male':
        return 'border-blue-100 bg-blue-50'
      case 'female':
        return 'border-pink-100 bg-pink-50'
      default:
        return 'border-gray-100 bg-white'
    }
  }

  // 获取性别图标颜色
  const getGenderColor = () => {
    switch (wish.gender) {
      case 'male':
        return 'text-blue-500'
      case 'female':
        return 'text-pink-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl shadow-lg p-6 border-2 ${getCardColor()} hover:shadow-xl transition-shadow duration-300 relative overflow-hidden`}
    >
      {/* 装饰角标 */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rotate-45"></div>
      </div>

      {/* 福字背景水印 */}
      <div className="absolute bottom-2 right-2 text-red-100 text-6xl opacity-10 select-none">福</div>

      {/* 卡片内容 */}
      <div className="relative z-10">
        {/* 用户信息行 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`text-2xl ${getGenderColor()}`}>
              {genderInfo.emoji}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{wish.nickname}</h3>
              <p className="text-sm text-gray-500">{timeAgo}</p>
            </div>
          </div>
          
          <div className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
            {genderInfo.label}
          </div>
        </div>

        {/* 愿望内容 */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {wish.content}
          </p>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* 联系方式（如果有） */}
        {wish.contact && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{wish.contact}</span>
            </div>
          </div>
        )}

        {/* 状态标签 */}
        <div className="mt-4 flex justify-end">
          <span className={`text-xs px-2 py-1 rounded ${
            wish.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {wish.status === 'active' ? '🕊️ 等待放飞' : '🎉 已放飞'}
          </span>
        </div>
      </div>

      {/* 装饰边框 */}
      <div className="absolute inset-0 border-2 border-red-200 rounded-xl pointer-events-none opacity-30"></div>
    </motion.div>
  )
}