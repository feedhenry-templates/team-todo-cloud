/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Module which encapsulates logic for generating response for doList() method of cloud sync service.
 * - Validates session parameters.
 * - Fetch list of TODOs for a user.
 * - Generates response format as required by sync service doList() method.
 */


// Dependencies.
var async = require("async");
var winston = require("winston");
var constants = require("../../config/constants.js");
var utils = require("../../utils/utils.js");
var jsonUtils = require("../../utils/jsonUtils.js");
var responseUtils = require("../../utils/responseUtils.js");
var sessionManager = require("../../lib/session/sessionManager.js");


var ListResponseGenerator = function()
{
  var MODULE_NAME = "ListResponseGenerator: ";

  // Global level variables.
  var TODO_COLLECTION_NAME = "toDo", USER_COLLECTION_NAME = "user";

  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.getToDoList = getToDoList;


  /**
   * Function which gets called by sync service doList() method.
   * 
   * @params requestParams - Receives session id from client apps.
   * @params callback - returns success or failure callback.
   */
  function getToDoList(requestParams, callback)
  {
    // Validate session and get user details in response.
    getUserDetailsFromSession(requestParams, function handleUserDetailsResponse(userDetailsErrorData, userDetailsResponseData)
    {
      // If session is invalid return failure callback.
      if (userDetailsErrorData)
      {
        return callback(userDetailsErrorData, null);
      }

      // If session is valid, fetch list of TODOs for a user.
      fetchToDoListFromDatabase(userDetailsResponseData, function handleDatabaseResponse(databaseErrorData, databaseResponseData)
      {
        // If failed to fetch list of TODOs, return failure callback.
        if (databaseErrorData)
        {
          var errorResponse = responseUtils.constructErrorResponseJson(constants.RESP_BAD_INPUT, "Fetch ToDo", "Operation Failed", error.message);
          return callback(errorResponse, null);
        }

        // Generate response in a format needed by cloud sync service doList() method.
        generateExpectedSyncServiceResponse(databaseResponseData, function handleExpectedResponse(successData)
        {
          // Return final doList() response.
          return callback(null, successData);
        });
      });
    });
  };


  /**
   * Function to fetch list of TODOs from database.
   * - Validates fethced database response.
   * - Sort fetched data according to TODO deadline.
   *
   * @params userDetails - receives user id and role as parameters.
   * @params callback - returns success or failure callback.
   */
  function fetchToDoListFromDatabase(userDetails, callback)
  {
    var METHOD_NAME = "fetchToDoListFromDatabase(): ";
    winston.info(MODULE_NAME + METHOD_NAME + "Fetching ToDos");

    // Extract user id and role from request parameters.
    var userId = userDetails.userId;
    var userRole = userDetails.role;

    // If user role is admin keep search criteria empty to get all TODOs.
    var toDoSearchCriteriaObject = null;

    // If user role is not admin get list of TODOs assigned to a user.
    if (userRole != constants.ROLE_ADMIN)
    {
      toDoSearchCriteriaObject =
      {
        "assignedTo": userId
      };
    }

    // Fetch list of TODOs from ToDo collection.
    listFromCollection(TODO_COLLECTION_NAME, toDoSearchCriteriaObject, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
    {
      // If we find any error reading ToDO collection, return failure callback.
      if (toDoErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from ToDo collection - " + JSON.stringify(toDoErrorData));
        return callback(
        {
          message: "Error reading data from ToDo collection."
        }, null);
      }

      // Validate fetched database response.
      validateFetchedToDoData(toDoResponseData, function handleValidationResponse(validationErrorData, validationResponseData)
      {
        // If database response is invalid, return failure callback.
        if (validationErrorData)
        {
          return callback(
          {
            message: validationErrorData.message
          }, null);
        }
      });

      // If there are no TODOs for user or admin, send empty success response.
      if (toDoResponseData.count == 0)
      {
        return callback(null, {});
      }

      // Get list of TODOs from database response.
      var toDoData = toDoResponseData.list;
      winston.info("toDoList:" + JSON.stringify(toDoData));

      var responseTodoList = [];

      // Asyncronously go through each TODO and fetch name of user from User collection.
      var myQ = async.queue(function(task, callback)
      {
        // Extract user id from TODO details.
        var userGuid = task.toDoData.fields.assignedTo;

        // Fetch user details based on user id.
        readFromCollection(USER_COLLECTION_NAME, userGuid, function handleUserDataResponse(userErrorData, userResponseData)
        {
          // If we find any error reading User collection, return failure callback.
          if (userErrorData)
          {
            winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from User collection - " + JSON.stringify(userErrorData));

            return callback(
            {
              message: "Error reading data from ToDo collection."
            }, null);
          }

          // Extract user name from user details and TODO deadline from TODO details.
          var userName = userResponseData.fields.basicInfo.firstName;
          var deadline = task.toDoData.fields.deadline.split("T");

          // Generate final TODO details response object.
          var responseTodoObject =
          {
            "toDoId": task.toDoData.guid,
            "title": task.toDoData.fields.title,
            "description": task.toDoData.fields.description,
            "deadline": deadline[0],
            "assignedTo":
            {
              "userId": userGuid,
              "userName": userName
            },
            "location":
            {
              "address": task.toDoData.fields.location.address,
              "latitude": task.toDoData.fields.location.latitude,
              "longitude": task.toDoData.fields.location.longitude
            },
            "status": task.toDoData.fields.status,
            "note": task.toDoData.fields.note,
            "completedDetails": task.toDoData.fields.completedDetails
          };

          // Add TODO details response object to TODOs collection.
          responseTodoList.push(responseTodoObject);

          callback();
        }, 5);
      });

      // Iterate through each TODO.
      for (var i = 0; i < toDoData.length; i++)
      {
        // Push TODO data in the async queue.
        myQ.push({"toDoData": toDoData[i]});
      }

      // Handle response generated after async.queue completes its processing.
      myQ.drain = function()
      {
        winston.info("responseTodoList after async:" + JSON.stringify(responseTodoList));

        // Sort final list of TODOs on deadline timestamp.
        sortFetchedToDosInAscendingOrderOnDeadline(responseTodoList, function hadleToDoSortDataResponse(toDoSortDataError, toDosortDataResponse)
        {
          // If we find any error sorting ToDO List, return failure callback.
          if (toDoSortDataError)
          {
            winston.error(MODULE_NAME + METHOD_NAME + "Error occur during sorting of toDo List  - " + JSON.stringify(toDoSortDataError));
            return callback(
            {
              message: "Error occur during sorting of toDo List."
            }, null);
          }

          // Return sorted TODOs list in response.
          winston.info("Response after sorted ToDo list:" + JSON.stringify(toDosortDataResponse));
          return callback(null, toDosortDataResponse);
        });
      }
    });
  };


  /**
   * Function to generate final response as expected by cloud sync service doList() method.
   * 
   * @params sortedData - sorted list of TODOs.
   * @params callback - expected doList() method response.
   */
  function generateExpectedSyncServiceResponse(sortedData, callback)
  {
    var expectedSyncResponseData = {};

    // Iterate through list of TODOs.
    for (var i = 0; i < sortedData.length; i++)
    {
      // Generate response as "guid": {toDoDetails}.
      winston.info("TODO Data - " + JSON.stringify(sortedData[i]));
      expectedSyncResponseData[sortedData[i].toDoId] = sortedData[i];
    }

    return callback(expectedSyncResponseData);
  };


  /**
   * Function to fetch session parameters.
   * - Validates session id.
   * - Extracts session parameters.
   * 
   * @params requestParams - receives session id.
   * @params callback - returns success or failure callback.
   */
  function getUserDetailsFromSession(requestParams, callback)
  {
    var METHOD_NAME = "getUserDetailsFromSession(): ";

    // SessionId?
    var sessionId = jsonUtils.getPath(requestParams, "request.header.sessionId");

    // If session id is blank return failure callback.
    if (utils.isBlank(sessionId))
    {
      var responseJson = responseUtils.constructAuthFailureResponseJson();
      return callback(responseJson, null);
    }

    // SessionId valid?
    sessionManager.isValidSession(sessionId, function handleIsValidSessionResponse(errorMessage, isValidSession)
    {
      // If invalid sessionId, return failure callback.
      if (!isValidSession)
      {
        var responseJson = responseUtils.constructAuthFailureResponseJson(sessionId);
        winston.error(MODULE_NAME + METHOD_NAME + "Invalid session response - " + JSON.stringify(responseJson));
        return callback(responseJson, null);
      }

      // Fetch required parameters from the session.
      sessionManager.getSession(requestParams.request.header.sessionId, function handleGetSessionResponse(errorMessage, sessionObject)
      {
        // If failed to fetch session parameters, return failure callback.
        if (errorMessage)
        {
          var responseJson = responseUtils.constructAuthFailureResponseJson();
          winston.error(MODULE_NAME + METHOD_NAME + "Unable to retrieve session parameters - " + JSON.stringify(responseJson));
          return callback(responseJson, null);
        }

        // If session parameters not found, return failure callback.
        if (sessionObject == null || sessionObject == undefined)
        {
          var responseJson = responseUtils.constructAuthFailureResponseJson();
          winston.error(MODULE_NAME + METHOD_NAME + "Empty session parameters - " + JSON.stringify(responseJson));
          return callback(responseJson, null);
        }

        // Validate session.
        var validationResponse = validateSessionParameters(sessionObject);

        // If session parameters are invalid, return failure callback.
        if (!validationResponse.status)
        {
          var errorResponse = responseUtils.constructErrorResponseJson(constants.RESP_AUTH_FAILED, "Fetch ToDo", "Operation Failed", validationResponse.message);
          return callback(errorResponse, null);
        }

        // Construct required user details to be sent in response.
        var userDetails =
        {
          "userId": sessionObject.userId,
          "role": sessionObject.role
        };

        return callback(null, userDetails);
      });
    });
  };

  /**
   * Validate session parameters.
   *
   * @returns jsonObject
   */
  function validateSessionParameters(sessionObject)
  {
    var METHOD_NAME = "validateSessionParameters(): ";

    winston.info(MODULE_NAME + METHOD_NAME + "Validating session parameters.");

    // Generate response variable to be sent.
    var response =
    {
      status: true,
      message: ""
    };

    // UserRole exist?
    if (!jsonUtils.isPath(sessionObject, "role") || utils.isBlank(jsonUtils.getPath(sessionObject, "role")))
    {
      response.status = false;
      response.message += "UserRole not exist in session parameters. ";
    }

    // UserId exists?
    if (!jsonUtils.isPath(sessionObject, "userId") || utils.isBlank(jsonUtils.getPath(sessionObject, "userId")))
    {
      response.status = false;
      response.message += "UserId not exist in session parameters. ";
    }

    winston.info(MODULE_NAME + METHOD_NAME + "Response after validating request parameters - " + JSON.stringify(response));

    return response;
  };


  function validateFetchedToDoData(fetchedDataFromDatabase, callback)
  {
    // If response is empty.
    if (fetchedDataFromDatabase == null || fetchedDataFromDatabase == undefined)
    {
      return callback(
      {
        message: "ToDo information not found."
      }, null);
    }

    // Count exists?
    if (!jsonUtils.isPath(fetchedDataFromDatabase, "count") || utils.isBlank(jsonUtils.getPath(fetchedDataFromDatabase, "count")))
    {
      return callback(
      {
        message: "ToDo information not found."
      }, null);
    }

    // list exists?
    if (!jsonUtils.isPath(fetchedDataFromDatabase, "list") || utils.isBlank(jsonUtils.getPath(fetchedDataFromDatabase, "list")))
    {
      return callback(
      {
        message: "ToDo information not found."
      }, null);
    }
  };


  /**
   * Function which will sort fetched ToDo records in ascending order based on deadline timestamp.
   * - Receives fetched ToDos collection data from database.
   * - Returns sorted data.
   */
  function sortFetchedToDosInAscendingOrderOnDeadline(fetchToDosResponseData, callback)
  {
    var METHOD_NAME = "sortFetchedToDosInAscendingOrderOnDeadline(): ";

    var compareToDos = function compare(toDoDataOne, toDoDataTwo)
    {
      var toDoDataOneDeadline = new Date(toDoDataOne.deadline);
      var toDoDataTwoDeadline = new Date(toDoDataTwo.deadline);

      if (toDoDataOneDeadline.getTime() < toDoDataTwoDeadline.getTime())
      {
        return -1;
      }
      if (toDoDataOneDeadline.getTime() > toDoDataTwoDeadline.getTime())
      {
        return 1;
      }

      return 0;
    };

    fetchToDosResponseData.sort(compareToDos);

    return callback(null, fetchToDosResponseData);
  };


  /**
   * Function to retreive ToDo's data based on search criteria.
   * - Receives search criteria as parameters.
   * - Returns error or success response. 
   */
  function listFromCollection(collectionName, searchCriteriaObject, callback)
  {
    $fh.db(
    {
      "act": "list",
      "type": collectionName,
      "eq": searchCriteriaObject,
      "ne":
              {
                "status": constants.TODO_STATUS_COMPLETED
              }
    },
    function(error, responseData)
    {
      if (error)
      {
        return callback(error, null);
      }
      else
      {
        return callback(null, responseData);
      }
    });
  };


  /**
   * Function to retreive ToDo's data based on id.
   * - Receives ToDoId as parameters.
   * - Returns error or success response. 
   */
  function readFromCollection(collectionName, guid, callback)
  {
    $fh.db(
    {
      "act": "read",
      "type": collectionName,
      "guid": guid
    },
    function(error, responseData)
    {
      if (error)
      {
        return callback(error, null);
      }
      else
      {
        return callback(null, responseData);
      }
    });
  };
};

// Export module.
module.exports = new ListResponseGenerator();