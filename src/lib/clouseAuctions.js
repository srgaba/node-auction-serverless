import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export function closeAuctions(auctions) {
  return Promise.all(
    auctions.map(async (auction) => {
      await dynamoDb
        .update({
          TableName: process.env.AUCTIONS_TABLE_NAME,
          Key: {
            id: auction.id,
          },
          UpdateExpression: "set #status = :status",
          ExpressionAttributeValues: {
            ":status": "CLOSE",
          },
          ExpressionAttributeNames: {
            "#status": "status",
          },
        })
        .promise();

      const {
        title,
        seller,
        highestBid: { amount, bidder },
      } = auction;

      const notifySeller = await sqs
        .sendMessage({
          QueueUrl: process.env.MAIL_QUEUE_URL,
          MessageBody: JSON.stringify({
            subject: "Your item has been sold!",
            recipient: seller,
            body: `Your item ${title} has been sold for ${amount}`,
          }),
        })
        .promise();

      const notifyBidder = await sqs
        .sendMessage({
          QueueUrl: process.env.MAIL_QUEUE_URL,
          MessageBody: JSON.stringify({
            subject: "You won an auction",
            recipient: bidder,
            body: `What a great deal! You got yourself "${title}" for ${amount}`,
          }),
        })
        .promise();

      return Promise.all([notifySeller, notifyBidder]);
    })
  );
}
