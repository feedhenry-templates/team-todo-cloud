/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class to define constants to be used across the cloud code.
 */


var Constants = function() {
  // Possible values of cloud app running environment.
  this.ENV_DEVELOPMENT = "development";
  this.ENV_PRODUCTION = "production";

  // Application Type
  this.APPTYPE_PORTAL = "Portal";
  this.APPTYPE_CLIENT = "Client";

  // Possible Roles of user in the system.
  this.ROLE_ADMIN = "Admin";
  this.ROLE_USER = "User";

  // Default user credentials for portal app.
  this.DEFAULT_ADMIN_USER_JANINE = "Janine";
  this.DEFAULT_ADMIN_PASSWORD = "Firehouse";

  // Default user credentials for mobile app.
  this.DEFAULT_USER_SPENGLER = "Spengler";
  this.DEFAULT_USER_VENKMAN = "Venkman";
  this.DEFAULT_USER_STANTZ = "Stantz";
  this.DEFAULT_USER_ZEDDEMORE = "Zeddemore";
  this.DEFAULT_USER_PASSWORD = "TheKeymaster";

  // Possible states of ToDo.
  this.TODO_STATUS_NEW = "New";
  this.TODO_STATUS_IN_PROGRESS = "In Progress";
  this.TODO_STATUS_REJECTED = "Rejected";
  this.TODO_STATUS_COMPLETED = "Completed";

  // Various success/failure response codes from the endpoints.
  this.RESP_PROCESSING = "SUCCESS_102";
  this.RESP_SUCCESS = "SUCCESS_200";
  this.RESP_INACTIVE_ENROLL = "ERR_402";
  this.RESP_BAD_INPUT = "ERR_400";
  this.RESP_AUTH_FAILED = "ERR_401";
  this.RESP_SERVER_ERROR = "ERR_500";
};

// Export Module
module.exports = new Constants();