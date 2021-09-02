export const handler = async (event, context) => {
  console.log(event, context);
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};
