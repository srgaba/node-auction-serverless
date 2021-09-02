import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import axios from "axios";
// const NodeCache = require('node-cache')

// const cacheKeys = new NodeCache()

const getJwkByKid = async (decodedToken) => {
  const { kid: keyId } = decodedToken.header;
  const jwks = (await axios.get(process.env.JWK_AUTHORIZER_URL)).data.keys;
  return jwks.find((jwk) => jwk.kid === keyId);
};

const denyAllPolicy = () => ({
  principalId: "*",
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "*",
        Effect: "Deny",
        Resource: "*",
      },
    ],
  },
});

const allowPolicy = (user) => ({
  principalId: "apigateway.amazonaws.com",
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: "Allow",
        Resource: "*",
      },
    ],
  },
  context: user,
});

const getUserFromTokenVerified = (verifiedToken) => ({
  email: verifiedToken.email,
});

export const handler = async (event, context) => {
  try {
    const { authorizationToken: headerToken } = event;
    const [, encodedToken] = headerToken.split(" ");
    const decodedToken = jwt.decode(encodedToken, { complete: true });
    const jwk = await getJwkByKid(decodedToken);
    const pem = jwkToPem(jwk);
    const verifiedToken = jwt.verify(encodedToken, pem);
    const user = getUserFromTokenVerified(verifiedToken);
    return allowPolicy(user);
  } catch (err) {
    console.log(err);
    return denyAllPolicy();
  }
};
