import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const client = new DynamoDBClient({ region: process.env.REGION || 'ap-northeast-1' })
const docClient = DynamoDBDocumentClient.from(client)

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Wishes'

interface Wish {
  wishId: string
  userId: string
  nickname: string
  content: string
  gender: 'male' | 'female' | 'secret'
  contact?: string
  createdAt: number
  status: 'active' | 'released'
}

interface CreateWishRequest {
  userId: string
  nickname: string
  content: string
  gender: 'male' | 'female' | 'secret'
  contact?: string
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // 处理OPTIONS请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    // GET请求：获取愿望列表
    if (event.httpMethod === 'GET') {
      const limit = parseInt(event.queryStringParameters?.limit || '20')
      const nextToken = event.queryStringParameters?.nextToken

      // 使用StatusCreatedAtIndex查询活跃愿望
      const command = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'StatusCreatedAtIndex',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': 'active'
        },
        Limit: Math.min(limit, 50),
        ScanIndexForward: false, // 按createdAt降序
        ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined
      })

      const result = await docClient.send(command)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            wishes: result.Items || [],
            nextToken: result.LastEvaluatedKey 
              ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
              : undefined,
            total: result.Count || 0
          }
        })
      }
    }

    // POST请求：创建愿望
    if (event.httpMethod === 'POST') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: '请求体不能为空'
          })
        }
      }

      const body: CreateWishRequest = JSON.parse(event.body)

      // 验证必填字段
      if (!body.userId || !body.nickname || !body.content || !body.gender) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: '缺少必填字段'
          })
        }
      }

      // 验证字段长度
      if (body.nickname.length > 20) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: '昵称不能超过20字'
          })
        }
      }

      if (body.content.length > 200) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: '愿望内容不能超过200字'
          })
        }
      }

      if (body.contact && body.contact.length > 100) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: '联系方式不能超过100字'
          })
        }
      }

      // 检查用户愿望数量限制
      const userQueryCommand = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'UserIdIndex',
        KeyConditionExpression: 'userId = :userId',
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':userId': body.userId,
          ':status': 'active'
        },
        Select: 'COUNT'
      })

      const userResult = await docClient.send(userQueryCommand)

      if (userResult.Count && userResult.Count >= 3) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            success: false,
            error: '已达到3个愿望上限'
          })
        }
      }

      // 创建新愿望
      const wish: Wish = {
        wishId: `wish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: body.userId,
        nickname: body.nickname.trim(),
        content: body.content.trim(),
        gender: body.gender,
        contact: body.contact?.trim() || '',
        createdAt: Date.now(),
        status: 'active'
      }

      const putCommand = new PutCommand({
        TableName: TABLE_NAME,
        Item: wish
      })

      await docClient.send(putCommand)

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          data: wish,
          message: '愿望创建成功'
        })
      }
    }

    // 不支持的HTTP方法
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: '不支持的HTTP方法'
      })
    }

  } catch (error) {
    console.error('Error:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: '服务器内部错误',
        message: error instanceof Error ? error.message : '未知错误'
      })
    }
  }
}