import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export async function getEndedAuctions(){
  const now = new Date().toISOString()
  const result = await dynamoDb.query({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    }
  }).promise()
  return result.Items
}