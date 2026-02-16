#!/bin/bash

# DynamoDB表创建脚本
# 用于创建许愿墙应用的DynamoDB表

set -e

TABLE_NAME="Wishes"
REGION="ap-northeast-1"

echo "🎯 开始创建DynamoDB表: $TABLE_NAME (区域: $REGION)"

# 检查AWS CLI是否安装
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI未安装，请先安装AWS CLI"
    exit 1
fi

# 检查是否已登录
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS未登录，请先运行 'aws configure'"
    exit 1
fi

# 检查表是否已存在
if aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION &> /dev/null; then
    echo "✅ 表 $TABLE_NAME 已存在"
    exit 0
fi

echo "📋 创建DynamoDB表..."

# 创建表
aws dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions \
        AttributeName=wishId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
        AttributeName=status,AttributeType=S \
        AttributeName=createdAt,AttributeType=N \
    --key-schema \
        AttributeName=wishId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"UserIdIndex\",
                \"KeySchema\": [
                    {\"AttributeName\": \"userId\", \"KeyType\": \"HASH\"},
                    {\"AttributeName\": \"createdAt\", \"KeyType\": \"RANGE\"}
                ],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                }
            },
            {
                \"IndexName\": \"StatusCreatedAtIndex\",
                \"KeySchema\": [
                    {\"AttributeName\": \"status\", \"KeyType\": \"HASH\"},
                    {\"AttributeName\": \"createdAt\", \"KeyType\": \"RANGE\"}
                ],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                }
            }
        ]" \
    --region $REGION

echo "⏳ 等待表创建完成..."

# 等待表变为ACTIVE状态
aws dynamodb wait table-exists \
    --table-name $TABLE_NAME \
    --region $REGION

echo "✅ DynamoDB表创建成功！"

# 显示表信息
echo ""
echo "📊 表信息:"
aws dynamodb describe-table \
    --table-name $TABLE_NAME \
    --region $REGION \
    --query 'Table.{TableName:TableName,TableStatus:TableStatus,ItemCount:ItemCount,TableSizeBytes:TableSizeBytes}' \
    --output table

echo ""
echo "🔑 主键: wishId (分区键)"
echo "📈 全局二级索引:"
echo "  1. UserIdIndex (userId → createdAt) - 用户限制检查"
echo "  2. StatusCreatedAtIndex (status → createdAt) - 无限滚动查询"
echo ""
echo "🚀 表已准备就绪，可以开始使用了！"