import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  await dynamodb
    .put({
      TableName: "AuctionsTable",
      Item: auction,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
