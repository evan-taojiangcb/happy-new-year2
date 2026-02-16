'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  const [prevCountdown, setPrevCountdown] = useState<CountdownState>(countdown)

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

      const newCountdown = {
        days,
        hours,
        minutes,
        seconds,
        isCompleted: false
      }

      setPrevCountdown(countdown)
      setCountdown(newCountdown)
    }

    // 立即更新一次
    updateCountdown()

    // 每秒更新
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  // 数字翻动卡片组件 - 使用React.memo避免不必要的重渲染
  const FlipNumberCard = React.memo(({ value, label, prevValue }: { value: number; label: string; prevValue: number }) => {
    const [isFlipping, setIsFlipping] = useState(false)
    const prevValueRef = useRef(prevValue)

    useEffect(() => {
      // 只有当值真正变化时才触发动画
      if (prevValueRef.current !== value) {
        setIsFlipping(true)
        const timer = setTimeout(() => {
          setIsFlipping(false)
          prevValueRef.current = value
        }, 300)
        return () => clearTimeout(timer)
      }
    }, [value])

    // 如果prevValue变化，更新ref但不触发动画
    useEffect(() => {
      prevValueRef.current = prevValue
    }, [prevValue])

    const displayValue = value.toString().padStart(2, '0')
    const displayPrevValue = prevValue.toString().padStart(2, '0')

    return (
      <motion.div
        key={`${label}-${value}`}
        className="flex flex-col items-center"
      >
        <div className="relative">
          {/* 数字卡片容器 */}
          <div className="w-20 h-24 bg-gradient-to-b from-red-600 to-red-700 rounded-lg shadow-lg overflow-hidden relative">
            {/* 当前数字（上层） */}
            <motion.div
              animate={isFlipping ? {
                rotateX: -90,
                y: -12
              } : {
                rotateX: 0,
                y: 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-red-600 to-red-700 flex items-center justify-center">
                <span className="text-4xl font-bold text-white tracking-wider">
                  {displayValue}
                </span>
              </div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
            </motion.div>

            {/* 上一个数字（下层） */}
            <motion.div
              animate={isFlipping ? {
                rotateX: 0,
                y: 0
              } : {
                rotateX: 90,
                y: 12
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-red-700 to-red-800 flex items-center justify-center">
                <span className="text-4xl font-bold text-white/80 tracking-wider">
                  {displayPrevValue}
                </span>
              </div>
            </motion.div>

            {/* 卡片分割线 */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-black/20 z-10"></div>
            
            {/* 顶部光泽效果 */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent z-5"></div>
            
            {/* 卡片底部装饰 */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
          </div>
          
          {/* 卡片阴影 */}
          <div className="absolute -bottom-1 left-1 right-1 h-2 bg-red-900/30 blur-sm rounded-full"></div>
          
          {/* 翻动时的光效 */}
          {isFlipping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-yellow-200/30 to-transparent rounded-lg"
            />
          )}
        </div>
        
        {/* 标签 */}
        <span className="mt-3 text-sm font-medium text-gray-700 uppercase tracking-wider">
          {label}
        </span>
      </motion.div>
    )
  }

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
        <FlipNumberCard value={countdown.days} prevValue={prevCountdown.days} label="天" />
        <Separator />
        <FlipNumberCard value={countdown.hours} prevValue={prevCountdown.hours} label="时" />
        <Separator />
        <FlipNumberCard value={countdown.minutes} prevValue={prevCountdown.minutes} label="分" />
        <Separator />
        <FlipNumberCard value={countdown.seconds} prevValue={prevCountdown.seconds} label="秒" />
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