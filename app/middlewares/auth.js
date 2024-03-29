
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

export const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers["authorization"];

  try {
    const payload = await verifier.verify(accessToken);
    req.userInfo = payload;
    req.accessToken = accessToken
    next();
  } catch (err) {
    res
      .status(403)
      .send({
        message: "Invalid token",
      })
      .end();
  }
};
