'use client'

import { useState, useEffect } from 'react'
import WishCard from '@/app/components/WishCard'
import WishForm from '@/app/components/WishForm'
import CountdownTimer from '@/app/components/CountdownTimer'
import RedEnvelopeButton from '@/app/components/RedEnvelopeButton'
import { Wish } from '@/app/lib/types'

// 模拟数据 - 后续替换为真实API
const mockWishes: Wish[] = [
  {
    wishId: '1',
    userId: 'user1',
    nickname: '小明',
    content: '希望2026年家人健康平安，事业顺利！',
    gender: 'male',
    contact: '',
    createdAt: Date.now() - 86400000,
    status: 'active'
  },
  {
    wishId: '2',
    userId: 'user2',
    nickname: '小红',
    content: '新的一年希望能考上理想的大学，加油！',
    gender: 'female',
    contact: 'wechat: xiaohong2026',
    createdAt: Date.now() - 43200000,
    status: 'active'
  },
  {
    wishId: '3',
    userId: 'user3',
    nickname: '匿名',
    content: '愿世界和平，疫情早日结束。',
    gender: 'secret',
    contact: '',
    createdAt: Date.now() - 21600000,
    status: 'active'
  },
  {
    wishId: '4',
    userId: 'user4',
    nickname: '奋斗者',
    content: '2026年要完成自己的创业项目，实现财务自由！',
    gender: 'male',
    contact: 'email:奋斗者@example.com',
    createdAt: Date.now() - 10800000,
    status: 'active'
  },
  {
    wishId: '5',
    userId: 'user5',
    nickname: '梦想家',
    content: '希望能环游世界，看遍世间美景。',
    gender: 'female',
    contact: '',
    createdAt: Date.now() - 5400000,
    status: 'active'
  }
]

export default function Home() {
  const [wishes, setWishes] = useState<Wish[]>(mockWishes)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [userWishCount, setUserWishCount] = useState(0)
  const [userId, setUserId] = useState<string>('')

  // 初始化用户ID
  useEffect(() => {
    const storedUserId = localStorage.getItem('wish_user_id')
    if (storedUserId) {
      setUserId(storedUserId)
      // TODO: 从API获取用户愿望数量
      const count = parseInt(localStorage.getItem('wish_count') || '0')
      setUserWishCount(count)
    } else {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('wish_user_id', newUserId)
      localStorage.setItem('wish_count', '0')
      setUserId(newUserId)
    }
  }, [])

  // 添加新愿望
  const handleAddWish = (newWish: Omit<Wish, 'wishId' | 'createdAt' | 'status'>) => {
    const wish: Wish = {
      ...newWish,
      wishId: `wish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      status: 'active'
    }
    
    setWishes(prev => [wish, ...prev])
    const newCount = userWishCount + 1
    setUserWishCount(newCount)
    localStorage.setItem('wish_count', newCount.toString())
    setIsFormOpen(false)
  }

  // 检查用户是否达到限制
  const canAddWish = userWishCount < 3

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 标题区域 */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-red-700 mb-4 tracking-wider">
          2026除夕许愿墙
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          写下你的新年愿望，与其他人的愿望一同粘贴在墙上，迎接2026年除夕的到来！
        </p>
        
        {/* 倒计时组件 */}
        <div className="mb-12">
          <CountdownTimer targetDate="2026-02-16T23:59:59+08:00" />
        </div>
      </header>

      {/* 用户状态提示 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8 text-center">
        <p className="text-lg">
          <span className="font-semibold text-red-600">你的ID:</span> {userId.substring(0, 12)}...
          <span className="ml-6 font-semibold text-red-600">已许愿望:</span> {userWishCount}/3
        </p>
        {!canAddWish && (
          <p className="text-red-500 font-medium mt-2">
            ⚠️ 你已经许了3个愿望，不能再添加了哦！
          </p>
        )}
      </div>

      {/* 愿望墙网格 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">大家的愿望</h2>
        
        {wishes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">还没有人许愿，快来写下第一个愿望吧！</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {wishes.map((wish) => (
              <div key={wish.wishId} className="break-inside-avoid mb-6">
                <WishCard wish={wish} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加愿望按钮 */}
      <RedEnvelopeButton 
        onClick={() => setIsFormOpen(true)}
        disabled={!canAddWish}
        remainingWishes={3 - userWishCount}
      />

      {/* 愿望表单模态框 */}
      <WishForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddWish}
        userId={userId}
        userWishCount={userWishCount}
      />

      {/* 使用说明 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-12 border-l-4 border-red-500">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📝 使用说明</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            点击右下角的<span className="font-semibold text-red-600">红包按钮</span>写下你的愿望
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            每个用户最多可以许<span className="font-semibold text-red-600">3个愿望</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            联系方式为可选字段，仅作展示，请谨慎填写个人信息
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            倒计时结束后，所有愿望将一起"放飞"，寓意愿望成真
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            愿望墙采用瀑布流布局，向下滚动查看更多愿望
          </li>
        </ul>
      </div>
    </main>
  )
}