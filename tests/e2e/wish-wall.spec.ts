import { test, expect } from '@playwright/test'

test.describe('许愿墙E2E测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
  })

  test('页面加载和基本元素', async ({ page }) => {
    // 检查标题
    await expect(page.getByRole('heading', { name: '2026除夕许愿墙' })).toBeVisible()
    
    // 检查倒计时
    await expect(page.getByText('距离2026年除夕愿望放飞还有')).toBeVisible()
    
    // 检查用户状态
    await expect(page.getByText(/你的ID:/)).toBeVisible()
    await expect(page.getByText(/已许愿望:/)).toBeVisible()
    
    // 检查红包按钮
    await expect(page.getByRole('button', { name: /许愿/ })).toBeVisible()
    
    // 检查使用说明
    await expect(page.getByText('使用说明')).toBeVisible()
  })

  test('添加愿望流程', async ({ page }) => {
    // 点击红包按钮打开表单
    await page.getByRole('button', { name: /许愿/ }).click()
    
    // 检查表单打开
    await expect(page.getByRole('heading', { name: '写下你的新年愿望' })).toBeVisible()
    
    // 填写表单
    await page.getByPlaceholder('请输入昵称（最多20字）').fill('测试用户')
    await page.getByPlaceholder('写下你的新年愿望（最多200字）').fill('这是一个E2E测试愿望，希望测试通过！')
    
    // 选择性别
    await page.getByText('保密').click()
    
    // 提交表单
    await page.getByRole('button', { name: '许下愿望' }).click()
    
    // 检查提交成功
    await expect(page.getByText('测试用户')).toBeVisible()
    await expect(page.getByText('这是一个E2E测试愿望')).toBeVisible()
  })

  test('愿望数量限制', async ({ page }) => {
    // 先添加3个愿望
    for (let i = 1; i <= 3; i++) {
      await page.getByRole('button', { name: /许愿/ }).click()
      await page.getByPlaceholder('请输入昵称（最多20字）').fill(`测试用户${i}`)
      await page.getByPlaceholder('写下你的新年愿望（最多200字）').fill(`测试愿望${i}`)
      await page.getByText('保密').click()
      await page.getByRole('button', { name: '许下愿望' }).click()
      await page.waitForTimeout(500)
    }
    
    // 尝试添加第4个愿望
    await page.getByRole('button', { name: /许愿/ }).click()
    
    // 检查限制提示
    await expect(page.getByText('已达上限')).toBeVisible()
    await expect(page.getByRole('button', { name: '许下愿望' })).toBeDisabled()
  })

  test('表单验证', async ({ page }) => {
    await page.getByRole('button', { name: /许愿/ }).click()
    
    // 测试空提交
    await page.getByRole('button', { name: '许下愿望' }).click()
    
    // 检查错误提示
    await expect(page.getByText('昵称不能为空')).toBeVisible()
    await expect(page.getByText('愿望内容不能为空')).toBeVisible()
    
    // 测试超长输入
    await page.getByPlaceholder('请输入昵称（最多20字）').fill('这是一个超过20个字符的超长昵称测试')
    await page.getByPlaceholder('写下你的新年愿望（最多200字）').fill('a'.repeat(201))
    
    // 检查长度限制
    await expect(page.getByText('昵称不能超过20字')).toBeVisible()
    await expect(page.getByText('愿望内容不能超过200字')).toBeVisible()
  })

  test('愿望卡片显示', async ({ page }) => {
    // 检查卡片元素
    const wishCards = page.locator('.break-inside-avoid')
    await expect(wishCards.first()).toBeVisible()
    
    // 检查卡片内容
    const firstCard = wishCards.first()
    await expect(firstCard.locator('h3')).toBeVisible() // 昵称
    await expect(firstCard.locator('p')).toBeVisible() // 内容
    await expect(firstCard.locator('text=保密')).toBeVisible() // 性别
  })

  test('倒计时功能', async ({ page }) => {
    // 检查倒计时组件
    const countdown = page.locator('text=距离2026年除夕愿望放飞还有')
    await expect(countdown).toBeVisible()
    
    // 检查倒计时数字
    const days = page.locator('text=天').first()
    const hours = page.locator('text=时').first()
    const minutes = page.locator('text=分').first()
    const seconds = page.locator('text=秒').first()
    
    await expect(days).toBeVisible()
    await expect(hours).toBeVisible()
    await expect(minutes).toBeVisible()
    await expect(seconds).toBeVisible()
    
    // 检查进度条
    const progressBar = page.locator('.bg-gradient-to-r.from-red-500')
    await expect(progressBar).toBeVisible()
  })

  test('响应式布局', async ({ page }) => {
    // 桌面端布局
    await page.setViewportSize({ width: 1200, height: 800 })
    const desktopColumns = page.locator('.lg\\:columns-3')
    await expect(desktopColumns).toBeVisible()
    
    // 平板端布局
    await page.setViewportSize({ width: 768, height: 1024 })
    const tabletColumns = page.locator('.sm\\:columns-2')
    await expect(tabletColumns).toBeVisible()
    
    // 手机端布局
    await page.setViewportSize({ width: 375, height: 667 })
    const mobileColumns = page.locator('.columns-1')
    await expect(mobileColumns).toBeVisible()
  })

  test('API接口测试', async ({ request }) => {
    // 测试GET请求
    const getResponse = await request.get('http://localhost:3000/api/wishes')
    expect(getResponse.ok()).toBeTruthy()
    
    const getData = await getResponse.json()
    expect(getData.success).toBe(true)
    expect(Array.isArray(getData.data.wishes)).toBe(true)
    
    // 测试POST请求
    const postResponse = await request.post('http://localhost:3000/api/wishes', {
      data: {
        userId: `test_${Date.now()}`,
        nickname: 'API测试用户',
        content: 'API接口测试愿望',
        gender: 'secret'
      }
    })
    
    expect(postResponse.ok()).toBeTruthy()
    
    const postData = await postResponse.json()
    expect(postData.success).toBe(true)
    expect(postData.data.wishId).toBeDefined()
    expect(postData.data.nickname).toBe('API测试用户')
  })

  test('本地存储功能', async ({ page, context }) => {
    // 检查初始状态
    const localStorage = await page.evaluate(() => localStorage.getItem('wish_user_id'))
    expect(localStorage).toBeTruthy()
    
    // 添加一个愿望
    await page.getByRole('button', { name: /许愿/ }).click()
    await page.getByPlaceholder('请输入昵称（最多20字）').fill('存储测试用户')
    await page.getByPlaceholder('写下你的新年愿望（最多200字）').fill('测试本地存储功能')
    await page.getByText('保密').click()
    await page.getByRole('button', { name: '许下愿望' }).click()
    
    // 检查计数更新
    const wishCount = await page.evaluate(() => localStorage.getItem('wish_count'))
    expect(parseInt(wishCount || '0')).toBeGreaterThan(0)
    
    // 新标签页测试用户ID保持
    const newPage = await context.newPage()
    await newPage.goto('http://localhost:3000')
    
    const newLocalStorage = await newPage.evaluate(() => localStorage.getItem('wish_user_id'))
    expect(newLocalStorage).toBe(localStorage)
  })
})

test.describe('错误处理和边界测试', () => {
  test('网络错误处理', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/wishes', route => route.abort())
    
    await page.goto('http://localhost:3000')
    
    // 尝试添加愿望应该失败
    await page.getByRole('button', { name: /许愿/ }).click()
    await page.getByPlaceholder('请输入昵称（最多20字）').fill('网络错误测试')
    await page.getByPlaceholder('写下你的新年愿望（最多200字）').fill('测试网络错误处理')
    await page.getByText('保密').click()
    await page.getByRole('button', { name: '许下愿望' }).click()
    
    // 应该有错误提示（具体实现可能不同）
    await expect(page.getByText(/错误|失败/).first()).toBeVisible({ timeout: 5000 })
  })

  test('空状态显示', async ({ page, context }) => {
    // 清除本地存储和模拟空数据
    await context.clearCookies()
    await page.evaluate(() => {
      localStorage.clear()
      // 模拟空愿望列表
      window.mockWishes = []
    })
    
    await page.goto('http://localhost:3000')
    
    // 检查空状态提示
    await expect(page.getByText(/还没有人许愿|愿望墙还是空的/)).toBeVisible()
  })
})