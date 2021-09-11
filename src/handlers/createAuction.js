import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddeware";
import createError, { HttpError } from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  try {
    const { title } = event.body;
    const { email } = event.requestContext.authorizer;
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);

    let result = await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: {
          id: uuid(),
          title,
          status: "OPEN",
          createdAt: now.toISOString(),
          endingAt: endDate.toISOString(),
          highestBid: {
            amount: 0,
          },
          seller: email.toLowerCase(),
        },
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (err) {
    console.error(err);
    if (err instanceof HttpError) throw err;
    throw new createError.InternalServerError();
  }
}

export const handler = commonMiddleware(createAuction);
