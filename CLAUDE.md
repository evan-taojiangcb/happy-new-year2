# CLAUDE.md - 许愿墙 Web App 开发指南

## 项目概述
**许愿墙** - 2026年除夕主题的轻量级 Web 应用
- 用户可以在除夕前写下新年愿望
- 愿望以瀑布流形式展示在"墙上"
- 全局倒计时至2026-02-16 23:59:59 (GMT+8)
- 除夕午夜触发放飞动画

## 技术栈
- **前端**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **状态管理**: Jotai
- **动画**: Framer Motion
- **无限滚动**: react-intersection-observer
- **测试**: Playwright (E2E)

## 后端架构
- **数据库**: DynamoDB (表名: `Wishes`)
- **API**: AWS Lambda + API Gateway
- **部署**: Serverless Framework
- **区域**: ap-northeast-1 (东京)

## 核心功能
1. ✅ 瀑布流愿望墙 (Masonry布局)
2. ✅ 添加愿望表单 (昵称≤20字，愿望≤200字)
3. ✅ 用户限制 (3个愿望/用户，基于浏览器UUID)
4. ✅ 全局倒计时 (至2026-02-16 23:59:59 GMT+8)
5. ✅ 放飞动画 (除夕午夜触发)
6. ✅ 春节主题 (红色#D32F2F，金色#FFD700)

## 文件结构
```
happy-new-year-2/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── wishes/
│   │   │       └── route.ts
│   │   ├── components/
│   │   │   ├── WishCard.tsx
│   │   │   ├── WishForm.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── ReleaseAnimation.tsx
│   │   │   └── RedEnvelopeButton.tsx
│   │   ├── lib/
│   │   │   ├── dynamodb.ts
│   │   │   └── utils.ts
│   │   ├── page.tsx
│   │   └── layout.tsx
├── tests/
│   ├── e2e/
│   │   └── wish-wall.spec.ts
│   └── unit/
│       └── api.test.ts
└── playwright.config.ts
```

## 开发原则
1. **每完成一个功能就提交到 GitHub**
2. **保持代码简洁、可维护**
3. **遵循 TypeScript 最佳实践**
4. **响应式设计优先**
5. **性能优化考虑**

## 颜色主题
- **主色**: 中国红 `#D32F2F`
- **辅色**: 金色 `#FFD700`
- **背景**: 浅色底 + 红色元素
- **卡片**: 淡黄/白色背景 + 红色边框

## 春节元素
- 梅花枝 (装饰)
- 红灯笼 (图标)
- 福字 (装饰)
- 红包 (按钮)
- 雪花 (动画)

## API 端点
- `GET /api/wishes` - 获取愿望列表 (无限滚动分页)
- `POST /api/wishes` - 创建愿望 (用户限制检查)
- `POST /api/wishes/release` - 批量更新状态 (除夕定时任务)

## 测试要求
1. **单元测试**: API 逻辑
2. **E2E测试**: 用户流程
3. **边界测试**: 输入限制
4. **兼容性测试**: 主流浏览器

## 部署流程
1. 创建 DynamoDB 表
2. 部署 Lambda 函数
3. 配置 API Gateway
4. 部署前端到 S3
5. 设置 EventBridge 定时任务

## 下一步
按顺序实现:
1. 基础UI组件 (WishCard, WishForm)
2. 倒计时组件
3. 无限滚动逻辑
4. 后端API
5. 放飞动画
6. 测试用例