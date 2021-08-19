import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddeware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  const result = await dynamodb
    .get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    })
    .promise();

  if (!result.Item) createError.NotFound();

  return result.Item;
}

async function getAuction(event, context) {
  try {
    const { id } = event.pathParameters;

    const auction = await getAuctionById(id);

    return {
      statusCode: 200,
      body: JSON.stringify(auction),
    };
  } catch (err) {
    console.error(err);
    if (err instanceof HttpError) throw err;
    throw new createError.InternalServerError();
  }
}

export const handler = commonMiddleware(getAuction);
