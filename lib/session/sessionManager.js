/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility / helper functions for managing user sessions.
 * - Creates new session for valid user.
 * - Validates session for incoming requests.
 * - Returns the session object associated to the specified sessionId.
 * - Returns the value for the specified attribute stored in the session.
 * - Sets an attribute in the current session object.
 * - Resets the session timeout.
 */

// Dependencies.
var winston = require("winston");
var constants = require("../config/constants.js");
var config = require("../config/config.js");
var uuid = require("../uuid/uuid.js");
var utils = require("../utils/utils.js");
var fh = require('fh-mbaas-api');

var SessionManager = function() {
  // Global module level variables.
  var MODULE_NAME = "SessionManager.js: ";

  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.createSession = createSession;
  this.getSession = getSession;
  this.setSessionAttributes = setSessionAttributes;
  this.isValidSession = isValidSession;
  this.destroySession = destroySession;
  this.generateSessionId = generateSessionId;


  /**
   * Generates a pseudo-random UUID as the session id.
   */
  function generateSessionId() {
    return uuid();
  };


  /**
   * Creates new session object and returns the sessionId.
   */
  function createSession(callback) {
    var METHOD_NAME = "createSession(): ";

    // Pseudo random sessionId.
    var sessionId = generateSessionId();

    // Initial session Json Object.
    var sessionObjectJson = {
      "sessionId": sessionId
    };

    // Serialize it.
    var sessionObject = JSON.stringify(sessionObjectJson);

    var currentEnv = constants.ENV_DEVELOPMENT;

    if (config.currentEnv != null) {
      currentEnv = config.currentEnv;
    }

    // Save it.
    fh.session.set(sessionId, sessionObject, config.environments[currentEnv].sessionTimeout, function(error) {
      if (error) {
        return callback("Failed to save session object to fh.session() - " + JSON.stringify(error), null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Session created successfully - " + sessionId);

      return callback(null, {
        "sessionId": sessionId
      });
    });
  };


  /**
   * Gets the session object associated to the specified sessionId.
   */
  function getSession(sessionId, callback) {
    if (utils.isBlank(sessionId)) {
      return callback("SessionId not provided to getSession().", null);
    }

    // Do we have the object in session?
    fh.session.get(sessionId, function handleSessionLoad(error, data) {
      if (error) {
        return callback("Error fetching session object from session - " + JSON.stringify(error), null);
      }

      // Extend the session expiry time.
      resetSessionTimeout(sessionId, data, function(errorMessage, status) {
        // Failed to extend session lifetime?
        if (errorMessage != null) {
          return callback(errorMessage, null);
        }

        // All ok! Deserialize session string and return.
        return callback(null, JSON.parse(data));
      });
    });
  };


  /**
   * Sets an attribute in the current session object.
   */
  function setSessionAttributes(sessionId, attributesMap, callback) {
    if (utils.isBlank(sessionId)) {
      return callback("SessionId not provided to setSessionAttributes().", null);
    }

    if (attributesMap == null) {
      return callback("AttributesMap not provided to setSessionAttributes().", null);
    }

    // Fetch session object from session.
    getSession(sessionId, function(errorMessage, sessionObject) {
      // Trouble?
      if (errorMessage != null) {
        return callback(errorMessage, null);
      }

      // No session state?
      if (sessionObject == null) {
        return callback(null, false);
      }

      // Update all items from the attributesMap to sessionObject.
      for (var attrributeName in attributesMap) {
        var attributeValue = attributesMap[attrributeName];
        sessionObject[attrributeName] = attributeValue;
      }

      // Serialize the sessionObject if required.
      var sessionObjectToCache = sessionObject;

      if (typeof(sessionObject) == 'object') {
        sessionObjectToCache = JSON.stringify(sessionObject);
      }

      var currentEnv = constants.ENV_DEVELOPMENT;

      if (config.currentEnv != null) {
        currentEnv = config.currentEnv;
      }

      // Store the sessionObject back to the session.
      fh.session.set(sessionId, sessionObjectToCache, config.environments[currentEnv].sessionTimeout, function(error) {
        if (error) {
          return callback("Unable to set attribute into Session - " + JSON.stringify(error), null);
        }

        // Not invoking resetSessionTimeout(), since the getSession() call above has already done it.
        // All ok!
        return callback(null, true);
      });
    });
  };


  /**
   * Checks whether the session is valid and active.
   */
  function isValidSession(sessionId, callback) {
    var METHOD_NAME = "isValidSession(): ";

    if (utils.isBlank(sessionId)) {
      return callback("SessionId not provided to isValidSession().", null);
    }

    // Do we have a session object in session for the specified sessionId?
    fh.session.get(sessionId, function handleSessionLoad(error, data) {
      if (error) {
        return callback("Error fetching session object from session - " + JSON.stringify(error), null);
      }

      // Session object found?
      if (data == null) {
        winston.info(MODULE_NAME + METHOD_NAME + "Session does not exist for sessionId - " + sessionId);
        return callback(null, false);
      }

      // Extend the session expiry time.
      resetSessionTimeout(sessionId, data, function(errorMessage, status) {
        // Trouble?
        if (errorMessage != null) {
          return callback(errorMessage, null);
        }

        // All ok!
        return callback(null, true);
      });
    });
  };


  /**
   * Resets the timeout upon every request so that the session doesn't expire until the user is active.
   * Private function that will be called whenever there is call to any of the public methods of this class.
   */
  function resetSessionTimeout(sessionId, sessionObject, callback) {
    var METHOD_NAME = "resetSessionTimeout(): ";

    if (utils.isBlank(sessionId)) {
      return callback("SessionId not provided to resetSessionTimeout().", null);
    }

    if (sessionObject == null) {
      return callback("SessionObject not provided to resetSessionTimeout().", null);
    }

    // Serialize the sessionObject if required.
    var sessionObjectToCache = sessionObject;

    if (typeof(sessionObject) == 'object') {
      sessionObjectToCache = JSON.stringify(sessionObject);
    }

    var currentEnv = constants.ENV_DEVELOPMENT;

    if (config.currentEnv != null) {
      currentEnv = config.currentEnv;
    }

    // Save sessionObject back to cache. Hopefully, this resets the expiry time in the fh.cache?
    fh.session.set(sessionId, sessionObjectToCache, config.environments[currentEnv].sessionTimeout, function(error) {
      if (error) {
        return callback("Unable to reset session timeout - " + JSON.stringify(error), null);
      }

      return callback(null, true);
    });
  };


  /**
   * Code for invalidating/destroying session.
   */
  function destroySession(sessionId, callback) {
    var METHOD_NAME = "destroySession(): ";
    winston.info(MODULE_NAME + METHOD_NAME + "Attempting to destroy session for SessionId - " + sessionId);

    if (utils.isBlank(sessionId)) {
      return callback("SessionId not provided to destroySession().", null);
    }

    fh.session.remove(sessionId, function(error, data) {
      if (error) {
        winston.error(MODULE_NAME + METHOD_NAME + "Error removing session object from the session store - " + JSON.stringify(error));
        return callback("Error removing session object from the session store - " + JSON.stringify(error), null);
      }

      if (data == true) {
        winston.info(MODULE_NAME + METHOD_NAME + "Session object removed successfully from session store. SessionId - " + sessionId);
        return callback(null, true);
      } else {
        winston.error(MODULE_NAME + METHOD_NAME + "Error removing session object from session store or bad sessionId. SessionId - " + sessionId);
        return callback("Error removing session object from session store or bad sessionId. SessionId - " + sessionId, false);
      }
    });
  };
};

// Export Module
module.exports = new SessionManager();