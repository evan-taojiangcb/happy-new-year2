import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '2026除夕许愿墙',
  description: '写下你的新年愿望，与其他人的愿望一同粘贴在许愿墙上，迎接2026年除夕的到来！',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-gradient-to-b from-red-50 to-amber-50 min-h-screen`}>
        {/* 春节装饰元素 */}
        <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>
        <div className="fixed top-2 left-4 text-red-600 text-2xl">福</div>
        <div className="fixed top-2 right-4 text-red-600 text-2xl">春</div>
        
        {/* 雪花动画容器 */}
        <div id="snow-container" className="fixed inset-0 pointer-events-none z-0"></div>
        
        {/* 主要内容 */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* 页脚 */}
        <footer className="text-center py-4 text-gray-600 text-sm">
          <p>© 2026 除夕许愿墙 · 愿所有美好如期而至</p>
          <p className="mt-1">每个用户最多可许3个愿望 · 联系方式仅作展示</p>
        </footer>
      </body>
    </html>
  )
}