// Manual SDKs rather than using NPM module
const CognitoSDK = require('./amazon-cognito-identity.js');
const AWS = require('aws-sdk');

AWS
  .config
  .update({accessKeyId: 'your_access_key', secretAccessKey: 'your_secret_access_key', region: 'your_aws_region'});

// User Pool Data for retreiving user pools on aws
var poolData = {
  UserPoolId: 'your_pool_id',
  ClientId: 'your_app_client_id'
};

// universally accessible userPool config
var userPool = new CognitoSDK.CognitoUserPool(poolData);

// Sign In and authenticating user
export function signIn(email, password) {
  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

  return new Promise((resolve, reject) => {
    var authenticationData = {
      Username: email,
      Password: password
    };

    var authenticationDetails = new CognitoSDK.AuthenticationDetails(authenticationData);

    var userData = {
      Username: email, // your username here
      Pool: userPool
    };

    var cognitoUser = new CognitoSDK.CognitoUser(userData);

    console.log('Cognito User', cognitoUser);

    // CHECK USER STATUS IF ITS CONFIRMED OR NOT
    var params = {
      UserPoolId: poolData.UserPoolId,
      /* required */
      Username: email/* required */
    };
    cognitoidentityserviceprovider.adminGetUser(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        // console.log('adminGetUser:',data); successful response
        if (data.UserStatus === 'CONFIRMED') {
          // Authenticating user and providing necessary callback
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
              var authStorageTokens = cognitoUser.storage;
              result.authStorageTokens = authStorageTokens;
              result.userStatus = 'CONFIRMED'
              resolve(result);
            },

            onFailure: function (err) {
              // alert(err);
              console.log('error:', err);
              reject(err);
            },
            // mfaRequired: function(codeDeliveryDetails) {   var verificationCode =
            // prompt('Please input verification code' ,'');
            // cognitoUser.sendMFACode(verificationCode, this); }
          });
        } else if (data.UserStatus === 'FORCE_CHANGE_PASSWORD') {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
              // User authentication was successful
              var authStorageTokens = cognitoUser.storage;
              result.authStorageTokens = authStorageTokens;
              result.userStatus = 'CONFIRMED'
              resolve(result);
            },

            onFailure: function (err) {
              // User authentication was not successful
              reject(err)
            },

            newPasswordRequired: function (userAttributes, requiredAttributes) {
              // User was signed up by an admin and must provide new password and required
              // attributes, if any, to complete authentication. userAttributes: object, which
              // is the user's current profile. It will list all attributes that are
              // associated with the user. Required attributes according to schema, which
              // don’t have any values yet, will have blank values. requiredAttributes: list
              // of attributes that must be set by the user along with new password to
              // complete the sign-in. Get these details and call newPassword: password that
              // user has given attributesData: object with key as attribute name and value
              // that the user has given.

              var attributesData = {};
              var newPassword = prompt('Enter new password ', '');

              cognitoUser.completeNewPasswordChallenge(newPassword, attributesData, this)
            }
          });
        } else {
          resolve('UserStatus:', data.UserStatus);
        }
      }
    });
  })
}

// Sign Up and register a user
export function signUp(email, password, name) {

  return new Promise((resolve, reject) => {
    var attributeList = [];

    var dataEmail = {
      Name: 'email',
      Value: email
    };
    var dataName = {
      Name: 'name',
      Value: name
    };
    var attributeEmail = new CognitoSDK.CognitoUserAttribute(dataEmail);
    var attributeName = new CognitoSDK.CognitoUserAttribute(dataName);

    attributeList.push(attributeEmail);
    attributeList.push(attributeName);
    userPool.signUp(email, password, attributeList, null, function (err, result) {
      if (err) {
        reject(err);
        return;
      } else {
        // cognitoUser = result.user;
        var userData = {
          Username: email, // your username here
          Pool: userPool
        };
        var cognitoUser = new CognitoSDK.CognitoUser(userData);

        var userObj = {
          email: cognitoUser.getUsername(),
          message: 'Sign up successful'
        }
        resolve(userObj);
      }
    });
  })
}

export function forgotPassword(email) {
  return new Promise((resolve, reject) => {
    var userData = {
      Username: email, // your username here
      Pool: userPool
    };

    var cognitoUser = new CognitoSDK.CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        resolve("Password reset successful");
      },
      onFailure: function (err) {
        reject(err);
      },
      inputVerificationCode() {
        var verificationCode = prompt('Please enter verification code ( Check Email )', '');
        var newPassword = prompt('Enter new password ', '');
        cognitoUser.confirmPassword(verificationCode, newPassword, this);
      }
    });
  })
}

export function signOut(email) {

  var signOutSuccessful = null;
  return new Promise((resolve, reject) => {
    var userData = {
      Username: email, // your username here
      Pool: userPool
    };
    var cognitoUser = new CognitoSDK.CognitoUser(userData);

    // If cognito user object is null, then it sums up that it does not need to
    // perform  sign out operation as there is no new user
    if (cognitoUser != null) {
      cognitoUser.signOut();
      signOutSuccessful = true;
      resolve(signOutSuccessful);
    } else {
      signOutSuccessful = false;
      reject(signOutSuccessful);
    }
  })

}

// TO CHECK IF USER IS LOGGED IN
export function isUserLoggedIn(email) {

  var currAWSUser = userPool.getCurrentUser();
  if (currAWSUser === null) {
    return false
  } else {
    return true
  }
}

// TO GET CURRENT USER'S DETAILS
export function getCurrentUser(email) {
  var currAWSUser = userPool.getCurrentUser();

  return new Promise((resolve, reject) => {
    if (currAWSUser === null) {
      reject("User Doesn't exists")
    } else {
      resolve(currAWSUser);
    }
  })
}

export function createUser(email, password, role) {
  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

  return new Promise((resolve, reject) => {
    var EMAIL = email;
    var params = {
      UserPoolId: poolData.UserPoolId,
      /* required */
      Username: email,
      /* required */

      DesiredDeliveryMediums: [
        "EMAIL",
        /* more items */
      ],
      ForceAliasCreation: true,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email',
          /* required */
          Value: email
        }, {
          Name: 'custom:role',
          /* required */
          Value: role
        }, {
          Name: 'email_verified',
          Value: 'true'
        },
        /* more items */
      ],
      // ValidationData: [   {     Name: 'email', /* required */     Value: email   },
      //   /* more items */ ]
    };
    cognitoidentityserviceprovider.adminCreateUser(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      } else {
        console.log(data); // successful response
        resolve(data);
      }
    });
  })

}
