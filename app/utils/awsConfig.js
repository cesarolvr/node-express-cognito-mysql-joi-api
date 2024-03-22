import AWS from "aws-sdk";
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { jwtDecode } from "jwt-decode";

let cognitoAttributeList = [];

const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID,
};

const attributes = (key, value) => {
  return {
    Name: key,
    Value: value,
  };
};

export function setCognitoAttributeList(email, agent) {
  let attributeList = [];
  attributeList.push(attributes("email", email));
  attributeList.forEach((element) => {
    cognitoAttributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute(element)
    );
  });
}

export function getCognitoAttributeList() {
  return cognitoAttributeList;
}

export function getCognitoUser(email) {
  const userData = {
    Username: email,
    Pool: getUserPool(),
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

export function getUserPool() {
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

export function getAuthDetails(email, password) {
  var authenticationData = {
    Username: email,
    Password: password,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

export function initAWS(
  region = process.env.AWS_COGNITO_REGION,
  identityPoolId = process.env.USER_POOL_ID
) {
  AWS.config.region = region;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
  });
}

export function decodeJWTToken(token) {
  const { email, exp, auth_time, token_use, sub } = jwtDecode(token.idToken);
  return { token, email, exp, uid: sub, auth_time, token_use };
}
