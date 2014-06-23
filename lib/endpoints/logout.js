/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Module which encapsulates logic for logout endpoint.
 * - Validates client request parameters.
 * - Validates session id.
 * - If session is valid, destroys it.
 * - Generates error and success responses.
 */


// Dependencies.
var winston = require("winston");
var constants = require("../config/constants.js");
var sessionManager = require("../session/sessionManager.js");
var utils = require("../utils/utils.js");
var jsonUtils = require("../utils/jsonUtils.js");
var responseUtils = require("../utils/responseUtils");

var LogoutEndpoint = function() {
  // Global module level variables.
  var MODULE_NAME = "LogoutEndpoint.js: ";

  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.logoutUser = logoutUser;

  /**
   * Logout endpoint API.
   *
   * @params requestParams - Request parameters from client app.
   * @params callback - Returns final client success/failure response.
   */
  function logoutUser(requestParams, callback) {
    var METHOD_NAME = "logoutUser(): "

    // Extract sessionId from request parameters.
    var sessionId = jsonUtils.getPath(requestParams, "request.header.sessionId");

    // Destroy the session.
    sessionManager.destroySession(sessionId, function handleDestroySessionResponse(errorMessage, successObject) {
      // Even if session destroy fails, send success response.
      if (errorMessage) {
        var responseJson = responseUtils.constructStatusResponseJson("logout", constants.RESP_SUCCESS, "User logged out.");
        winston.info(MODULE_NAME + METHOD_NAME + "Logout operation failed - " + JSON.stringify(responseJson));
        return callback(null, responseJson);
      }

      var responseJson = responseUtils.constructStatusResponseJson("logout", constants.RESP_SUCCESS, "User logged out.");
      winston.info(MODULE_NAME + METHOD_NAME + "Logout operation succeed - " + JSON.stringify(responseJson));
      return callback(null, responseJson);
    });
  };
};

// Export module.
module.exports = new LogoutEndpoint();