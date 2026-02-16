'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreateWishRequest, GenderOptions, FormConfig, FormErrors } from '@/app/lib/types'

interface WishFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (wish: CreateWishRequest) => void
  userId: string
  userWishCount: number
}

export default function WishForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  userId,
  userWishCount 
}: WishFormProps) {
  const [formData, setFormData] = useState<CreateWishRequest>({
    userId,
    nickname: '',
    content: '',
    gender: 'secret',
    contact: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 检查是否达到限制
  const canSubmit = userWishCount < 3

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除该字段的错误
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // 验证昵称
    if (!formData.nickname.trim()) {
      newErrors.nickname = '昵称不能为空'
    } else if (formData.nickname.length > FormConfig.nickname.maxLength) {
      newErrors.nickname = `昵称不能超过${FormConfig.nickname.maxLength}字`
    }

    // 验证愿望内容
    if (!formData.content.trim()) {
      newErrors.content = '愿望内容不能为空'
    } else if (formData.content.length > FormConfig.content.maxLength) {
      newErrors.content = `愿望内容不能超过${FormConfig.content.maxLength}字`
    }

    // 验证联系方式
    if (formData.contact && formData.contact.length > FormConfig.contact.maxLength) {
      newErrors.contact = `联系方式不能超过${FormConfig.contact.maxLength}字`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmit) {
      alert('你已经达到3个愿望的上限了！')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onSubmit(formData)
      
      // 重置表单
      setFormData({
        userId,
        nickname: '',
        content: '',
        gender: 'secret',
        contact: ''
      })
      setErrors({})
      
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* 表单内容 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              {/* 表单头部 */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">写下你的新年愿望</h2>
                    <p className="text-red-100 mt-1">
                      许下心愿，迎接2026年除夕的到来
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="text-white hover:text-yellow-200 text-2xl disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
                
                {/* 剩余次数提示 */}
                <div className="mt-4 bg-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">剩余许愿次数：</span>
                      <span className="text-yellow-300 font-bold text-xl ml-2">
                        {3 - userWishCount} / 3
                      </span>
                    </div>
                    {!canSubmit && (
                      <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                        ⚠️ 已达上限
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 表单主体 */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* 昵称字段 */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      昵称 <span className="text-red-500">*</span>
                      <span className="text-sm text-gray-500 ml-2">
                        （最多{FormConfig.nickname.maxLength}字）
                      </span>
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      placeholder={FormConfig.nickname.placeholder}
                      disabled={!canSubmit || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.nickname ? 'border-red-500' : 'border-gray-300'
                      } focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors disabled:bg-gray-100`}
                      maxLength={FormConfig.nickname.maxLength}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.nickname && (
                        <span className="text-red-500 text-sm">{errors.nickname}</span>
                      )}
                      <span className="text-gray-500 text-sm ml-auto">
                        {formData.nickname.length}/{FormConfig.nickname.maxLength}
                      </span>
                    </div>
                  </div>

                  {/* 愿望内容字段 */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      愿望内容 <span className="text-red-500">*</span>
                      <span className="text-sm text-gray-500 ml-2">
                        （最多{FormConfig.content.maxLength}字）
                      </span>
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder={FormConfig.content.placeholder}
                      rows={FormConfig.content.rows}
                      disabled={!canSubmit || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.content ? 'border-red-500' : 'border-gray-300'
                      } focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors resize-none disabled:bg-gray-100`}
                      maxLength={FormConfig.content.maxLength}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.content && (
                        <span className="text-red-500 text-sm">{errors.content}</span>
                      )}
                      <span className="text-gray-500 text-sm ml-auto">
                        {formData.content.length}/{FormConfig.content.maxLength}
                      </span>
                    </div>
                  </div>

                  {/* 性别选择 */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">
                      性别 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {GenderOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`
                            flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${formData.gender === option.value
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-300 hover:border-gray-400'
                            }
                            ${!canSubmit || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option.value}
                            checked={formData.gender === option.value}
                            onChange={handleChange}
                            disabled={!canSubmit || isSubmitting}
                            className="sr-only"
                          />
                          <div className="flex flex-col items-center">
                            <span className="text-2xl mb-1">{option.emoji}</span>
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 联系方式字段 */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      联系方式
                      <span className="text-sm text-gray-500 ml-2">
                        （可选，最多{FormConfig.contact.maxLength}字）
                      </span>
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder={FormConfig.contact.placeholder}
                      disabled={!canSubmit || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.contact ? 'border-red-500' : 'border-gray-300'
                      } focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors disabled:bg-gray-100`}
                      maxLength={FormConfig.contact.maxLength}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.contact && (
                        <span className="text-red-500 text-sm">{errors.contact}</span>
                      )}
                      <span className="text-gray-500 text-sm ml-auto">
                        {formData.contact?.length || 0}/{FormConfig.contact.maxLength}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      ⚠️ 联系方式仅作展示，请谨慎填写个人信息
                    </p>
                  </div>
                </div>

                {/* 表单底部 */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    取消
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className={`
                      px-8 py-3 rounded-lg font-medium text-white transition-all
                      ${!canSubmit || isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        提交中...
                      </span>
                    ) : canSubmit ? (
                      '🎉 许下愿望'
                    ) : (
                      '❌ 已达上限'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}