import AWS from "aws-sdk";

import crypto from "crypto";

const awsConfig = {
  region: process.env.COGNITO_REGION,
};

const cognitoCredentials = {
  clientId: process.env.COGNITO_CLIENT_ID,
  secretHash: process.env.COGNITO_CLIENT_SECRET,
};

const generateHash = (email) => {
  return crypto
    .createHmac("SHA256", cognitoCredentials.secretHash)
    .update(`${email}${cognitoCredentials.clientId}`)
    .digest("base64");
};

export const signUp = async ({ email, password }, userAttributes) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  const hash = generateHash(email);

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

export const signin = async (email, password) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  const hash = generateHash(email);

  return cognitoIdentify
    .initiateAuth({
      ClientId: cognitoCredentials.clientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: hash,
      },
    })
    .promise();
};

export const confirm = async ({ email, code }) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  const hash = generateHash(email);

  return cognitoIdentify
    .confirmSignUp({
      ClientId: cognitoCredentials.clientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: hash,
    })
    .promise();
};

export const resend = async ({ username }) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  const hash = generateHash(username);

  return await cognitoIdentify
    .resendConfirmationCode({
      ClientId: cognitoCredentials.clientId,
      Username: username,
      SecretHash: hash,
    })
    .promise();
};

export const resetPassword = async (email) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  const hash = generateHash(email);

  return await cognitoIdentify
    .forgotPassword({
      ClientId: cognitoCredentials.clientId,
      // Password: password,
      Username: email,
      SecretHash: hash,
    })
    .promise();
};

export const resetPasswordConfirmation = async (email, newPassword, code) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  const hash = generateHash(email);

  return await cognitoIdentify
    .confirmForgotPassword({
      ClientId: cognitoCredentials.clientId,
      ConfirmationCode: code,
      Password: newPassword,
      Username: email,
      SecretHash: hash,
    })
    .promise();
};

export const getUser = async (token) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  return await cognitoIdentify
    .getUser({
      AccessToken: token,
    })
    .promise();
};

export const signout = async (token) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  return await cognitoIdentify
    .globalSignOut({
      AccessToken: token,
    })
    .promise();
};

export const updateUser = async (token, userAttributes) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  return await cognitoIdentify
    .updateUserAttributes({
      AccessToken: token,
      UserAttributes: userAttributes,
    })
    .promise();
};

export const deleteUser = async (token) => {
  const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

  return await cognitoIdentify
    .deleteUser({
      AccessToken: token,
    })
    .promise();
};

// export const deleteUser = async ({ email, password }, userAttributes) => {
//   const cognitoIdentify = new AWS.CognitoIdentityServiceProvider(awsConfig);

//   const hash = generateHash(email);

//   console.log("hash", hash);

//   return await cognitoIdentify.deleteUser({
//       ClientId: cognitoCredentials.clientId,
//       Password: password,
//       Username: email,
//       SecretHash: hash,
//       UserAttributes: userAttributes,
//     })
//     .promise();
// };
