/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility functions for validating data.
 * - Validates session parameters.
 * - Validates authentication request parameters.
 * - Validates change TODO request parameters.
 * - Validates complete TODO request parameters.
 * - Validates create TODO request parameters.
 * - Validates delete TODO request parameters.
 * - Validates update TODO request parameters.
 */


//Dependencies
var utils = require("../utils/utils.js");
var jsonUtils = require("../utils/jsonUtils.js");


var EndpointsValidation = function() {
  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.validateSessionParameters = validateSessionParameters;
  this.validateAuthenticationRequest = validateAuthenticationRequest;
  this.validateChangeTodoRequest = validateChangeTodoRequest;
  this.validateCompleteTodoRequest = validateCompleteTodoRequest;
  this.validateCreateTodoRequest = validateCreateTodoRequest;
  this.validateDeleteTodoRequest = validateDeleteTodoRequest;
  this.validateUpdateTodoRequest = validateUpdateTodoRequest;


  /**
   * Validate key hierarchy exists in Json Object and its value is not blank.
   *
   * @returns boolean - Contains a boolean indicating success/failure & error message, if any.
   */
  function validatePathAndData(jsonObject, keyHierarchy, response, message) {
    if (!jsonUtils.isPath(jsonObject, keyHierarchy) || utils.isBlank(jsonUtils.getPath(jsonObject, keyHierarchy))) {
      response.status = false;
      response.message += message;
    }

    return response;
  };


  /**
   * Validate session attributes.
   *
   * @returns jsonObject - Contains a boolean indicating success/failure & error message, if any.
   */
  function validateSessionParameters(sessionObject) {
    // Generate response variable to be sent.
    var response = {
      status: true,
      message: ""
    };

    // UserRole exist?
    response = validatePathAndData(sessionObject, "role", response, "UserRole not exist in session parameters. ");
    // UserId exists?
    response = validatePathAndData(sessionObject, "userId", response, "UserId not exist in session parameters. ");

    return response;
  };



  /**
   * Validate request parameters.
   *
   * @params requestParams - Request parameters from client app.
   * @returns jsonObject - Contains a boolean indicating success/failure & error message, if any.
   */
  function validateAuthenticationRequest(requestParams) {
    // Generate response variable to be sent.
    var response = {
      status: true,
      message: ""
    };

    // Application type specified?
    response = validatePathAndData(requestParams, "request.header.appType", response, "Application Type not specified. ");
    // UserName specified?
    response = validatePathAndData(requestParams, "request.payload.login.userName", response, "UserName not specified. ");
    // Password specified?
    response = validatePathAndData(requestParams, "request.payload.login.password", response, "Password not specified. ");

    return response;
  };


  /**
   * Validate request parameters.
   *
   * @returns jsonObject - Contains a boolean indicating success/failure & error message, if any.
   */
  function validateChangeTodoRequest(requestParams) {
    // Generate response variable to be sent.
    var response = {
      status: true,
      message: ""
    };

    // ToDoId specified?
    response = validatePathAndData(requestParams, "request.payload.changeToDo.toDoId", response, "ToDo Id not specified. ");
    // Title specified?
    response = validatePathAndData(requestParams, "request.payload.changeToDo.title", response, "Title not specified. ");
    // Description specified?
    response = validatePathAndData(requestParams, "request.payload.changeToDo.description", response, "Description not specified. ");
    // Deadline specified?
    response = validatePathAndData(requestParams, "request.payload.changeToDo.deadline", response, "Deadline not specified.  ");
    // AssignedTo specified?
    response = validatePathAndData(requestParams, "request.payload.changeToDo.assignedTo", response, "AssignTo not specified.");
    // Latitude specified?
    response = validatePathAndData(requestParams, "request.payload.changeToDo.latitude", response, "Latitude not specified. ");
    // Longitude specified?
    response = validatePathAndData(requestParams, "request.payload.changeToDo.longitude", response, "Longitude not specified. ");

    return response;
  };


  /**
   * Validate request parameters.
   *
   * @returns jsonObject - Contains a boolean indicating success/failure & error message, if any.
   */
  function validateCompleteTodoRequest(requestParams) {
    // Generate response variable to be sent.
    var response = {
      status: true,
      message: ""
    };

    // ToDoId specified?
    response = validatePathAndData(requestParams, "request.payload.completeToDo.toDoId", response, "ToDo Id not specified. ");
    // Note specified?
    response = validatePathAndData(requestParams, "request.payload.completeToDo.note", response, "Note not specified. ");
    // CompletedOn CompletedOn?
    response = validatePathAndData(requestParams, "request.payload.completeToDo.completedOn", response, "CompletedOn not specified. ");
    // Latitude specified?
    response = validatePathAndData(requestParams, "request.payload.completeToDo.latitude", response, "Latitude not specified. ");
    // Longitude specified?
    response = validatePathAndData(requestParams, "request.payload.completeToDo.longitude", response, "Longitude not specified. ");
    // Photo specified?
    response = validatePathAndData(requestParams, "request.payload.completeToDo.photo", response, "Photo not specified. ");

    return response;
  };


  /**
   * Validate request parameters.
   *
   * @returns jsonObject - Contains a boolean indicating success/failure & error message, if any.
   */
  function validateCreateTodoRequest(requestParams) {
    // Generate response variable to be send.
    var response = {
      status: true,
      message: ""
    };

    // Title specified?
    response = validatePathAndData(requestParams, "request.payload.createToDo.title", response, "Title not specified. ");
    // Description specified?
    response = validatePathAndData(requestParams, "request.payload.createToDo.description", response, "Description not specified. ");
    // Deadline specified?
    response = validatePathAndData(requestParams, "request.payload.createToDo.deadline", response, "Deadline not specified. ");
    // AssignedTo specified?
    response = validatePathAndData(requestParams, "request.payload.createToDo.assignedTo", response, "AssignTo not specified. ");
    // Latitude specified?
    response = validatePathAndData(requestParams, "request.payload.createToDo.latitude", response, "Latitude not specified. ");
    // Longitude specified?
    response = validatePathAndData(requestParams, "request.payload.createToDo.longitude", response, "Longitude not specified. ");

    return response;
  };


  /**
   * Validate request parameters.
   *
   * @returns jsonObject - Contains a boolean indicating success/failure & error message, if any.
   */
  function validateDeleteTodoRequest(requestParams) {
    // Generate response variable to be send.
    var response = {
      status: true,
      message: ""
    };

    // ToDO Id specified?
    response = validatePathAndData(requestParams, "request.payload.deleteToDo.toDoId", response, "ToDo Id not specified. ");

    return response;
  };


  /**
   * Validate request parameters.
   *
   * @returns jsonObject - Contains a boolean indicating success/failure & error message, if any.
   */

  function validateUpdateTodoRequest(requestParams) {
    // Generate response variable to be send.
    var response = {
      status: true,
      message: ""
    };

    // Id specified?
    response = validatePathAndData(requestParams, "request.payload.updateToDo.toDoId", response, "ToDo Id not specified. ");
    // Description specified?
    response = validatePathAndData(requestParams, "request.payload.updateToDo.description", response, "Description not specified. ");
    // Deadline specified?
    response = validatePathAndData(requestParams, "request.payload.updateToDo.deadline", response, "Deadline not specified. ");
    // Latitude specified?
    response = validatePathAndData(requestParams, "request.payload.updateToDo.latitude", response, "Latitude not specified. ");
    // Longitude specified?
    response = validatePathAndData(requestParams, "request.payload.updateToDo.longitude", response, "Longitude not specified. ");
    // Status specified?
    response = validatePathAndData(requestParams, "request.payload.updateToDo.status", response, "Status not specified. ");
    // Note specified?
    response = validatePathAndData(requestParams, "request.payload.updateToDo.note", response, "Note not specified. ");

    return response;
  };
};

// Export module.
module.exports = new EndpointsValidation();