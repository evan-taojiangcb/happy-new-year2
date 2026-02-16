'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wish } from '@/app/lib/types'

interface ReleaseAnimationProps {
  wishes: Wish[]
  isTriggered: boolean
  onComplete?: () => void
}

export default function ReleaseAnimation({ wishes, isTriggered, onComplete }: ReleaseAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<NodeJS.Timeout>()

  // 初始化粒子
  useEffect(() => {
    if (!isTriggered || !containerRef.current) return

    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1
    }))
    setParticles(newParticles)

    setIsAnimating(true)
    setAnimationProgress(0)

    // 动画进度
    let progress = 0
    const interval = setInterval(() => {
      progress += 1
      setAnimationProgress(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsAnimating(false)
          onComplete?.()
        }, 1000)
      }
    }, 50)

    return () => {
      clearInterval(interval)
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [isTriggered, onComplete])

  // 粒子动画
  useEffect(() => {
    if (!isAnimating || particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y - p.speed,
        x: p.x + (Math.random() - 0.5) * 0.5
      })).filter(p => p.y > -10))
    }, 50)

    return () => clearInterval(interval)
  }, [isAnimating, particles.length])

  if (!isTriggered || !isAnimating) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
    >
      {/* 半透明遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        className="absolute inset-0 bg-black"
      />

      {/* 愿望卡片放飞动画 */}
      <AnimatePresence>
        {wishes.map((wish, index) => {
          const delay = index * 0.1
          const duration = 3
          const startX = Math.random() * 80 + 10 // 10% - 90%
          
          return (
            <motion.div
              key={`wish-${wish.wishId}`}
              initial={{
                x: `${startX}vw`,
                y: '100vh',
                scale: 1,
                opacity: 1,
                rotate: 0
              }}
              animate={{
                x: `${startX + (Math.random() - 0.5) * 20}vw`,
                y: '-100vh',
                scale: [1, 1.2, 0.8, 0],
                opacity: [1, 1, 0.5, 0],
                rotate: [0, 180, 360, 540]
              }}
              transition={{
                duration,
                delay,
                ease: "easeOut"
              }}
              className="absolute w-64"
              style={{
                zIndex: 1000 + index
              }}
            >
              {/* 模拟愿望卡片 */}
              <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-yellow-300">
                <div className="flex items-center mb-2">
                  <div className="text-2xl mr-2">
                    {wish.gender === 'male' ? '👨' : wish.gender === 'female' ? '👩' : '🙈'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{wish.nickname}</h4>
                    <p className="text-xs text-gray-500">愿望正在放飞中...</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">{wish.content}</p>
              </div>
              
              {/* 卡片拖尾效果 */}
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gradient-to-t from-yellow-200 to-transparent blur-sm"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* 粒子效果 */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, 
              ${particle.id % 3 === 0 ? '#FFD700' : particle.id % 3 === 1 ? '#FF6B6B' : '#4ECDC4'} 
              0%, transparent 70%)`
          }}
          animate={{
            y: particle.y - 100,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2 + particle.speed,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* 烟花爆炸效果 */}
      {animationProgress > 30 && animationProgress < 70 && (
        <>
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={`firework-${i}`}
              className="absolute"
              style={{
                left: `${20 + i * 20}%`,
                top: '30%'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 3, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.3,
                times: [0, 0.5, 1]
              }}
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-red-500" />
              {[...Array(12)].map((_, j) => (
                <motion.div
                  key={`spark-${i}-${j}`}
                  className="absolute w-1 h-4 rounded-full bg-gradient-to-b from-yellow-300 to-orange-500"
                  style={{
                    transformOrigin: 'center bottom'
                  }}
                  initial={{ rotate: j * 30, scale: 0 }}
                  animate={{ 
                    rotate: j * 30,
                    scale: [0, 1, 0],
                    y: [0, -40, -80]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    times: [0, 0.3, 1]
                  }}
                />
              ))}
            </motion.div>
          ))}
        </>
      )}

      {/* 祝福语 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, duration: 1, type: 'spring' }}
          className="text-center"
        >
          <motion.h2
            className="text-5xl font-bold text-white mb-6"
            animate={{
              y: [0, -10, 0],
              textShadow: [
                '0 0 10px rgba(255,215,0,0.5)',
                '0 0 20px rgba(255,215,0,0.8)',
                '0 0 10px rgba(255,215,0,0.5)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            🎉 除夕快乐！ 🎉
          </motion.h2>
          
          <motion.p
            className="text-2xl text-yellow-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            愿所有美好如期而至
          </motion.p>

          <motion.div
            className="text-xl text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <p>所有愿望已升空，飞向2026年的星空</p>
            <p className="mt-2 text-lg opacity-80">新年快乐，万事如意！</p>
          </motion.div>

          {/* 进度条 */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400"
                initial={{ width: '0%' }}
                animate={{ width: `${animationProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-white/80 mt-2">
              放飞进度: {animationProgress}%
            </p>
          </div>
        </motion.div>
      </div>

      {/* 关闭按钮（动画完成后） */}
      {animationProgress >= 100 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            setIsAnimating(false)
            onComplete?.()
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-white text-red-600 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow pointer-events-auto"
        >
          关闭动画
        </motion.button>
      )}

      {/* 背景星光 */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  )
}