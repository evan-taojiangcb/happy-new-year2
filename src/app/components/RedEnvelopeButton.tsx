'use client'

import { motion } from 'framer-motion'

interface RedEnvelopeButtonProps {
  onClick: () => void
  disabled?: boolean
  remainingWishes: number
}

export default function RedEnvelopeButton({ 
  onClick, 
  disabled = false,
  remainingWishes 
}: RedEnvelopeButtonProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick()
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* 浮动提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -top-20 right-0 bg-white rounded-lg shadow-xl p-4 w-64"
      >
        <div className="flex items-start">
          <div className="text-red-500 text-2xl mr-3">🎁</div>
          <div>
            <h4 className="font-bold text-gray-800">写下新年愿望</h4>
            <p className="text-sm text-gray-600 mt-1">
              点击红包按钮写下你的愿望
              {remainingWishes > 0 && (
                <span className="text-red-500 font-medium">
                  ，还剩 {remainingWishes} 次机会
                </span>
              )}
            </p>
            {disabled && (
              <p className="text-red-500 text-sm font-medium mt-2">
                ⚠️ 已达到3个愿望上限
              </p>
            )}
          </div>
        </div>
        {/* 箭头 */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
      </motion.div>

      {/* 红包按钮 */}
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.1, rotate: 5 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        animate={!disabled ? {
          y: [0, -10, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }
        } : {}}
        className={`
          relative w-20 h-24 rounded-lg shadow-2xl
          ${disabled 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-b from-red-600 to-red-700 cursor-pointer hover:shadow-3xl'
          }
          flex flex-col items-center justify-center
          transition-all duration-300
        `}
      >
        {/* 红包光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-lg"></div>
        
        {/* 金色装饰边 */}
        <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg opacity-50"></div>
        
        {/* 福字 */}
        <div className="text-yellow-300 text-3xl font-bold mb-2">福</div>
        
        {/* 按钮文字 */}
        <div className="text-white text-sm font-bold">许愿</div>
        
        {/* 剩余次数 */}
        {remainingWishes > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{remainingWishes}</span>
          </div>
        )}
        
        {/* 禁用状态遮罩 */}
        {disabled && (
          <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
            <div className="text-white text-xs font-bold">已满</div>
          </div>
        )}
      </motion.button>

      {/* 飘落金币效果 */}
      {!disabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400 text-xl"
              initial={{ 
                y: -100, 
                x: Math.random() * 40 - 20,
                opacity: 0 
              }}
              animate={{ 
                y: 200, 
                opacity: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
            >
              💰
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}