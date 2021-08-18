import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddeware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  try {
    const { id } = event.pathParameters;

    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError();
  }
}

export const handler = commonMiddleware(getAuction);
