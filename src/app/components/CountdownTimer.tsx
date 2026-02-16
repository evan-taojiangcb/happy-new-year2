'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CountdownState } from '@/app/lib/types'

interface CountdownTimerProps {
  targetDate: string // ISO格式的目标日期，如 "2026-02-16T23:59:59+08:00"
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  })

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = target - now

      if (distance < 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true
        })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isCompleted: false
      })
    }

    // 立即更新一次
    updateCountdown()

    // 每秒更新
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  // 数字卡片组件
  const NumberCard = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      key={`${label}-${value}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        {/* 数字卡片 */}
        <div className="w-20 h-24 bg-gradient-to-b from-red-600 to-red-700 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
          {/* 光泽效果 */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
          
          {/* 数字 */}
          <span className="text-4xl font-bold text-white tracking-wider">
            {value.toString().padStart(2, '0')}
          </span>
          
          {/* 卡片底部装饰 */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
        </div>
        
        {/* 卡片阴影 */}
        <div className="absolute -bottom-1 left-1 right-1 h-2 bg-red-900/30 blur-sm rounded-full"></div>
      </div>
      
      {/* 标签 */}
      <span className="mt-3 text-sm font-medium text-gray-700 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  )

  // 分隔符组件
  const Separator = () => (
    <div className="flex flex-col items-center justify-center mx-2">
      <div className="w-2 h-2 bg-red-500 rounded-full mb-1"></div>
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
    </div>
  )

  if (countdown.isCompleted) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-block"
        >
          <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white text-3xl font-bold py-6 px-10 rounded-2xl shadow-xl animate-pulse">
            🎉 除夕快乐！愿望正在放飞中... 🎉
          </div>
        </motion.div>
        <p className="mt-4 text-lg text-gray-600">
          所有愿望已升空，愿所有美好如期而至！
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        ⏳ 距离2026年除夕愿望放飞还有
      </h2>
      
      <div className="flex justify-center items-center space-x-4 mb-8">
        <NumberCard value={countdown.days} label="天" />
        <Separator />
        <NumberCard value={countdown.hours} label="时" />
        <Separator />
        <NumberCard value={countdown.minutes} label="分" />
        <Separator />
        <NumberCard value={countdown.seconds} label="秒" />
      </div>

      {/* 进度条 */}
      <div className="max-w-2xl mx-auto">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ 
              width: `${100 - (countdown.days / 365) * 100}%` 
            }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          倒计时进行中... {countdown.days}天后就是除夕夜！
        </p>
      </div>

      {/* 提示信息 */}
      <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200 inline-block">
        <p className="text-red-700 font-medium">
          ⚠️ 倒计时结束后，所有愿望将自动触发"放飞"动画！
        </p>
        <p className="text-red-600 text-sm mt-1">
          请在 {targetDate.split('T')[0]} 23:59:59 前写下你的愿望
        </p>
      </div>
    </div>
  )
}