const schema = {
  properties: {
    queryStringParamateters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["OPEN", "CLOSE"],
          default: "OPEN",
        },
      },
    },
  },
  required: ["queryStringParameters"],
};

export default schema;
