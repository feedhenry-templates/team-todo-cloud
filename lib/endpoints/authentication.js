/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Module which encapsulates logic for authentication endpoint.
 * - Validates client request parameters.
 * - Calls a data layer method to validate user credentials.
 * - Generates error and success response.
 */


// Dependencies.
var constants = require("../config/constants.js");
var sessionManager = require("../session/sessionManager.js");
var utils = require("../utils/utils.js");
var jsonUtils = require("../utils/jsonUtils.js");
var responseUtils = require("../utils/responseUtils.js");
var userDAO = require("../dao/user.js");
var validation = require("../utils/endpointsValidation.js");

var AuthenticationEndpoint = function() {
  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.authenticateUser = authenticateUser;

  /**
   * Authentication endpoint API.
   *
   * @params requestParams - Request parameters from client app.
   * @returns callback - Returns final client success/failure response.
   */
  function authenticateUser(requestParams, callback) {
    // Validate request.
    var validationResponse = validation.validateAuthenticationRequest(requestParams);

    // If request parameters are invalid return failure callback.
    if (!validationResponse.status) {
      var errorResponse = responseUtils.constructErrorResponseJson(constants.RESP_BAD_INPUT, "Authentication", "Authentication Failed", validationResponse.message);
      return callback(errorResponse, null);
    }

    // Extract username and password from request parameters.
    var userName = jsonUtils.getPath(requestParams, "request.payload.login.userName").trim();
    var password = jsonUtils.getPath(requestParams, "request.payload.login.password").trim();

    // Construct user validation request object.
    var authenticationParams = {
      "appType": requestParams.request.header.appType,
      "userName": userName,
      "password": password
    };

    // Validate user in database.
    var authenticationResponse = userDAO.fetchUser(authenticationParams, function handleAuthenticationResponse(error, authenticationResponse) {
      // If user credentials are invalid return failure callback.
      if (error) {
        var errorResponse = responseUtils.constructErrorResponseJson(constants.RESP_AUTH_FAILED, "Authentication", "Authentication Failed", error.message);
        return callback(errorResponse, null);
      }

      // Initialize session state. Generate session parameters.
      var userEmail = authenticationResponse.email;
      var userId = authenticationResponse.userId;
      var userRole = authenticationResponse.role;

      // Create and initialize session state.
      var sessionAttributes = {
        "email": userEmail,
        "userId": userId,
        "role": userRole,
      };

      // Initialize session.
      initializeSession(sessionAttributes, function onSessionInit(errorMessage, sessionResponse) {
        // If failed to create session return failure callback.
        if (errorMessage != null) {
          var errorResponse = responseUtils.constructErrorResponseJson(constants.RESP_SERVER_ERROR, "Authentication", "Authentication Failed", "Failed to initialize session - " + errorMessage);
          return callback(errorResponse);
        }

        // Generate client response.
        var loginResponse = responseUtils.constructResponseJson();
        loginResponse.response.header.sessionId = sessionResponse.sessionId;
        loginResponse.response.payload = {
          "login": {
            "status": {
              "code": constants.RESP_SUCCESS,
              "message": "Authentication Success"
            },
            "userProfile": {
              "firstName": authenticationResponse.firstName,
              "lastName": authenticationResponse.lastName,
              "role": userRole
            }
          }
        };

        return callback(null, loginResponse);
      });
    });
  };


  /**
   * Create a new session and initialize the session state to contain the specified parameters.
   *
   * @param sessionParams - Contains parameters to be added in session object.
   * @returns callback - Contains session id/error message in case of failure.
   */
  function initializeSession(sessionParams, callback) {
    // Attempt to create new session.
    sessionManager.createSession(function handleCreateSession(errorMessage, data) {
      // If failed to create new session return failure callback.
      if (errorMessage != null) {
        return callback(errorMessage, null);
      }

      // Initialize session state.
      var sessionId = data.sessionId;

      // Save to session.
      sessionManager.setSessionAttributes(sessionId, sessionParams, function onSessionSetAttr(errorMessage, success) {
        // If failed to set session attributes return failure callback.
        if (errorMessage != null) {
          return callback(errorMessage, null);
        }

        return callback(null, {
          "sessionId": sessionId
        });
      });
    });
  };
};

// Export Module
module.exports = new AuthenticationEndpoint();