//Dependencies
var utils = require("../utils/utils.js");
var jsonUtils = require("../utils/jsonUtils.js");


var DAOValidation = function() {

  this.validateToDoResponseData = validateToDoResponseData;
  this.validateRoleResponseData = validateRoleResponseData;
  this.validateUserResponseData = validateUserResponseData;
  this.validateAuthenticateUserResponseData = validateAuthenticateUserResponseData;

  /**
   * Function which validates response of list query fetched from database for fetch ToDos request.
   * - Receives data fetched from database.
   * - Returns status as boolean and error message, if any.
   */
  function validateToDoResponseData(toDoResponseData) {
    // Generate response variable to be sent.
    var response = {
      status: true,
      errorMessage: ""
    };

    // If response is empty.
    if (toDoResponseData == null || toDoResponseData == undefined) {
      response.status = false;
      response.errorMessage = "ToDo information not found."
      return response;
    }

    // List exists?
    if (!jsonUtils.isPath(toDoResponseData, "list") || utils.isBlank(jsonUtils.getPath(toDoResponseData, "list"))) {
      response.status = false;
      response.errorMessage = "ToDo information not found."
      return response;
    }

    // Count exists?
    if (!jsonUtils.isPath(toDoResponseData, "count") || utils.isBlank(jsonUtils.getPath(toDoResponseData, "count"))) {
      response.status = false;
      response.errorMessage = "ToDo information not found."
      return response;
    }

    var dataCount = toDoResponseData.count;

    // Is it equal to 0?
    if (dataCount == 0) {
      response.status = false;
      response.errorMessage = "There is no ToDo list."
      return response;
    }

    return response;
  };


  /**
   * Function which validates response of list query fetched from database for fetch role of user request.
   * - Receives data fetched from database.
   * - Returns status as boolean and error message, if any.
   */
  function validateRoleResponseData(roleResponseData) {
    // Generate response variable to be sent.
    var response = {
      status: true,
      errorMessage: ""
    };

    // If response is empty.
    if (roleResponseData == null || roleResponseData == undefined) {
      response.status = false;
      response.errorMessage = "Role information not found."
      return response;
    }

    // Count exists?
    if (!jsonUtils.isPath(roleResponseData, "count") || utils.isBlank(jsonUtils.getPath(roleResponseData, "count"))) {
      response.status = false;
      response.errorMessage = "Role information not found."
      return response;
    }

    var dataCount = roleResponseData.count;

    // Is it equal to 0?
    if (dataCount == 0) {
      response.status = false;
      response.errorMessage = "Role information not found."
      return response;
    }

    // More than 1 Role exists?
    if (dataCount != 1) {
      response.status = false;
      response.errorMessage = "More than one Role exists with same Role type"
      return response;
    }

    // List exists?
    if (!jsonUtils.isPath(roleResponseData, "list") || utils.isBlank(jsonUtils.getPath(roleResponseData, "list"))) {
      response.status = false;
      response.errorMessage = "Role information not found."
      return response;
    }

    return response;
  };


  /**
   * Function which validates response of list query fetched from database for fetch users request.
   * - Receives data fetched from database.
   * - Returns status as boolean and error message, if any.
   */
  function validateUserResponseData(userResponseData) {
    // Generate response
    var response = {
      status: true,
      errorMessage: ""
    };

    // If response is empty.
    if (userResponseData == null || userResponseData == undefined) {
      response.status = false;
      response.errorMessage = "User information not found."
      return response;
    }

    // Count exists?
    if (!jsonUtils.isPath(userResponseData, "count") || utils.isBlank(jsonUtils.getPath(userResponseData, "count"))) {
      response.status = false;
      response.errorMessage = "User information not found."
      return response;
    }

    var dataCount = userResponseData.count;

    // Is it equal to 0?
    if (dataCount == 0) {
      response.status = false;
      response.errorMessage = "There is no User List."
      return response;
    }

    // List exists?
    if (!jsonUtils.isPath(userResponseData, "list") || utils.isBlank(jsonUtils.getPath(userResponseData, "list"))) {
      response.status = false;
      response.errorMessage = "User information not found."
      return response;
    }

    return response;
  };


  /**
   * Function which validates response of list query fetched from database for fetch user request.
   * - Receives data fetched from database.
   * - Returns status as boolean and error message, if any.
   */
  function validateAuthenticateUserResponseData(userResponseData) {
    // Generate response variable to be sent.
    var response = {
      status: true,
      errorMessage: ""
    };

    // If response is empty.
    if (userResponseData == null || userResponseData == undefined) {
      response.status = false;
      response.errorMessage = "User information not found."
      return response;
    }

    // Count exists?
    if (!jsonUtils.isPath(userResponseData, "count") || utils.isBlank(jsonUtils.getPath(userResponseData, "count"))) {
      response.status = false;
      response.errorMessage = "User information not found."
      return response;
    }

    var dataCount = userResponseData.count;

    // Is it equal to 0?
    if (dataCount == 0) {
      response.status = false;
      response.errorMessage = "Invalid username or password."
      return response;
    }

    // More than 1 user exists?
    if (dataCount != 1) {
      response.status = false;
      response.errorMessage = "More than one user exists with same username."
      return response;
    }

    // List exists?
    if (!jsonUtils.isPath(userResponseData, "list") || utils.isBlank(jsonUtils.getPath(userResponseData, "list"))) {
      response.status = false;
      response.errorMessage = "User information not found."
      return response;
    }

    return response;
  };
};

// Export module.
module.exports = new DAOValidation();