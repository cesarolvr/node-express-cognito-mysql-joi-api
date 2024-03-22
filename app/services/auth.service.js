import AWS from "aws-sdk";

// TODO: ver a necessidade de crypto e bcrypt na mesma app
import crypto from "crypto";

const awsConfig = {
  region: process.env.COGNITO_REGION,
};

const cognitoCredentials = {
  clientId: process.env.COGNITO_CLIENT_ID,
  secretHash: process.env.COGNITO_CLIENT_SECRET,
};

console.log("cognitoCredentials", cognitoCredentials);

const generateHash = (email) => {
  return crypto
    .createHmac("SHA256", cognitoCredentials.secretHash)
    .update(`${email}${cognitoCredentials.clientId}`)
    .digest("base64");
};

export const signUp = async ({ email, password }, userAttributes) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  const hash = generateHash(email);

  console.log("hash", hash);

  return await cognitoIdentify
    .signUp({
      ClientId: cognitoCredentials.clientId,
      Password: password,
      Username: email,
      SecretHash: hash,
      UserAttributes: userAttributes,
    })
    .promise();
};
