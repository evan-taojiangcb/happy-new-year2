#!/bin/bash

# 许愿墙应用部署脚本

set -e

echo "🚀 开始部署许愿墙应用..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必要工具
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ 未找到 $1，请先安装$2${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ $1 已安装${NC}"
}

echo -e "${BLUE}📋 检查部署环境...${NC}"
check_tool "aws" "AWS CLI (https://aws.amazon.com/cli/)"
check_tool "npm" "Node.js (https://nodejs.org/)"
check_tool "serverless" "Serverless Framework (npm install -g serverless)"

# 检查AWS登录状态
echo -e "${BLUE}🔐 检查AWS认证...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS未登录，请先运行 'aws configure'${NC}"
    exit 1
fi
echo -e "${GREEN}✅ AWS认证通过${NC}"

# 安装依赖
echo -e "${BLUE}📦 安装项目依赖...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 依赖安装成功${NC}"
else
    echo -e "${RED}❌ 依赖安装失败${NC}"
    exit 1
fi

# 创建DynamoDB表
echo -e "${BLUE}🗄️  创建DynamoDB表...${NC}"
if [ -f "./scripts/create-dynamodb-table.sh" ]; then
    chmod +x ./scripts/create-dynamodb-table.sh
    ./scripts/create-dynamodb-table.sh
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ DynamoDB表创建成功${NC}"
    else
        echo -e "${YELLOW}⚠️  DynamoDB表创建可能有问题，继续部署...${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  未找到DynamoDB表创建脚本，跳过...${NC}"
fi

# 部署Serverless应用
echo -e "${BLUE}☁️  部署Serverless应用...${NC}"
echo -e "${YELLOW}提示：这可能需要几分钟时间...${NC}"

# 设置部署阶段
STAGE=${1:-"prod"}
echo -e "${BLUE}部署阶段: ${STAGE}${NC}"

# 执行部署
serverless deploy --stage $STAGE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Serverless部署成功！${NC}"
    
    # 获取部署信息
    echo -e "${BLUE}📊 部署信息:${NC}"
    serverless info --stage $STAGE
    
    # 显示API端点
    echo -e "${BLUE}🔗 API端点:${NC}"
    echo "GET/POST: $(serverless info --stage $STAGE --verbose | grep -o 'https://[^ ]*' | head -1)"
    
else
    echo -e "${RED}❌ Serverless部署失败${NC}"
    exit 1
fi

# 构建前端
echo -e "${BLUE}🏗️  构建前端应用...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 前端构建成功${NC}"
    
    # 显示构建信息
    echo -e "${BLUE}📁 构建输出目录: .next/${NC}"
    echo -e "${BLUE}📦 静态文件: .next/static/${NC}"
    
else
    echo -e "${RED}❌ 前端构建失败${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 部署完成！${NC}"
echo ""
echo -e "${BLUE}📋 下一步:${NC}"
echo "1. 将 .next 目录部署到静态托管服务（如S3、Vercel、Netlify）"
echo "2. 配置自定义域名（可选）"
echo "3. 测试API接口功能"
echo "4. 验证倒计时和放飞动画"
echo ""
echo -e "${BLUE}🔧 本地测试:${NC}"
echo "运行 'npm run dev' 启动开发服务器"
echo "运行 'serverless offline' 启动本地API模拟"
echo ""
echo -e "${BLUE}🔄 更新部署:${NC}"
echo "修改代码后，重新运行此脚本或 'serverless deploy'"
echo ""
echo -e "${GREEN}✨ 许愿墙应用已准备就绪！✨${NC}"