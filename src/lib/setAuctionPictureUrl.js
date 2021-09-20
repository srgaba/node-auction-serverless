import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function setAuctionPictureUrl(id, pictureUrl) {
  return (
    await dynamoDb
      .update({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {
          id,
        },
        UpdateExpression: "set pictureUrl = :pictureUrl",
        ExpressionAttributeValues: {
          ":pictureUrl": pictureUrl,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise()
  ).Attributes;
}
