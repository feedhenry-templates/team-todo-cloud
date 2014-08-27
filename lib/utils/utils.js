/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility / helper functions.
 * - Validates a specfied string field is not null, undefined and empty.
 */


// Dependencies.
var winston = require("winston");


var Utils = function() {
  // Global module level variables.
  var MODULE_NAME = "Utils.js: ";

  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.isBlank = isBlank;
  this.logStackTrace = logStackTrace;


  /**
   * Is specified string reference null or empty?
   *
   * @param field
   * @returns Boolean
   */
  function isBlank(field) {
    if (field == null || field == undefined) {
      return true;
    }

    if (typeof field !== "string") {
      return false;
    }

    if (field.trim().length === 0) {
      return true;
    }

    return false;
  };


  /**
   * Function to log a stacktrace from the given error object.
   */
  function logStackTrace(message, error) {
    var METHOD_NAME = "logStackTrace(): ";

    if (!error || error == null || error == undefined) {
      winston.error(MODULE_NAME + METHOD_NAME + "Stack Trace Logger: Undefined or null error object passed.");
      return;
    }

    if (typeof error !== 'object') {
      winston.error(MODULE_NAME + METHOD_NAME + "Stack Trace Logger: Argument is not an Object.");
      return;
    }

    winston.error("====== Error Object Stack Trace Begin =======: " + message);

    if (error.message) {
      winston.error("Message: " + error.message);
    }

    if (error.stack) {
      winston.error("Stacktrace: " + error.stack);
    }

    winston.error("====== Error Object Stack Trace End =======");

    return;
  };
};


// Export Module
module.exports = new Utils();