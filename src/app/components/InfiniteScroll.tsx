'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Wish } from '@/app/lib/types'

interface InfiniteScrollProps {
  wishes: Wish[]
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  loadingComponent?: React.ReactNode
  endMessage?: React.ReactNode
}

export default function InfiniteScroll({
  wishes,
  hasMore,
  isLoading,
  onLoadMore,
  loadingComponent,
  endMessage
}: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver>()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [visibleWishes, setVisibleWishes] = useState<Wish[]>([])
  const [page, setPage] = useState(0)
  const itemsPerPage = 10

  // 初始化可见愿望
  useEffect(() => {
    setVisibleWishes(wishes.slice(0, itemsPerPage))
    setPage(1)
  }, [wishes])

  // 加载更多数据
  useEffect(() => {
    if (!hasMore || isLoading) return

    const start = page * itemsPerPage
    const end = start + itemsPerPage
    const newWishes = wishes.slice(start, end)
    
    if (newWishes.length > 0) {
      setVisibleWishes(prev => [...prev, ...newWishes])
      setPage(prev => prev + 1)
    }
  }, [page, wishes, hasMore, isLoading])

  // 设置Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    )

    observer.observe(loadMoreRef.current)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading, onLoadMore])

  // 默认加载组件
  const defaultLoadingComponent = (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        {/* 旋转红包 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-20 bg-gradient-to-b from-red-600 to-red-700 rounded-lg shadow-lg flex items-center justify-center"
        >
          <div className="text-yellow-300 text-2xl font-bold">福</div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">🎁</span>
          </div>
        </motion.div>
        
        {/* 加载文字 */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="mt-4 text-gray-600 font-medium"
        >
          加载更多愿望中...
        </motion.div>
      </div>
    </div>
  )

  // 默认结束消息
  const defaultEndMessage = (
    <div className="text-center py-12">
      <div className="inline-block p-6 bg-gradient-to-r from-red-50 to-yellow-50 rounded-2xl border-2 border-red-200">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">已经到底啦！</h3>
        <p className="text-gray-600">
          所有愿望都在这里了，快写下你的新年愿望吧！
        </p>
        <div className="mt-4 text-sm text-gray-500">
          共 {wishes.length} 个愿望
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 愿望列表 */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {visibleWishes.map((wish, index) => (
          <motion.div
            key={wish.wishId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="break-inside-avoid mb-6"
          >
            {/* 这里应该渲染WishCard组件 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">
                  {wish.gender === 'male' ? '👨' : wish.gender === 'female' ? '👩' : '🙈'}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{wish.nickname}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(wish.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{wish.content}</p>
              {wish.contact && (
                <div className="text-sm text-gray-600 border-t pt-3">
                  📧 {wish.contact}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 加载更多触发器 */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {isLoading ? (
            loadingComponent || defaultLoadingComponent
          ) : (
            <div className="text-center">
              <div className="inline-block p-4 bg-red-50 rounded-lg">
                <p className="text-gray-600">滚动加载更多愿望</p>
                <div className="mt-2 flex justify-center space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-red-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 没有更多数据 */}
      {!hasMore && wishes.length > 0 && (
        <div className="mt-8">
          {endMessage || defaultEndMessage}
        </div>
      )}

      {/* 骨架屏（加载中） */}
      {isLoading && visibleWishes.length === 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={`skeleton-${index}`} className="break-inside-avoid mb-6">
              <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="ml-3 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && wishes.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-block p-8 bg-gradient-to-br from-red-50 to-yellow-50 rounded-3xl border-2 border-red-200">
            <div className="text-6xl mb-6">🎁</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              愿望墙还是空的
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              快来写下第一个新年愿望，让这面墙充满希望和祝福！
            </p>
            <div className="text-sm text-gray-500">
              点击右下角的红包按钮开始许愿
            </div>
          </div>
        </div>
      )}
    </>
  )
}