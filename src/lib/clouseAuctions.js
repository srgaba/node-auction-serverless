import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export function closeAuctions(auctions){
  return Promise.all(auctions.map(auction => dynamoDb.update({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id: auction.id,
    },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSE',
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    }
  }).promise()))
}