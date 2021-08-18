import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddeware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError();
  }
}

export const handler = commonMiddleware(getAuctions);
