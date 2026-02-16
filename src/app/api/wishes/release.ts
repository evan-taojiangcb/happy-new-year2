import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

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

export const handler = async (): Promise<{ success: boolean; releasedCount: number; message: string }> => {
  console.log('开始执行除夕愿望放飞任务...')

  try {
    // 扫描所有活跃的愿望
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'active'
      }
    })

    const result = await docClient.send(scanCommand)
    const activeWishes = result.Items as Wish[] || []

    console.log(`找到 ${activeWishes.length} 个活跃愿望`)

    if (activeWishes.length === 0) {
      return {
        success: true,
        releasedCount: 0,
        message: '没有需要放飞的活跃愿望'
      }
    }

    // 批量更新愿望状态为released
    const updatePromises = activeWishes.map(wish => {
      const updateCommand = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { wishId: wish.wishId },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': 'released'
        },
        ReturnValues: 'UPDATED_NEW'
      })

      return docClient.send(updateCommand)
    })

    await Promise.all(updatePromises)

    console.log(`成功放飞 ${activeWishes.length} 个愿望`)

    return {
      success: true,
      releasedCount: activeWishes.length,
      message: `成功放飞 ${activeWishes.length} 个愿望，祝大家新年快乐！`
    }

  } catch (error) {
    console.error('放飞任务执行失败:', error)
    
    return {
      success: false,
      releasedCount: 0,
      message: `放飞任务执行失败: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}