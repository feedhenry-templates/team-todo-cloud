/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility / helper functions to perform operations on ToDo collection.
 * - Insert default TODOs in database.
 * - Create TODOs.
 * - Get list of TODOs for user.
 * - Get list of completed TODOs for admin.
 * - Update TODO.
 * - Delete TODO.
 */


// Dependencies.
var winston = require("winston");
var utils = require("../utils/utils.js");
var jsonUtils = require("../utils/jsonUtils.js");
var constants = require("../config/constants.js");
var async = require("async");
var validation = require("../utils/daoValidation.js");
var fh = require('fh-mbaas-api');

var ToDoDAO = function()
{
  // Global module level variables.
  var MODULE_NAME = "ToDoDAO: ", TODO_COLLECTION_NAME = "toDo", USER_COLLECTION_NAME = "user";

  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.insertToDoIntoSystem = insertToDoIntoSystem;
  this.createToDo = createToDo;
  this.fetchToDos = fetchToDos;
  this.updateToDo = updateToDo;
  this.completeToDo = completeToDo;
  this.changeToDo = changeToDo;
  this.deleteToDo = deleteToDo;
  this.fetchCompletedToDos = fetchCompletedToDos;


  /**
   * Public function to create default TODOs in the system.
   * - Checks whether Role collection exists in the DB.
   * - If does not exist, create Role collection in the DB.
   */
  function insertToDoIntoSystem()
  {
    var METHOD_NAME = "createToDo(): ";

    winston.info(MODULE_NAME + METHOD_NAME + "Inserting ToDos in the System");

    // Get list of all defualt users existing in database from User collection.
    listFromCollection(USER_COLLECTION_NAME, null, function handleUserDataResponse(userErrorData, userResponseData)
    {
      // If failed to read users list from database, return.
      if (userErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Admin role not found in DB - " + JSON.stringify(userErrorData));
        return;
      }

      // Get list of users from database response.
      var userList = userResponseData.list;

      var userIdArray = [], userNameArray = [];

      // Iterate through all the users to get their ids and names.
      for (var i = 0; i < userList.length; i++)
      {
        var id = userList[i].guid;
        var userName = userList[i].fields.accountInfo.userName;

        // Ignore admin user and user 'Zeddmore'
        if (userName != constants.DEFAULT_ADMIN_USER_JANINE && userName != constants.DEFAULT_USER_ZEDDEMORE)
        {
          userIdArray.push(id);
          userNameArray.push(userName)
        }
      }

      var toDoList = [];

      // Construct collection of TODO objects to be inserted into database.
      var createToDoQueue = async.queue(function(task, callback)
      {
        // Get current system timestamp.
        var now = new Date();
        var createdDate = now.toISOString();

        // Construct first TODO.
        var toDoObjectOne =
        {
          "title": task.userNameArray + "'s ToDo 1",
          "description": "description 1",
          "createdOn": createdDate,
          "deadline": createdDate,
          "createdBy": task.userIdArray,
          "assignedTo": task.userIdArray,
          "status": constants.TODO_STATUS_NEW,
          "note": "",
          "location":
          {
            "address": "",
            "latitude": 12.4235,
            "longitude": 13.2445
          },
          "completedDetails":
          {
            "note": "",
            "completedOn": "",
            "photo": "",
            "location":
            {
              "address": "",
              "latitude": null,
              "longitude": null
            }
          }
        };

        // Construct second TODO.
        var toDoObjectTwo =
        {
          "title": task.userNameArray + "'s ToDo 2",
          "description": "description 2",
          "createdOn": createdDate,
          "deadline": createdDate,
          "createdBy": task.userIdArray,
          "assignedTo": task.userIdArray,
          "status": constants.TODO_STATUS_NEW,
          "note": "",
          "location":
          {
            "address": "",
            "latitude": 12.4235,
            "longitude": 13.2445
          },
          "completedDetails":
          {
            "note": "",
            "completedOn": "",
            "photo": "",
            "location":
            {
              "address": "",
              "latitude": null,
              "longitude": null
            }
          }
        };

        // Construct third TODO.
        var toDoObjectThree =
        {
          "title": task.userNameArray + "'s ToDo 3",
          "description": "description 3",
          "createdOn": createdDate,
          "deadline": createdDate,
          "createdBy": task.userIdArray,
          "assignedTo": task.userIdArray,
          "status": constants.TODO_STATUS_NEW,
          "note": "",
          "location":
          {
            "address": "",
            "latitude": 12.4235,
            "longitude": 13.2445
          },
          "completedDetails":
          {
            "note": "",
            "completedOn": "",
            "photo": "",
            "location":
            {
              "address": "",
              "latitude": null,
              "longitude": null
            }
          }
        };

        // Construct fourth TODO.
        var toDoObjectFour =
        {
          "title": task.userNameArray + "'s ToDo 4",
          "description": "description 4",
          "createdOn": createdDate,
          "deadline": createdDate,
          "createdBy": task.userIdArray,
          "assignedTo": task.userIdArray,
          "status": constants.TODO_STATUS_IN_PROGRESS,
          "note": "",
          "location":
          {
            "address": "",
            "latitude": 12.4235,
            "longitude": 13.2445
          },
          "completedDetails":
          {
            "note": "",
            "completedOn": "",
            "photo": "",
            "location":
            {
              "address": "",
              "latitude": null,
              "longitude": null
            }
          }
        };

        // Construct fifth TODO.
        var toDoObjectFive =
        {
          "title": task.userNameArray + "'s ToDo 5",
          "description": "description 5",
          "createdOn": createdDate,
          "deadline": createdDate,
          "createdBy": task.userIdArray,
          "assignedTo": task.userIdArray,
          "status": constants.TODO_STATUS_IN_PROGRESS,
          "note": "",
          "location":
          {
            "address": "",
            "latitude": 12.4235,
            "longitude": 13.2445
          },
          "completedDetails":
          {
            "note": "",
            "completedOn": "",
            "photo": "",
            "location":
                    {
                      "address": "",
                      "latitude": null,
                      "longitude": null
                    }
          }
        };

        // Construct sixth TODO.
        var toDoObjectSix =
        {
          "title": task.userNameArray + "'s ToDo 6",
          "description": "description 6",
          "createdOn": createdDate,
          "deadline": createdDate,
          "createdBy": task.userIdArray,
          "assignedTo": task.userIdArray,
          "status": constants.TODO_STATUS_REJECTED,
          "note": "",
          "location":
          {
            "address": "",
            "latitude": 12.4235,
            "longitude": 13.2445
          },
          "completedDetails":
          {
            "note": "",
            "completedOn": "",
            "photo": "",
            "location":
            {
              "address": "",
              "latitude": null,
              "longitude": null
            }
          }
        };

        // Construct seventh TODO.
        var toDoObjectSeven =
        {
          "title": task.userNameArray + "'s ToDo 7",
          "description": "description 7",
          "createdOn": createdDate,
          "deadline": createdDate,
          "createdBy": task.userIdArray,
          "assignedTo": task.userIdArray,
          "status": constants.TODO_STATUS_COMPLETED,
          "note": "",
          "location":
          {
            "address": "",
            "latitude": 22.4235,
            "longitude": 14.2445
          },
          "completedDetails":
          {
            "note": "Completed ToDo 7",
            "completedOn": createdDate,
            "photo": "bhdfenosodnchddbddwjbugewjcbjgejvambcsygjbcjbjslskajsdgwmbcgcbhcvjehuhbvv",
            "location":
            {
              "address": "",
              "latitude": 12.5533,
              "longitude": 18.1234
            }
          }
        };

        // Construct eightth TODO.
        var toDoObjectEight =
        {
          "title": task.userNameArray + "'s ToDo 8",
          "description": "description 8",
          "createdOn": createdDate,
          "deadline": createdDate,
          "createdBy": task.userIdArray,
          "assignedTo": task.userIdArray,
          "status": constants.TODO_STATUS_COMPLETED,
          "note": "",
          "location":
          {
            "address": "",
            "latitude": 12.4235,
            "longitude": 13.2445
          },
          "completedDetails":
          {
            "note": "Completed ToDo 8",
            "completedOn": createdDate,
            "photo": "gucegug3hbmowjhcwnhdechhceknheheebugewnjvbewgwbechcbejchwijcnchhcjlwjbgwe",
            "location":
            {
              "address": "",
              "latitude": 23.5533,
              "longitude": 24.1234
            }
          }
        };

        // Add all TODOs to collection object.
        toDoList.push(toDoObjectOne);
        toDoList.push(toDoObjectTwo);
        toDoList.push(toDoObjectThree);
        toDoList.push(toDoObjectFour);
        toDoList.push(toDoObjectFive);
        toDoList.push(toDoObjectSix);
        toDoList.push(toDoObjectSeven);
        toDoList.push(toDoObjectEight);
        callback();
      }, 2);

      // Iterate through user ids and user name lists and assign TODOs to each user.
      for (var i = 0; i < userIdArray.length; i++)
      {
        createToDoQueue.push({"userIdArray": userIdArray[i], "userNameArray": userNameArray[i]});
      }

      // Handle generated response, after async.queue finishes its processing.
      createToDoQueue.drain = function()
      {
        // Insert entire map into ToDo collection.
        insertIntoToDoDataCollection(TODO_COLLECTION_NAME, toDoList, function handleInsertResponse(error, responseData)
        {
          if (error)
          {
            winston.error(MODULE_NAME + METHOD_NAME + "Error inserting data into ToDo collection - " + JSON.stringify(error));
          }
          else
          {
            winston.info(MODULE_NAME + METHOD_NAME + "Data inserted into ToDo collection - " + JSON.stringify(responseData));
          }
        });
      };
    });
  };


  /**
   * Function to insert ToDo into database.
   * - Receives request parameter from endpoint.
   * - Sends response back to endpoint i.e. ToDo created or error, if any.
   */
  function createToDo(params, callback)
  {
    var METHOD_NAME = "createToDo(): ";

    // Get current system timestamp.
    var now = new Date();
    var createdDate = now.toISOString();

    // Construct ToDo collection data by extracting required fields from request parameters.
    var toDoCollectionDataObject =
    {
      "title": params.title,
      "description": params.description,
      "createdOn": createdDate,
      "deadline": new Date(params.deadline).toISOString(),
      "createdBy": params.userId,
      "assignedTo": params.assignedTo,
      "status": constants.TODO_STATUS_NEW,
      "note": "",
      "location":
      {
        "address": "",
        "latitude": params.latitude,
        "longitude": params.longitude
      },
      "completedDetails":
      {
        "note": "",
        "completedOn": "",
        "photo": "",
        "location":
        {
          "address": "",
          "latitude": null,
          "longitude": null
        }
      }
    };

    // Insert entire map into ToDo collection.
    insertIntoToDoDataCollection(TODO_COLLECTION_NAME, toDoCollectionDataObject, function handleInsertResponse(error, responseData)
    {
      // If failed to insert data into collection, return failure callback.
      if (error)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error inserting data into ToDo collection - " + JSON.stringify(error));
        return callback(
        {
          message: "Error inserting data into ToDo collection."
        }, null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Data inserted into ToDo collection - " + JSON.stringify(responseData));
      var toDoId = responseData.guid;
      return callback(null, toDoId);
    });
  };


  /**
   * Function to fetch ToDo.
   * - Receives request parameter from endpoint.
   * - Sends response back to endpoint i.e. ToDo created.
   */
  function fetchToDos(params, callback)
  {
    var METHOD_NAME = "fetchToDos(): ";
    winston.info(MODULE_NAME + METHOD_NAME + "Fetching ToDos");

    // Extract user id and role from request parameters.
    var userId = params.userId;
    var userRole = params.role;

    // Set search criteria null for admin user. So it will fetch all TODOs.
    var toDoSearchCriteriaObject = null;

    // If user is not admin user, fetch only TODOs which are assigned to particular user.
    if (userRole != constants.ROLE_ADMIN)
    {
      // Generate databse search criteria object.
      toDoSearchCriteriaObject =
      {
        "assignedTo": userId
      };
    }

    // Get list of TODOs for user.
    listFromCollection(TODO_COLLECTION_NAME, toDoSearchCriteriaObject, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
    {
      // If we find any error reading ToDo collection, return failure callback.
      if (toDoErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from ToDo collection - " + JSON.stringify(toDoErrorData));
        return callback(
        {
          message: "Error reading data from ToDo collection."
        }, null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection - " + JSON.stringify(toDoResponseData));

      // Validate fetched database response.
      var validateResponseData = validation.validateToDoResponseData(toDoResponseData);

      // If database response is not valid, return failure callback.
      if (!validateResponseData.status)
      {
        return callback(
        {
          message: validateResponseData.errorMessage
        }, null);
      }

      // Extract list of TODOs from database response.
      var toDoData = toDoResponseData.list;
      winston.info("toDoList:" + JSON.stringify(toDoData));

      var responseTodoList = [];

      // Asyncronously go through each TODO details and get user name for assigned user id.
      var toDoQueue = async.queue(function(task, callback)
      {
        // Extract user id from TODO details.
        var userGuid = task.toDoData.fields.assignedTo;

        // Fetch user details from User collection based on userId.
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

          // Get user name from fetch user details.
          var userName = userResponseData.fields.basicInfo.firstName;
          var deadline = task.toDoData.fields.deadline.split("T");

          // Construct final TODO details response to be sent.
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
            "note": task.toDoData.fields.note
          };

          // Add TODO data object into TODOs collection object.
          responseTodoList.push(responseTodoObject);

          callback();
        }, 5);
      });

      // Iterate through list of TODOs.
      for (var i = 0; i < toDoData.length; i++)
      {
        // Push TODO data in async queue.
        toDoQueue.push({"toDoData": toDoData[i]});
      }

      // Handle final response generated, after async.queue finishes its processing.
      toDoQueue.drain = function()
      {
        winston.info("responseTodoList after async:" + JSON.stringify(responseTodoList));

        // Sort fetched TODOs collection in ascending order.
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

          // Send success response back to endpoint.
          var sortedToDoData = toDosortDataResponse;
          winston.info("Response after sorted ToDo list:" + JSON.stringify(sortedToDoData));
          return callback(null, responseTodoList);
        });
      }
    });
  };


  /**
   * Function to update ToDo.
   * - Receives request parameter from endpoint.
   * - Sends response back to endpoint i.e. ToDo updated.
   */
  function updateToDo(params, callback)
  {
    var METHOD_NAME = "updateToDo(): ";

    // Extract TODO id from request parameters.
    var todoGuid = params.toDoId;

    // Read TODO details from ToDo collection.
    readFromCollection(TODO_COLLECTION_NAME, todoGuid, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
    {
      // If we find any error reading ToDo collection, return failure callback.
      if (toDoErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from ToDo collection - " + JSON.stringify(toDoErrorData));

        return callback(
        {
          message: "Error reading data from ToDo collection."
        }, null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection - " + JSON.stringify(toDoResponseData));

      // Extract details of TODO from fetched database response.
      var toDoResponseFields = toDoResponseData.fields;

      // Update required TODO details by replacing values received in request parameters.
      toDoResponseFields.description = params.description,
      toDoResponseFields.deadline = new Date(params.deadline).toISOString(),
      toDoResponseFields.location.latitude = params.latitude,
      toDoResponseFields.location.longitude = params.longitude,
      toDoResponseFields.status = params.status,
      toDoResponseFields.note = params.note

      // Update TODO details in database.
      updateFromCollection(TODO_COLLECTION_NAME, todoGuid, toDoResponseFields, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
      {
        // If we find any error reading ToDo collection, return failure callback.
        if (toDoErrorData)
        {
          winston.error(MODULE_NAME + METHOD_NAME + "Error updating data into ToDo collection - " + JSON.stringify(toDoErrorData));

          return callback(
          {
            message: "Error updating data into ToDo collection."
          }, null);
        }

        // Return success response to endpoint.
        winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection after updating operation - " + JSON.stringify(toDoResponseData));
        return callback(null, toDoResponseData);
      });
    });
  };


  /**
   * Function to complete ToDo.
   * - Receives request parameter from endpoint.
   * - Sends response back to endpoint i.e. ToDo completed.
   */
  function completeToDo(params, callback)
  {
    var METHOD_NAME = "completeToDo(): ";

    // Extract TODO id from request parameters.
    var todoGuid = params.toDoId;

    // Read TODO details from ToDo collection.
    readFromCollection(TODO_COLLECTION_NAME, todoGuid, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
    {
      // If we find any error reading ToDo collection, return failure callback.
      if (toDoErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from ToDo collection - " + JSON.stringify(toDoErrorData));

        return callback(
        {
          message: "Error reading data from ToDo collection."
        }, null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection - " + JSON.stringify(toDoResponseData));

      // Extract details of TODO from fetched database response.
      var toDoResponseFields = toDoResponseData.fields;

      // Update required TODO details by replacing values received in request parameters.
      toDoResponseFields.status = constants.TODO_STATUS_COMPLETED,
      toDoResponseFields.completedDetails.note = params.note,
      toDoResponseFields.completedDetails.completedOn = new Date(params.completedOn).toISOString(),
      toDoResponseFields.completedDetails.location.latitude = params.latitude,
      toDoResponseFields.completedDetails.location.longitude = params.longitude,
      toDoResponseFields.completedDetails.photo = params.photo

      // Update TODO details in database.
      updateFromCollection(TODO_COLLECTION_NAME, todoGuid, toDoResponseFields, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
      {
        // If we find any error reading ToDo collection, return failure callback.
        if (toDoErrorData)
        {
          winston.error(MODULE_NAME + METHOD_NAME + "Error updating data into ToDo collection - " + JSON.stringify(toDoErrorData));

          return callback(
          {
            message: "Error updating data into ToDo collection."
          }, null);
        }

        // Return success response to endpoint.
        winston.error(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection after updating operation - " + JSON.stringify(toDoResponseData));
        return callback(null, toDoResponseData);
      });
    });
  };


  /**
   * Function to change ToDo.
   * - Receives request parameter from endpoint.
   * - Sends response back to endpoint i.e. ToDo changed.
   */
  function changeToDo(params, callback)
  {
    var METHOD_NAME = "changeToDo(): ";

    // Extract TODO id from request parameters.
    var todoGuid = params.toDoId;

    // Read TODO details from ToDo collection.
    readFromCollection(TODO_COLLECTION_NAME, todoGuid, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
    {
      // If we find any error reading ToDo collection, return failure callback.
      if (toDoErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from ToDo collection - " + JSON.stringify(toDoErrorData));

        return callback(
        {
          message: "Error reading data from ToDo collection."
        }, null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection - " + JSON.stringify(toDoResponseData));

      // Extract details of TODO from fetched database response.
      var toDoResponseFields = toDoResponseData.fields;

      // Update required TODO details by replacing values received in request parameters.
      toDoResponseFields.title = params.title,
      toDoResponseFields.description = params.description,
      toDoResponseFields.deadline = params.deadline,
      toDoResponseFields.assignedTo = params.assignedTo,
      toDoResponseFields.location.latitude = params.latitude,
      toDoResponseFields.location.longitude = params.longitude,

      // Update TODO details in database.
      updateFromCollection(TODO_COLLECTION_NAME, todoGuid, toDoResponseFields, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
      {
        // If we find any error reading ToDo collection, return failure callback.
        if (toDoErrorData)
        {
          winston.error(MODULE_NAME + METHOD_NAME + "Error updating data into ToDo collection during changing operation - " + JSON.stringify(toDoErrorData));

          return callback(
          {
            message: "Error updating data into ToDo collection during changing operation."
          }, null);
        }

        // Return success response to endpoint.
        winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection after changing operation - " + JSON.stringify(toDoResponseData));
        return callback(null, toDoResponseData);
      });
    });
  };


  /**
   * Function to delete ToDo.
   * - Receives request parameter from endpoint.
   * - Sends response back to endpoint i.e. ToDo deleted.
   */
  function deleteToDo(params, callback)
  {
    var METHOD_NAME = "deleteToDo(): ";

    // Extract TODO id from request parameters.
    var todoGuid = params.toDoId;

    // Remove TODO record from database.
    deleteFromCollection(TODO_COLLECTION_NAME, todoGuid, function handleToDoDataResponse(toDoErrorData, toDoResponseData)
    {
      // If we find any error deleting ToDo collection, return failure callback.
      if (toDoErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error deleting data from ToDo collection - " + JSON.stringify(toDoErrorData));

        return callback(
        {
          message: "Error deleting data from ToDo collection."
        }, null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection - " + JSON.stringify(toDoResponseData));

      // Return success response to endpoint.
      return callback(null, toDoResponseData);
    });
  };


  /**
   * Function to fetch list of completed TODOs.
   * - Receives request parameter from endpoint.
   * - Sends response back to endpoint i.e. list of completed TODOs.
   */
  function fetchCompletedToDos(params, callback)
  {
    var METHOD_NAME = "fetchCompletedToDos():";
    winston.info(MODULE_NAME + METHOD_NAME + "Fetching completed ToDos");

    // Construct search criteria object.
    var toDoSearchCriteriaObject =
    {
      "status": constants.TODO_STATUS_COMPLETED
    };

    // Fetch list of completed TODOs from ToDo collection.
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

      winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection - " + JSON.stringify(toDoResponseData));

      // Validate fetched completed TODO database response.
      var validateResponseData = validation.validateToDoResponseData(toDoResponseData);

      // If fetched database response is invalid, return failure callback.
      if (!validateResponseData.status)
      {
        return callback(
        {
          message: validateResponseData.errorMessage
        }, null);
      }

      // Extract list of completed TODOs from fetched database response.
      var toDoData = toDoResponseData.list;
      winston.info("toDoList:" + JSON.stringify(toDoData));

      var responseTodoList = [];

      // Asyncronously go through each completed TODO details and get user name for assigned user id.
      var toDoQueue = async.queue(function(task, callback)
      {
        // Extract userId from TODO details.
        var userGuid = task.toDoData.fields.assignedTo;

        // Fetch user details from User collection.
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

          // Extract name of user from fetched user details.
          var userName = userResponseData.fields.basicInfo.firstName;
          var deadline = task.toDoData.fields.deadline.split("T");

          // Extract TODO details to be sent in response.
          var completedOn = task.toDoData.fields.completedDetails.completedOn.split("T");
          var completedDate = completedOn[0];
          var time = completedOn[1].split(":");
          var completedTime = time[0] + ":" + time[1]

          // Construct final TODO details response object.
          var responseTodoObject =
          {
            "toDoId": task.toDoData.guid,
            "title": task.toDoData.fields.title,
            "description": task.toDoData.fields.description,
            "deadline": deadline[0],
            "requiredLocation":
            {
              "latitude": task.toDoData.fields.location.latitude,
              "longitude": task.toDoData.fields.location.longitude
            },
            "completedBy": userName,
            "completedOn": completedDate + " " + completedTime,
            "whereCompleted":
            {
              "latitude": task.toDoData.fields.completedDetails.location.latitude,
              "longitude": task.toDoData.fields.completedDetails.location.longitude
            },
            "note": task.toDoData.fields.completedDetails.note,
            "photo": task.toDoData.fields.completedDetails.photo
          };

          // Add completed TODO data object into collection.
          responseTodoList.push(responseTodoObject);

          callback();
        }, 5);
      });

      // Iterate through list of completed TODOs.
      for (var i = 0; i < toDoData.length; i++)
      {
        // Push the TODO data in the async queue.
        toDoQueue.push({"toDoData": toDoData[i]});
      }

      // Handle response generated after async.queue finishes its processing.
      toDoQueue.drain = function()
      {
        winston.info("responseCompletedTodoList after async:" + JSON.stringify(responseTodoList));

        // Sort list of completed TODOs.
        sortCompletedFetchedToDosInAscendingOrder(responseTodoList, function hadleToDoSortDataResponse(toDoSortDataError, toDosortDataResponse)
        {
          // If we find any error sorting ToDO List, return failure callback.
          if (toDoSortDataError)
          {
            winston.error(MODULE_NAME + METHOD_NAME + "Error occur during sorting of completed toDo List  - " + JSON.stringify(toDoSortDataError));
            return callback(
            {
              message: "Error occur during sorting of completed toDo List."
            }, null);
          }

          // Return success response to endpoint.
          var sortedToDoData = toDosortDataResponse;
          winston.info("Response after sorted completed ToDo list:" + JSON.stringify(sortedToDoData));
          return callback(null, responseTodoList);
        });
      }
    });
  };


  /**
   * Private function which will insert entire object into collection.
   *
   * @param collectionName - Name of collection in which data to be inserted.
   * @param collectionObject - Object containing data to be inserted.
   * @returns callback - Callback containing error or response data after performing insert operation.
   */
  function insertIntoToDoDataCollection(collectionName, collectionObject, callback)
  {
    fh.db(
    {
      "act": "create",
      "type": collectionName,
      "fields": collectionObject
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
    fh.db(
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


  /**
   * Function to retreive ToDo's data based on search criteria.
   * - Receives search criteria as parameters.
   * - Returns error or success response.
   */
  function listFromCollection(collectionName, searchCriteriaObject, callback)
  {
    fh.db(
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
   * Function to update ToDo's data based on update criteria.
   * - Receives update criteria as parameters.
   * - Returns error or success response.
   */
  function updateFromCollection(collectionName, guid, updateCriteriaObject, callback)
  {
    fh.db(
    {
      "act": "update",
      "type": collectionName,
      "guid": guid,
      "fields": updateCriteriaObject
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
   * Function to delete ToDo's data based on guid.
   * - Receives ToDoId as parameters.
   * - Returns error or success response.
   */
  function deleteFromCollection(collectionName, guid, callback)
  {
    fh.db(
    {
      "act": "delete",
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


  /**
   * Function which will sort fetched ToDo records in ascending order based on 'deadline' timestamp.
   * - Receives fetched ToDos collection data from database.
   * - Returns sorted data.
   */
  function sortFetchedToDosInAscendingOrderOnDeadline(fetchToDosResponseData, callback)
  {
    var METHOD_NAME = "sortFetchedToDosInAscendingOrderOnDeadline(): ";

    // Function which will receive two TODO data objects to be compared.
    var compareToDos = function compare(toDoDataOne, toDoDataTwo)
    {
      // Extract deadline timestamp for each TODO.
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

    // Sort entire list of TODOs.
    fetchToDosResponseData.sort(compareToDos);
    return callback(null, fetchToDosResponseData);
  };


  /**
   * Function which will sort fetched ToDo records in ascending order based on 'completed on' timestamp.
   * - Receives fetched ToDos collection data from database.
   * - Returns sorted data.
   */
  function sortCompletedFetchedToDosInAscendingOrder(fetchCompletedToDosResponseData, callback)
  {
    var METHOD_NAME = "sortCompletedFetchedToDosInAscendingOrder(): ";

    // Function which will receive two TODO data objects to be compared.
    var compareCompletedToDos = function compare(toDoDataOne, toDoDataTwo)
    {
      // Extract completedOn timestamp for each TODO.
      var toDoDataOneCompletedOn = new Date(toDoDataOne.completedOn);
      var toDoDataTwoCompletedOn = new Date(toDoDataTwo.completedOn);

      if (toDoDataOneCompletedOn.getTime() < toDoDataTwoCompletedOn.getTime())
      {
        return -1;
      }
      if (toDoDataOneCompletedOn.getTime() > toDoDataTwoCompletedOn.getTime())
      {
        return 1;
      }

      return 0;
    };

    // Sort entire list of TODOs.
    fetchCompletedToDosResponseData.sort(compareCompletedToDos);
    return callback(null, fetchCompletedToDosResponseData);
  };
};

// Export module.
module.exports = new ToDoDAO();
