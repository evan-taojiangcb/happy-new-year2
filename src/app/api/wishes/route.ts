import { NextRequest, NextResponse } from 'next/server'
import { Wish, CreateWishRequest, ApiResponse, WishesResponse } from '@/app/lib/types'

// 模拟数据库
let mockWishes: Wish[] = [
  {
    wishId: '1',
    userId: 'user_123',
    nickname: '测试用户',
    content: '这是一个测试愿望，希望项目顺利！',
    gender: 'secret',
    contact: '',
    createdAt: Date.now() - 86400000,
    status: 'active'
  },
  {
    wishId: '2',
    userId: 'user_456',
    nickname: '开发者',
    content: '希望许愿墙项目能够帮助大家实现新年愿望！',
    gender: 'male',
    contact: 'developer@example.com',
    createdAt: Date.now() - 43200000,
    status: 'active'
  }
]

// 获取愿望列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const nextToken = searchParams.get('nextToken')
    
    // 简单分页逻辑
    let wishes = [...mockWishes]
      .sort((a, b) => b.createdAt - a.createdAt) // 按时间倒序
      .slice(0, limit)
    
    const response: ApiResponse<WishesResponse> = {
      success: true,
      data: {
        wishes,
        total: mockWishes.length
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '获取愿望列表失败',
      message: error instanceof Error ? error.message : '未知错误'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// 创建新愿望
export async function POST(request: NextRequest) {
  try {
    const body: CreateWishRequest = await request.json()
    
    // 验证必填字段
    if (!body.userId || !body.nickname || !body.content || !body.gender) {
      const response: ApiResponse<null> = {
        success: false,
        error: '缺少必填字段'
      }
      return NextResponse.json(response, { status: 400 })
    }
    
    // 验证字段长度
    if (body.nickname.length > 20) {
      const response: ApiResponse<null> = {
        success: false,
        error: '昵称不能超过20字'
      }
      return NextResponse.json(response, { status: 400 })
    }
    
    if (body.content.length > 200) {
      const response: ApiResponse<null> = {
        success: false,
        error: '愿望内容不能超过200字'
      }
      return NextResponse.json(response, { status: 400 })
    }
    
    if (body.contact && body.contact.length > 100) {
      const response: ApiResponse<null> = {
        success: false,
        error: '联系方式不能超过100字'
      }
      return NextResponse.json(response, { status: 400 })
    }
    
    // 检查用户愿望数量限制
    const userWishCount = mockWishes.filter(w => 
      w.userId === body.userId && w.status === 'active'
    ).length
    
    if (userWishCount >= 3) {
      const response: ApiResponse<null> = {
        success: false,
        error: '已达到3个愿望上限'
      }
      return NextResponse.json(response, { status: 403 })
    }
    
    // 创建新愿望
    const newWish: Wish = {
      wishId: `wish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: body.userId,
      nickname: body.nickname.trim(),
      content: body.content.trim(),
      gender: body.gender,
      contact: body.contact?.trim() || '',
      createdAt: Date.now(),
      status: 'active'
    }
    
    mockWishes.unshift(newWish)
    
    const response: ApiResponse<Wish> = {
      success: true,
      data: newWish,
      message: '愿望创建成功'
    }
    
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '创建愿望失败',
      message: error instanceof Error ? error.message : '未知错误'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// 处理OPTIONS请求（CORS）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}