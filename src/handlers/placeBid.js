import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddeware";
import createError, { HttpError } from "http-errors";

import { getAuctionById } from "./getAuction";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  try {
    const { id } = event.pathParameters;
    const { amount } = event.body;

    const auction = await getAuctionById(id);

    if (amount <= auction.highestBid.amount)
      throw new createError.BadRequest("the ammount must be bigger");

    const result = await dynamodb
      .update({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {
          id,
        },
        UpdateExpression: "set highestBid.amount = :amount",
        ExpressionAttributeValues: {
          ":amount": amount,
        },
        ReturnValues: "ALL_NEW",
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

export const handler = commonMiddleware(placeBid);
