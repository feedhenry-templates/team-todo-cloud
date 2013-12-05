/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class to define configuration parameters for the cloud code.
 */


// Dependencies.
var constants = require("./constants.js");


function Config()
{
  // Supported log levels.
  this.logLevels =
  {
    TRACE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
    OFF: 6
  };

  // Prefix to log statements.
  this.logPrefixes =
  {
    1: "TRACE: ",
    2: "DEBUG: ",
    3: "INFO: ",
    4: "WARN: ",
    5: "ERROR: "
  };

  // Current cloud system environment.
  this.currentEnv = constants.ENV_DEVELOPMENT;

  // Configuration values for each environment.
  this.environments =
  {
    // Development environment.
    "development":
    {
      // Current log level.
      "currentLogLevel": this.logLevels.TRACE,
      // Session inactivity timeout interval. (Seconds)
      "sessionTimeout": 24 * 60 * 60
    },
    // Production environment.
    "production":
    {
      // Current log level.
      "currentLogLevel": this.logLevels.ERROR,
      // Session inactivity timeout interval. (Seconds)
      "sessionTimeout": 24 * 60 * 60
    }
  };
};

// Export Module.
module.exports = new Config();