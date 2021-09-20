import AWS from "aws-sdk";
import createError from "http-errors";

import { getAuctionById } from "./getAuction";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import { setAuctionPictureUrl } from "../lib/setAuctionPictureUrl";

export async function uploadAuctionPicture(event, context) {
  try {
    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);
    const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");

    const uploadUrl = await uploadPictureToS3(auction.id + ".jpg", buffer);
    const result = await setAuctionPictureUrl(id, uploadUrl);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    throw new createError.InternalServerError();
  }
}

export const handler = uploadAuctionPicture;
