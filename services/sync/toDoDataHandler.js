/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility functions to provide syncing capability for jobs list.
 * - Create TODO.
 * - Get list of TODOs for users.
 * - Get TODO details.
 * - Update TODO details.
 * - Delete TODO. 
 */

// Dependencies.
var winston = require("winston");

// Dependencies on Endpoint classes (we delegate work to these).
var listResponseGenerator = require("./listResponseGenerator.js");
var createToDoEndpoint = require("../../endpoints/createToDo.js");

var ToDosListDataHandler = function()
{
  // Global module level variables.
  var MODULE_NAME = "ToDosListDataHandler: ";

  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.doList = doList;
  this.doCreate = doCreate;
  this.doUpdate = doUpdate;
  this.doDelete = doDelete;
  this.doRead = doRead;
  this.doCollision = doCollision;

  /**
   * Sync service method to fetch list of TODOs.
   * 
   * @params datasetId - datasetId for which data to be synced.
   * @params params - request parameters from client app, sessionId in this case.
   * @params callback - returns list of TODOs or error, if any.
   */
  function doList(datasetId, params, callback, metadata)
  {
    var METHOD_NAME = "doList(): ";

    // Fetch TODO list.
    listResponseGenerator.getToDoList(params, function(error, response)
    {
      // If failed to generate TODO list, return failure callback.
      if (error)
      {
        winston.error("Error response from doList(): " + JSON.stringify(error));
        return callback(error, null);
      }

      return callback(null, response);
    });
  };


  /**
   * Sync service method to create TODO.
   * 
   * @params datasetId - datasetId for which data to be inserted.
   * @params params - request parameters from client app, TODO details to be inserted.
   * @params callback - returns success or failure response.
   */
  function doCreate(datasetId, params, callback, metadata)
  {
    var METHOD_NAME = "doCreate(): ";

    // Insert TODO into ToDo collection.
    createToDoEndpoint.createToDo(params, function(error, response)
    {
      // If failed to create TODO, return failure callback.
      if (error)
      {
        winston.error("Error response from doCreate(): " + JSON.stringify(error));
        return callback(error, null);
      }

      return callback(null, response);
    });
  };


  /**
   * Sync service method to read TODO details.
   * 
   * @params datasetId - datasetId from which TODO details to be fetched.
   * @params guid - id of TODO to be read.
   * @params callback - returns success or failure response.
   */
  function doRead(datasetId, guid, callback, metadata)
  {
    var METHOD_NAME = "doRead(): ";

    // Read TODO details from ToDo collection.
    readFromDatabase(datasetId, guid, function handleReadOperation(errorData, successData)
    {
      // If failed to read TODO details, return failure callback.
      if (errorData)
      {
        winston.error("Error response from doCreate(): " + JSON.stringify(errorData));
        return callback(errorData, null);
      }

      return callback(null, successData);
    });
  };


  /**
   * Sync service method to update TODO details.
   * 
   * @params datasetId - datasetId in which TODO details to be updated.
   * @params guid - id of TODO to be updated.
   * @params params - request parameters from client app, TODO details to be updated.
   * @params callback - returns success or failure response.
   */
  function doUpdate(datasetId, guid, params, callback, metadata)
  {
    var METHOD_NAME = "doUpdate(): ";

    // First, read TODO details to be updated.
    readFromDatabase(datasetId, guid, function handleReadOperation(errorData, successData)
    {
      // If failed to read TODO details, return failure callback.
      if (errorData)
      {
        return callback(errorData, null);
      }

      // Second, update TODO details fetched from database with TODO details received in parameters.
      var todoDetails = successData.fields;
      todoDetails.title = params.title;
      todoDetails.description = params.description;
      todoDetails.deadline = new Date(params.deadline).toISOString();
      todoDetails.location = params.location;
      todoDetails.status = params.status;
      todoDetails.note = params.note;
      todoDetails.assignedTo = params.assignedTo.userId;
      todoDetails.completedDetails = params.completedDetails;

      // Third, update TODO details in database.
      updateInDatabase(datasetId, guid, todoDetails, function handleUpdateOperation(updateErrorData, updateSuccessData)
      {
        // If failed to update TODO details, return failure callback.
        if (updateErrorData)
        {
          return callback(updateErrorData, null);
        }

        return callback(null, updateSuccessData);
      });
    });
  };


  /**
   * Sync service method to delete TODO details.
   * 
   * @params datasetId - datasetId from which TODO details to be deleted.
   * @params guid - id of TODO to be deleted.
   * @params callback - returns success or failure response.
   */
  function doDelete(datasetId, guid, callback, metadata)
  {
    var METHOD_NAME = "doDelete(): ";

    // Execute database query to delete TODO details.
    $fh.db(
    {
      "act": "delete",
      "type": datasetId,
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
   * Sync service method which resolves collisions.
   *
   * @params datasetId - datasetId in which collision has been detected.
   * @params timestamp - timestamp when collision occurred.
   * @params guid - id of TODO for which collision has been encountered.
   * @params preData - TODO details before collision occurred.
   * @params postData - TODO details for which collision occurred.
   */
  function doCollision(datasetId, hash, timestamp, guid, preData, postData, metadata)
  {
    var METHOD_NAME = "doCollision(): ";

    // If collision has occurred for deleting TODO details.   
    if (postData == null)
    {
      $fh.db(
      {
        "act": "delete",
        "type": datasetId,
        "guid": guid
      },
      function(error, responseData)
      {
        if (error)
        {
          winston.error(MODULE_NAME + METHOD_NAME + "Error resolving collision - " + JSON.stringify(error));
        }
        else
        {
          winston.info(MODULE_NAME + METHOD_NAME + "success response from collision - " + JSON.stringify(successData));
        }
      });
    }

    // If collision has occurred for updating TODO details, read TODO details and update it.
    readFromDatabase(datasetId, guid, function handleReadOperation(errorData, successData)
    {
      // If failed to read TODO details, return.
      if (errorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error resolving collision - " + JSON.stringify(postData));
        return;
      }

      // Update TODO details with updated TODO details i.e. postData.
      var todoDetails = successData.fields;
      todoDetails.title = postData.title;
      todoDetails.description = postData.description;
      todoDetails.deadline = new Date(postData.deadline).toISOString();
      todoDetails.location = postData.location;
      todoDetails.status = postData.status;
      todoDetails.note = postData.note;
      todoDetails.assignedTo = postData.assignedTo.userId;
      todoDetails.completedDetails = postData.completedDetails;

      // Update TODO details in database.
      updateInDatabase(datasetId, guid, todoDetails, function handleUpdateOperation(updateErrorData, updateSuccessData)
      {
        if (updateErrorData)
        {
          winston.error(MODULE_NAME + METHOD_NAME + "Error resolving collision - " + JSON.stringify(postData));
        }
        else
        {
          winston.info(MODULE_NAME + METHOD_NAME + "success response from collision - " + JSON.stringify(successData));
        }
      });
    });
  };


  /**
   * Function to read data from database.
   *
   * @params datasetId - name of collection from which data to be read.
   * @params guid - id of record for which data to be read.
   * @params callback - success or failure callback.
   */
  function readFromDatabase(datasetId, guid, callback)
  {
    $fh.db(
    {
      "act": "read",
      "type": datasetId,
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
   * Function to update data in database.
   *
   * @params datasetId - name of collection in which data to be updated.
   * @params guid - id of record for which data to be updated.
   * @params data - details of data to be updated.
   * @params callback - success or failure callback.
   */
  function updateInDatabase(datasetId, guid, data, callback)
  {
    $fh.db(
    {
      "act": "update",
      "type": datasetId,
      "guid": guid,
      "fields": data
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
module.exports = new ToDosListDataHandler();