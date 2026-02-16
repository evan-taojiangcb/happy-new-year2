# 2026除夕许愿墙 🎉

一个围绕2026年除夕主题的轻量级Web应用，用户可以在除夕前写下新年愿望，与其他人的愿望一同"粘贴"在许愿墙上。

## ✨ 功能特性

- **🎨 春节主题设计** - 中国红(#D32F2F) + 金色(#FFD700)配色，梅花、灯笼、福字、红包、雪花等春节元素
- **📝 愿望墙浏览** - 瀑布流(Masonry)布局展示所有愿望，无限滚动加载
- **✍️ 添加愿望** - 表单包含昵称、愿望内容、联系方式(可选)、性别选择
- **🔒 用户限制** - 每个用户(基于浏览器UUID)最多发布3条愿望
- **⏰ 全局倒计时** - 距离2026年除夕(2026-02-16 23:59:59 GMT+8)的实时倒计时
- **🎆 放飞动画** - 除夕午夜自动触发所有愿望卡片"放飞"动画
- **📱 响应式设计** - 完美适配手机、平板、桌面端

## 🏗️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **状态管理**: Jotai
- **动画**: Framer Motion
- **无限滚动**: react-intersection-observer

### 后端
- **数据库**: DynamoDB (表名: `Wishes`)
- **API**: AWS Lambda + API Gateway
- **部署**: Serverless Framework
- **区域**: ap-northeast-1 (东京)

## 📁 项目结构

```
happy-new-year-2/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── wishes/
│   │   │       └── route.ts          # API路由
│   │   ├── components/
│   │   │   ├── WishCard.tsx          # 愿望卡片组件
│   │   │   ├── WishForm.tsx          # 愿望表单组件
│   │   │   ├── CountdownTimer.tsx    # 倒计时组件
│   │   │   ├── ReleaseAnimation.tsx  # 放飞动画组件
│   │   │   └── RedEnvelopeButton.tsx # 红包按钮组件
│   │   ├── lib/
│   │   │   ├── types.ts              # TypeScript类型定义
│   │   │   └── utils.ts              # 工具函数
│   │   ├── page.tsx                  # 首页
│   │   └── layout.tsx                # 布局组件
├── tests/
│   ├── e2e/
│   │   └── wish-wall.spec.ts         # E2E测试
│   └── unit/
│       └── api.test.ts               # 单元测试
└── public/                           # 静态资源
```

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 运行开发服务器
```bash
npm run dev
```

### 3. 打开浏览器
访问 [http://localhost:3000](http://localhost:3000)

## 🔧 开发

### 环境变量
```bash
# .env.local
DYNAMODB_TABLE=Wishes
REGION=ap-northeast-1
ALLOWED_ORIGIN=http://localhost:3000
```

### 可用脚本
```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 运行测试
npm test

# 运行E2E测试
npm run test:e2e
```

## 📊 数据模型 (DynamoDB)

**表名**: `Wishes`

| 属性名 | 类型 | 描述 | 键类型 |
|--------|------|------|--------|
| wishId | String | 愿望唯一ID (UUID v4) | 分区键 |
| userId | String | 用户唯一ID | GSI分区键 |
| nickname | String | 昵称 (≤20字符) | - |
| content | String | 愿望内容 (≤200字符) | - |
| gender | String | 性别: male/female/secret | - |
| contact | String | 联系方式 (可选, ≤100字符) | - |
| createdAt | Number | 创建时间戳 (毫秒) | GSI排序键 |
| status | String | 状态: active/released | - |

**全局二级索引**:
- `UserIdIndex` (userId → createdAt) - 用户限制检查
- `StatusCreatedAtIndex` (status → createdAt) - 无限滚动查询

## 🔌 API 接口

### 获取愿望列表
```
GET /api/wishes
参数: limit (默认20), nextToken (分页游标)
响应: { wishes: Wish[], nextToken?: string, total: number }
```

### 创建愿望
```
POST /api/wishes
请求体: { userId, nickname, content, gender, contact? }
响应: { wish: Wish }
限制: 每个用户最多3个活跃愿望
```

### 批量更新状态 (除夕定时任务)
```
POST /api/wishes/release
触发: EventBridge定时规则 (2026-02-17 00:00:00)
功能: 将所有active愿望更新为released
```

## 🎨 设计规范

### 颜色主题
- **主色**: 中国红 `#D32F2F`
- **辅色**: 金色 `#FFD700`
- **背景**: 淡黄色 `#FFF8E1`
- **卡片**: 白色 `#FFFFFF`
- **文字**: 深灰 `#333333`

### 字体
- **标题**: 思源宋体/站酷快乐体 (书法字体)
- **正文**: PingFang SC, Microsoft YaHei, system-ui

### 春节元素
- 梅花枝 (角落装饰)
- 红灯笼 (顶部悬挂)
- 福字 (卡片底纹)
- 红包 (浮动按钮)
- 雪花 (动态飘落)

## 🧪 测试

### 单元测试
```bash
npm test
```

### E2E测试 (Playwright)
```bash
npm run test:e2e
```

### 测试用例覆盖
1. ✅ 查看愿望列表
2. ✅ 添加愿望表单
3. ✅ 用户限制机制
4. ✅ 倒计时功能
5. ✅ 响应式布局
6. ✅ 边界条件测试
7. ✅ 错误处理测试

## 📱 响应式断点

- **手机**: ≥320px
- **平板**: ≥768px
- **桌面**: ≥1024px
- **大屏**: ≥1280px

## 🔒 安全考虑

- XSS防护: 用户输入内容在渲染前转义
- 输入验证: 前端+后端双重验证
- 频率限制: API请求限制
- 隐私保护: 联系方式仅作展示，不做验证

## 📈 性能优化

- 图片懒加载
- 代码分割
- 缓存策略
- 数据库索引优化
- CDN加速 (可选)

## 🚢 部署

### AWS 部署流程
1. 创建 DynamoDB 表
2. 部署 Lambda 函数
3. 配置 API Gateway
4. 部署前端到 S3
5. 设置 EventBridge 定时任务
6. 配置自定义域名 (可选)

### 环境配置
```bash
# 生产环境
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENV=production
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢所有贡献者
- 灵感来源于中国传统春节文化
- 使用 Next.js、TailwindCSS、Framer Motion 等优秀开源项目

---

**许下心愿，迎接2026年除夕的到来！** 🎊