/**
 * * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility / helper functions for logging.
 * - Validates message to be logged.
 * - Allows to log trace, debug, info, warning & error level messages.
 */

// Dependencies.
var constants = require("../../config/constants.js");
var config = require("../../config/config.js");

var Logger = function() {
  // Global module level variables.
  var MODULE_NAME = "Logger.js: ";

  // Public functions.
  this.trace = trace;
  this.debug = debug;
  this.info = info;
  this.warn = warn;
  this.error = error;


  /**
   * Function to log trace level message.
   */
  function trace(message) {
    if (validate(message)) {
      log(config.logLevels.TRACE, message);
    }
  };


  /**
   * Function to log debug level message.
   */
  function debug(message) {
    if (validate(message)) {
      log(config.logLevels.DEBUG, message);
    }
  };


  /**
   * Function to log info level message.
   */
  function info(message) {
    if (validate(message)) {
      log(config.logLevels.INFO, message);
    }
  };


  /**
   * Function to log warning level message.
   */
  function warn(message) {
    if (validate(message)) {
      log(config.logLevels.WARN, message);
    }
  };


  /**
   * Function to log error level message.
   */
  function error(message) {
    if (validate(message)) {
      log(config.logLevels.ERROR, message);
    }
  };


  /**
   * Function to log message.
   */
  function log(level, message) {
    var METHOD_NAME = "log(): ";

    // Level not specified or not a supported log level.
    if (level == null || !config.logPrefixes.hasOwnProperty(level)) {
      console.log(MODULE_NAME + METHOD_NAME + "Bad log level: " + level + " for message: " + message);
      return;
    }

    var levelPrefix = config.logPrefixes[level];

    var now = new Date();
    var datePrefix = now.toJSON();

    var currentEnv = constants.ENV_DEVELOPMENT;

    if (config.currentEnv != null) {
      currentEnv = config.currentEnv;
    }

    if (level >= config.environments[currentEnv].currentLogLevel) {
      console.log(levelPrefix + " " + datePrefix + ": " + message);
    }
  };


  /**
   * Function to validate log message.
   */
  function validate(message) {
    var METHOD_NAME = "validate(): ";

    // Have config?
    if (config == null) {
      console.log(MODULE_NAME + METHOD_NAME + "Log configuration not defined. Not logging.");
      return false;
    }

    var currentEnv = constants.ENV_DEVELOPMENT;

    if (config.currentEnv != null) {
      currentEnv = config.currentEnv;
    }

    // Have log levels?
    if (config.logLevels == null || config.environments[currentEnv].currentLogLevel == null) {
      console.log(MODULE_NAME + METHOD_NAME + "Bad logger configuration. Not logging.");
      return false;
    }

    // Have message?
    if (message == null) {
      return false;
    }

    return true;
  };
};

// Export Module
module.exports = new Logger();