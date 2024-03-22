import {
  initAWS,
  setCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  getAuthDetails,
  getCognitoAttributeList,
} from "../utils/awsConfig.js";

export const signUp = (email, password, agent = "none") => {
  return new Promise((resolve) => {
    initAWS();
    setCognitoAttributeList(email, agent);
    getUserPool().signUp(
      email,
      password,
      getCognitoAttributeList(),
      null,
      function (err, result) {
        if (err) {
          return resolve({ statusCode: 422, response: err });
        }
        const response = {
          username: result.user.username,
          userConfirmed: result.userConfirmed,
          userAgent: result.user.client.userAgent,
        };
        return resolve({ statusCode: 201, response: response });
      }
    );
  });
};

export const verify = (email, code) => {
  return new Promise((resolve) => {
    getCognitoUser(email).confirmRegistration(code, true, (err, result) => {
      if (err) {
        return resolve({ statusCode: 422, response: err });
      }
      return resolve({ statusCode: 400, response: result });
    });
  });
};

export const signIn = (email, password) => {
  return new Promise((resolve) => {
    getCognitoUser(email).authenticateUser(getAuthDetails(email, password), {
      onSuccess: (result) => {
        const token = {
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        };
        return resolve({
          statusCode: 200,
          response: decodeJWTToken(token),
        });
      },

      onFailure: (err) => {
        return resolve({
          statusCode: 400,
          response: err.message || JSON.stringify(err),
        });
      },
    });
  });
};
